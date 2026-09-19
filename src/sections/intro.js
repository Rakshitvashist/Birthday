import * as THREE from 'three';
import { gsap } from 'gsap';

// Cinematic intro: thousands of particles swirl, form a heart, then form her name,
// then scatter as the real heading fades in.

const COUNT = window.innerWidth < 600 ? 4500 : 7000;

function softDot() {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const g = c.getContext('2d');
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grad.addColorStop(0, 'rgba(255,255,255,1)');
  grad.addColorStop(0.35, 'rgba(255,255,255,0.7)');
  grad.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = grad;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function heartTargets(n, width) {
  const out = new Float32Array(n * 3);
  const s = width / 34; // parametric heart spans ~32 units wide
  for (let i = 0; i < n; i++) {
    const t = Math.random() * Math.PI * 2;
    // Fill the heart, denser toward the edge for a crisp outline.
    const r = Math.pow(Math.random(), 0.35);
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    out[i * 3] = x * r * s;
    out[i * 3 + 1] = (y * r + 1) * s;
    out[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
  }
  return out;
}

function textTargets(n, text, width) {
  const c = document.createElement('canvas');
  const W = 1000, H = 320;
  c.width = W; c.height = H;
  const g = c.getContext('2d');
  g.fillStyle = '#fff';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let size = 190;
  do {
    g.font = `italic 600 ${size}px "Cormorant Garamond", Georgia, serif`;
    size -= 6;
  } while (g.measureText(text).width > W * 0.92 && size > 40);
  g.fillText(text, W / 2, H / 2);
  const data = g.getImageData(0, 0, W, H).data;
  const pts = [];
  for (let y = 0; y < H; y += 2) {
    for (let x = 0; x < W; x += 2) {
      if (data[(y * W + x) * 4 + 3] > 128) pts.push(x, y);
    }
  }
  const out = new Float32Array(n * 3);
  const scale = width / W;
  for (let i = 0; i < n; i++) {
    const k = Math.floor(Math.random() * (pts.length / 2)) * 2;
    out[i * 3] = (pts[k] - W / 2) * scale + (Math.random() - 0.5) * 0.08;
    out[i * 3 + 1] = (H / 2 - pts[k + 1]) * scale + (Math.random() - 0.5) * 0.08;
    out[i * 3 + 2] = (Math.random() - 0.5) * 1.2;
  }
  return out;
}

function scatterTargets(n, spread) {
  const out = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    out[i * 3] = (Math.random() - 0.5) * spread * 2;
    out[i * 3 + 1] = (Math.random() - 0.5) * spread * 2;
    out[i * 3 + 2] = (Math.random() - 0.5) * spread;
  }
  return out;
}

export function mountIntro(host, content) {
  const c = content.intro;
  const section = document.createElement('section');
  section.className = 'section intro';
  section.innerHTML = `
    <div class="intro-text">
      <h1>${c.lines[0]}<span class="name">${c.lines[1]}</span></h1>
      <p class="sub">${c.subtitle}</p>
    </div>
    <div class="scroll-cue" style="opacity:0">Scroll</div>`;
  host.appendChild(section);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  section.prepend(renderer.domElement);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 200);
  camera.position.z = 30;

  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const rose = new THREE.Color('#ff6b9d'), gold = new THREE.Color('#e9c46a'), white = new THREE.Color('#fff0f5');
  for (let i = 0; i < COUNT; i++) {
    const r = Math.random();
    const cc = r < 0.55 ? rose : r < 0.85 ? gold : white;
    col[i * 3] = cc.r; col[i * 3 + 1] = cc.g; col[i * 3 + 2] = cc.b;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const mat = new THREE.PointsMaterial({
    size: 0.22, map: softDot(), vertexColors: true, transparent: true, opacity: 0,
    depthWrite: false, blending: THREE.AdditiveBlending, sizeAttenuation: true,
  });
  scene.add(new THREE.Points(geo, mat));

  let target = null;
  const speed = new Float32Array(COUNT).map(() => 0.03 + Math.random() * 0.05);
  const phase = new Float32Array(COUNT).map(() => Math.random() * Math.PI * 2);
  let running = false, raf = 0, t0 = performance.now();

  function visibleWidth() {
    const h = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    return h * camera.aspect;
  }
  function resize() {
    const w = section.clientWidth, h = section.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  window.addEventListener('resize', resize);
  resize();

  function frame() {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    const p = geo.attributes.position.array;
    if (target) {
      for (let i = 0; i < COUNT; i++) {
        const k = speed[i];
        const j = i * 3;
        const wob = Math.sin(t * 1.6 + phase[i]) * 0.06;
        p[j] += (target[j] + wob - p[j]) * k;
        p[j + 1] += (target[j + 1] + Math.cos(t * 1.3 + phase[i]) * 0.06 - p[j + 1]) * k;
        p[j + 2] += (target[j + 2] - p[j + 2]) * k;
      }
    }
    geo.attributes.position.needsUpdate = true;
    scene.rotation.y = Math.sin(t * 0.25) * 0.08;
    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  // Stop rendering when the intro is scrolled away, resume when it comes back.
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running && target) { running = true; frame(); }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
  }, { threshold: 0.05 }).observe(section);

  const h1 = section.querySelector('h1');
  const sub = section.querySelector('.sub');
  const cue = section.querySelector('.scroll-cue');
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  async function play() {
    await document.fonts.ready;
    const w = visibleWidth();
    // start as a wide scattered cloud
    target = scatterTargets(COUNT, w * 1.4);
    geo.attributes.position.array.set(target);
    running = true; frame();
    gsap.to(mat, { opacity: 0.9, duration: 1.4 });
    await wait(900);
    target = heartTargets(COUNT, Math.min(w * 0.82, 24));
    await wait(3200);
    target = textTargets(COUNT, c.lines[1], Math.min(w * 0.94, 30));
    await wait(3600);
    target = scatterTargets(COUNT, w * 2.2);
    gsap.to(mat, { opacity: 0.18, duration: 2.2, ease: 'power2.out' });
    await wait(500);
    gsap.timeline()
      .to(h1, { opacity: 1, y: 0, duration: 1.4, ease: 'power3.out' }, 0)
      .from(h1, { y: 24 }, 0)
      .to(sub, { opacity: 1, duration: 1.2 }, 0.8)
      .to(cue, { opacity: 1, duration: 1 }, 1.6);
    await wait(1600);
  }

  return { play };
}
