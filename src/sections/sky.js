import { gsap } from 'gsap';

// A starfield where the bright stars are your dates. Tap them all to draw the heart.
export function mountSky(host, content) {
  const c = content.sky;
  const events = content.timeline.events;
  const section = document.createElement('section');
  section.className = 'section sky';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="sky-canvas-wrap reveal">
        <canvas></canvas>
        <div class="star-tip" hidden><b></b><span></span></div>
      </div>
      <p class="sky-message">${c.message}</p>
    </div>`;
  host.appendChild(section);

  const wrap = section.querySelector('.sky-canvas-wrap');
  const canvas = section.querySelector('canvas');
  const tip = section.querySelector('.star-tip');
  const message = section.querySelector('.sky-message');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, bg = [], stars = [], lit = new Set(), running = false, raf = 0, t0 = performance.now(), completed = false;
  let shooting = null, completedAt = 0;

  function heartPoint(t, cx, cy, s) {
    return {
      x: cx + 16 * Math.pow(Math.sin(t), 3) * s,
      y: cy - (13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t)) * s,
    };
  }

  function layout() {
    W = wrap.clientWidth; H = wrap.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    bg = Array.from({ length: 140 }, () => ({ x: Math.random() * W, y: Math.random() * H, r: Math.random() * 1.3 + 0.3, p: Math.random() * Math.PI * 2, s: 0.5 + Math.random() * 1.5 }));
    const s = Math.min(W / 40, H / 36);
    stars = canvas._stars = events.map((e, i) => {
      const t = Math.PI * 0.15 + (Math.PI * 2 - 0.3) * (i / events.length);
      const p = heartPoint(t, W / 2, H / 2 - s * 1.5, s);
      return { ...p, e, i };
    });
  }

  function draw() {
    if (!running) return;
    const t = (performance.now() - t0) / 1000;
    ctx.clearRect(0, 0, W, H);
    // background stars
    for (const b of bg) {
      const a = 0.35 + 0.45 * Math.sin(t * b.s + b.p);
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2); ctx.fill();
    }
    // shooting star now and then
    if (!shooting && Math.random() < 0.004) shooting = { x: Math.random() * W, y: Math.random() * H * 0.4, vx: 6 + Math.random() * 4, vy: 3, life: 0 };
    if (shooting) {
      shooting.x += shooting.vx; shooting.y += shooting.vy; shooting.life += 1;
      const g = ctx.createLinearGradient(shooting.x, shooting.y, shooting.x - shooting.vx * 8, shooting.y - shooting.vy * 8);
      g.addColorStop(0, 'rgba(255,255,255,0.9)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = g; ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.moveTo(shooting.x, shooting.y); ctx.lineTo(shooting.x - shooting.vx * 8, shooting.y - shooting.vy * 8); ctx.stroke();
      if (shooting.life > 40 || shooting.x > W) shooting = null;
    }
    if (completed) {
      // the full heart, drawn as a smooth glowing curve through every star
      const s = Math.min(W / 40, H / 36);
      const k = Math.min(1, (performance.now() - completedAt) / 1800);
      ctx.strokeStyle = 'rgba(255,107,157,0.95)';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 18; ctx.shadowColor = '#ff6b9d';
      ctx.beginPath();
      const N = 240;
      for (let j = 0; j <= N * k; j++) {
        const p = heartPoint((j / N) * Math.PI * 2, W / 2, H / 2 - s * 1.5, s);
        j === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else {
      // faint threads between consecutive lit stars
      ctx.lineWidth = 1.2;
      for (let i = 0; i < stars.length - 1; i++) {
        const a = stars[i], b = stars[i + 1];
        if (!lit.has(a.i) || !lit.has(b.i)) continue;
        ctx.strokeStyle = 'rgba(255,214,150,0.55)';
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    // memory stars
    for (const s of stars) {
      const on = lit.has(s.i);
      const pulse = 1 + 0.15 * Math.sin(t * 3 + s.i);
      const r = on ? 5 * pulse : 3.2 * pulse;
      ctx.shadowBlur = on ? 22 : 10;
      ctx.shadowColor = on ? '#ffd166' : 'rgba(255,209,102,0.6)';
      ctx.fillStyle = on ? '#fff3c4' : 'rgba(255,209,102,0.85)';
      ctx.beginPath(); ctx.arc(s.x, s.y, r, 0, Math.PI * 2); ctx.fill();
      // four-point sparkle
      ctx.strokeStyle = on ? 'rgba(255,243,196,0.9)' : 'rgba(255,209,102,0.5)';
      ctx.lineWidth = 1;
      const L = on ? 12 : 7;
      ctx.beginPath(); ctx.moveTo(s.x - L, s.y); ctx.lineTo(s.x + L, s.y); ctx.moveTo(s.x, s.y - L); ctx.lineTo(s.x, s.y + L); ctx.stroke();
      ctx.shadowBlur = 0;
      if (on) {
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.font = '12px Caveat, cursive';
        ctx.textAlign = 'center';
        ctx.fillText(s.e.date, s.x, s.y + 22);
      }
    }
    raf = requestAnimationFrame(draw);
  }

  function showTip(s) {
    tip.querySelector('b').textContent = s.e.title;
    tip.querySelector('span').textContent = s.e.date;
    tip.hidden = false;
    tip.style.left = Math.max(70, Math.min(W - 70, s.x)) + 'px';
    tip.style.top = s.y - 16 + 'px';
    gsap.fromTo(tip, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.3 });
    clearTimeout(showTip.t);
    showTip.t = setTimeout(() => gsap.to(tip, { opacity: 0, duration: 0.4, onComplete: () => { tip.hidden = true; } }), 2600);
  }

  canvas.addEventListener('pointerdown', (e) => {
    const r = canvas.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const hit = stars.find((s) => Math.hypot(s.x - x, s.y - y) < 26);
    if (!hit) return;
    lit.add(hit.i);
    showTip(hit);
    if (lit.size === stars.length && !completed) {
      completed = true;
      completedAt = performance.now();
      gsap.to(message, { opacity: 1, y: 0, duration: 1.2, delay: 0.5 });
      gsap.from(message, { y: 12, duration: 1.2, delay: 0.5 });
    }
  });

  new ResizeObserver(() => layout()).observe(wrap);
  new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !running) { running = true; if (!W) layout(); draw(); }
    else if (!e.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
  }, { threshold: 0.1 }).observe(section);
}
