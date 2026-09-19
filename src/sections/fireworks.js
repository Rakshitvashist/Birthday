import { gsap } from 'gsap';

// Fireworks over a city skyline. Each tap launches a rocket whose burst spells the next letter of her name.
export function mountFireworks(host, content) {
  const c = content.fireworks;
  const letters = content.name.toUpperCase().split('');
  const section = document.createElement('section');
  section.className = 'section fireworks';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="fw-wrap reveal">
        <canvas></canvas>
        <div class="fw-letters">${letters.map((l) => `<span>${l}</span>`).join('')}</div>
      </div>
      <p class="fw-message">${c.finaleMessage}</p>
    </div>`;
  host.appendChild(section);

  const wrap = section.querySelector('.fw-wrap');
  const canvas = section.querySelector('canvas');
  const letterEls = [...section.querySelectorAll('.fw-letters span')];
  const message = section.querySelector('.fw-message');
  const ctx = canvas.getContext('2d');
  const palette = ['#ff6b9d', '#e9c46a', '#4fc3f7', '#b68cff', '#5ec27f', '#ff8c5a', '#ffffff'];
  let W = 0, H = 0, dpr = 1, buildings = [], stars = [], rockets = [], particles = [], running = false, raf = 0, lastT = 0;
  let next = 0, finaleDone = false;

  function layout() {
    W = wrap.clientWidth; H = wrap.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    buildings = [];
    let x = -10;
    while (x < W + 10) {
      const w = 18 + Math.random() * 34, h = 40 + Math.random() * 110;
      const windows = [];
      for (let wy = H - h + 8; wy < H - 6; wy += 9) for (let wx = x + 4; wx < x + w - 4; wx += 7) if (Math.random() < 0.45) windows.push([wx, wy, Math.random()]);
      buildings.push({ x, w, h, windows });
      x += w + 2;
    }
    stars = Array.from({ length: 60 }, () => ({ x: Math.random() * W, y: Math.random() * H * 0.6, a: Math.random() }));
  }

  function letterPoints(ch) {
    const off = document.createElement('canvas');
    const S = 160; off.width = S; off.height = S;
    const g = off.getContext('2d');
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = `700 ${S * 0.85}px "Cormorant Garamond", Georgia, serif`;
    g.fillText(ch, S / 2, S / 2);
    const d = g.getImageData(0, 0, S, S).data;
    const pts = [];
    for (let y = 0; y < S; y += 4) for (let x = 0; x < S; x += 4) if (d[(y * S + x) * 4 + 3] > 128) pts.push({ x: (x - S / 2) * 0.8, y: (y - S / 2) * 0.8 });
    return pts;
  }

  function burst(x, y, letter) {
    const color = palette[Math.floor(Math.random() * palette.length)];
    if (letter) {
      for (const p of letterPoints(letter)) particles.push({ x, y, ox: p.x, oy: p.y, age: 0, color, kind: 'letter', tw: Math.random() * 6 });
      // a ring of sparks around the letter
      for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; particles.push({ x, y, vx: Math.cos(a) * 3.5, vy: Math.sin(a) * 3.5, age: 0, color: '#fff', kind: 'spark' }); }
    } else {
      for (let i = 0; i < 90; i++) {
        const a = Math.random() * Math.PI * 2, v = 1.5 + Math.random() * 4;
        particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, age: 0, color: Math.random() < 0.7 ? color : '#fff', kind: 'spark' });
      }
    }
    if (navigator.vibrate) navigator.vibrate(30);
  }

  function launch(tx, ty, letter) {
    rockets.push({ x: tx + (Math.random() - 0.5) * 80, y: H, tx, ty, t: 0, letter });
  }

  function step(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0.016);
    lastT = t;
    ctx.fillStyle = 'rgba(11,7,16,0.28)';
    ctx.fillRect(0, 0, W, H);
    // stars
    for (const s of stars) { s.a += dt * 0.6; ctx.fillStyle = `rgba(255,255,255,${0.3 + 0.3 * Math.sin(s.a * 3)})`; ctx.fillRect(s.x, s.y, 1.2, 1.2); }
    // rockets
    for (const r of rockets) {
      r.t += dt / 0.75;
      const k = 1 - Math.pow(1 - Math.min(1, r.t), 3);
      const px = r.x + (r.tx - r.x) * k, py = r.y + (r.ty - r.y) * k;
      ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(px, py, 2, 0, Math.PI * 2); ctx.fill();
      particles.push({ x: px, y: py, vx: (Math.random() - 0.5) * 0.6, vy: 1 + Math.random(), age: 0.9, color: '#e9c46a', kind: 'spark' });
      if (r.t >= 1) { burst(r.tx, r.ty, r.letter); r.done = true; }
    }
    rockets = rockets.filter((r) => !r.done);
    // particles
    for (const p of particles) {
      p.age += dt;
      if (p.kind === 'letter') {
        const k = 1 - Math.pow(1 - Math.min(1, p.age / 0.5), 3);
        const drop = 25 * Math.max(0, p.age - 0.8) ** 2;
        const px = p.x + p.ox * k, py = p.y + p.oy * k + drop;
        const a = p.age < 1.6 ? 1 : Math.max(0, 1 - (p.age - 1.6) / 0.9);
        ctx.globalAlpha = a * (0.7 + 0.3 * Math.sin(p.age * 20 + p.tw));
        ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(px, py, 2.2, 0, Math.PI * 2); ctx.fill();
        ctx.globalAlpha = 1;
        if (p.age > 2.5) p.dead = true;
      } else {
        p.vy += 2.2 * dt; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy;
        const a = Math.max(0, 1 - p.age / 1.6);
        ctx.globalAlpha = a; ctx.fillStyle = p.color; ctx.fillRect(p.x, p.y, 2, 2); ctx.globalAlpha = 1;
        if (p.age > 1.6) p.dead = true;
      }
    }
    if (particles.length > 4000) particles.splice(0, particles.length - 4000);
    particles = particles.filter((p) => !p.dead);
    // skyline
    ctx.fillStyle = '#07040b';
    for (const b of buildings) ctx.fillRect(b.x, H - b.h, b.w, b.h);
    for (const b of buildings) for (const [wx, wy, f] of b.windows) { ctx.fillStyle = `rgba(255,220,150,${0.35 + 0.4 * Math.abs(Math.sin(t / 900 + f * 10))})`; ctx.fillRect(wx, wy, 3, 4); }
    raf = requestAnimationFrame(step);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = Math.min(e.clientY - r.top, H - 170);
    if (next < letters.length) {
      const i = next++;
      launch(x, Math.max(90, y), letters[i]);
      setTimeout(() => letterEls[i].classList.add('lit'), 750);
      if (next === letters.length) setTimeout(finale, 1800);
    } else {
      launch(x, Math.max(60, y), null);
    }
  });

  function finale() {
    if (finaleDone) return;
    finaleDone = true;
    for (let i = 0; i < 8; i++) setTimeout(() => launch(40 + Math.random() * (W - 80), 60 + Math.random() * (H * 0.4), null), i * 260);
    gsap.to(message, { opacity: 1, y: 0, duration: 1.2, delay: 1.2 });
    gsap.from(message, { y: 12, duration: 1.2, delay: 1.2 });
  }

  new ResizeObserver(() => layout()).observe(wrap);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; if (!W) layout(); lastT = 0; step(performance.now()); }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
  }, { threshold: 0.1 }).observe(section);
}
