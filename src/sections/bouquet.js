import { gsap } from 'gsap';
import confetti from 'canvas-confetti';
import { FLOWER_TYPES, flowerSvg } from './flowers.js';

// She drags (or taps) flowers from a shelf into a paper wrap. Full bouquet = card slides out.
export function mountBouquet(host, content) {
  const c = content.bouquet;
  const section = document.createElement('section');
  section.className = 'section bouquet';
  const slots = [
    { x: -46, y: -8, r: -26 }, { x: -26, y: -22, r: -14 }, { x: -8, y: -30, r: -4 },
    { x: 8, y: -30, r: 4 }, { x: 26, y: -22, r: 14 }, { x: 46, y: -8, r: 26 },
  ];
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="stage reveal">
        <div class="shelf">
          ${FLOWER_TYPES.map((t) => `<div class="shelf-flower" data-type="${t}">${flowerSvg(t, 58, 56)}</div>`).join('')}
          <div class="shelf-board"></div>
        </div>
        <div class="wrap-zone">
          <div class="bouquet-card"><p>${c.cardMessage}</p></div>
          <svg class="wrap-back" viewBox="0 0 200 220"><path d="M30 60 L100 215 L170 60 Q100 90 30 60Z" fill="#f3d9c4" /></svg>
          <div class="bouquet-flowers"></div>
          <svg class="wrap-front" viewBox="0 0 200 220">
            <path d="M22 70 Q100 118 178 70 L100 215Z" fill="#f7e3d1" />
            <path d="M22 70 Q100 118 178 70" stroke="#e6c3a6" stroke-width="2" fill="none" />
            <path d="M40 96 L100 215 L160 96 Q100 132 40 96Z" fill="#ecd0b7" opacity="0.7" />
            <g class="ribbon" opacity="0">
              <path d="M70 150 Q100 135 130 150 Q100 165 70 150Z" fill="#ff6b9d" />
              <circle cx="100" cy="150" r="7" fill="#e6386f" />
              <path d="M96 156 L86 185 M104 156 L114 185" stroke="#ff6b9d" stroke-width="5" stroke-linecap="round" />
            </g>
          </svg>
          <div class="wrap-hint">Drop here</div>
        </div>
      </div>
    </div>`;
  host.appendChild(section);

  const stage = section.querySelector('.stage');
  const zone = section.querySelector('.wrap-zone');
  const flowersHost = section.querySelector('.bouquet-flowers');
  const ribbon = section.querySelector('.ribbon');
  const card = section.querySelector('.bouquet-card');
  const hint = section.querySelector('.wrap-hint');
  let placed = 0, done = false;

  function inZone(x, y) {
    const r = zone.getBoundingClientRect();
    return x > r.left - 20 && x < r.right + 20 && y > r.top - 20 && y < r.bottom + 20;
  }

  function place(type, fromEl) {
    const s = slots[placed];
    placed += 1;
    const f = document.createElement('div');
    f.className = 'bq-flower';
    f.innerHTML = flowerSvg(type, 70, 56);
    flowersHost.appendChild(f);
    const from = fromEl ? fromEl.getBoundingClientRect() : null;
    const to = flowersHost.getBoundingClientRect();
    if (from) gsap.set(f, { x: from.left - to.left - to.width / 2 + from.width / 2, y: from.top - to.top - 40, rotation: 0 });
    gsap.to(f, { x: s.x, y: s.y, rotation: s.r, duration: 0.6, ease: 'back.out(1.4)' });
    if (placed === 1) gsap.to(hint, { opacity: 0, duration: 0.3 });
    if (placed >= slots.length) finish();
  }

  function finish() {
    if (done) return;
    done = true;
    gsap.fromTo(ribbon, { opacity: 0, scale: 0, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(2)', delay: 0.4 });
    gsap.fromTo(card, { y: 40, opacity: 0 }, { y: -230, opacity: 1, duration: 1, ease: 'power3.out', delay: 1 });
    setTimeout(() => confetti({ particleCount: 60, spread: 70, origin: { y: 0.65 }, colors: ['#ff6b9d', '#f3d9c4', '#5ec27f', '#ffffff'] }), 900);
  }

  section.querySelectorAll('.shelf-flower').forEach((el) => {
    let ghost = null, sx = 0, sy = 0, moved = false, active = false;
    el.addEventListener('pointerdown', (e) => {
      if (el.classList.contains('used') || done) return;
      e.preventDefault();
      active = true; moved = false; sx = e.clientX; sy = e.clientY;
      el.setPointerCapture(e.pointerId);
      ghost = el.cloneNode(true);
      ghost.classList.add('ghost');
      stage.appendChild(ghost);
      const r = stage.getBoundingClientRect();
      gsap.set(ghost, { x: e.clientX - r.left - 28, y: e.clientY - r.top - 60, scale: 1.15 });
      el.classList.add('lifting');
    });
    el.addEventListener('pointermove', (e) => {
      if (!active || !ghost) return;
      if (Math.hypot(e.clientX - sx, e.clientY - sy) > 8) moved = true;
      const r = stage.getBoundingClientRect();
      gsap.set(ghost, { x: e.clientX - r.left - 28, y: e.clientY - r.top - 60 });
      zone.classList.toggle('over', inZone(e.clientX, e.clientY));
    });
    const up = (e) => {
      if (!active) return;
      active = false;
      el.classList.remove('lifting');
      zone.classList.remove('over');
      const accept = !moved || inZone(e.clientX, e.clientY);
      if (accept) {
        el.classList.add('used');
        place(el.dataset.type, ghost || el);
        ghost?.remove();
      } else if (ghost) {
        const gr = ghost.getBoundingClientRect(), er = el.getBoundingClientRect();
        gsap.to(ghost, { x: `+=${er.left - gr.left}`, y: `+=${er.top - gr.top}`, scale: 1, duration: 0.35, onComplete: () => ghost?.remove() });
      }
      ghost = null;
    };
    el.addEventListener('pointerup', up);
    el.addEventListener('pointercancel', up);
  });
}
