import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { photos, shuffled } from '../media.js';

// Corkboard of polaroids she can drag around.
export function mountWall(host, content) {
  const c = content.wall;
  const section = document.createElement('section');
  section.className = 'section wall';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="board reveal"></div>
    </div>`;
  host.appendChild(section);

  const board = section.querySelector('.board');
  let z = 10;

  function place() {
    const W = board.clientWidth, H = board.clientHeight;
    const picks = shuffled(photos, 11).slice(0, 8);
    picks.forEach((ph, i) => {
      const p = document.createElement('div');
      p.className = 'polaroid';
      p.innerHTML = `<i class="pin"></i><img src="${ph.thumb}" alt="" draggable="false" /><span>${ph.caption || ['us', 'you', 'that day', 'this one', 'my favourite', 'always', 'again', 'forever'][i]}</span>`;
      const x = 12 + Math.random() * Math.max(10, W - 170);
      const y = 12 + Math.random() * Math.max(10, H - 210);
      const rot = (Math.random() - 0.5) * 22;
      gsap.set(p, { x, y, rotation: rot });
      board.appendChild(p);
      gsap.from(p, { scale: 0, opacity: 0, duration: 0.6, delay: 0.1 * i, ease: 'back.out(1.6)',
        scrollTrigger: { trigger: board, start: 'top 75%', once: true } });

      let sx = 0, sy = 0, ox = 0, oy = 0, dragging = false;
      p.addEventListener('pointerdown', (ev) => {
        dragging = true; sx = ev.clientX; sy = ev.clientY;
        ox = gsap.getProperty(p, 'x'); oy = gsap.getProperty(p, 'y');
        p.style.zIndex = ++z;
        p.setPointerCapture(ev.pointerId);
        gsap.to(p, { scale: 1.06, rotation: rot * 0.4, duration: 0.2 });
      });
      p.addEventListener('pointermove', (ev) => {
        if (!dragging) return;
        gsap.set(p, { x: ox + ev.clientX - sx, y: oy + ev.clientY - sy });
      });
      const up = () => {
        if (!dragging) return;
        dragging = false;
        gsap.to(p, { scale: 1, rotation: rot, duration: 0.3, ease: 'back.out(2)' });
      };
      p.addEventListener('pointerup', up);
      p.addEventListener('pointercancel', up);
    });
  }

  // Board has a size only once it is displayed; wait until it is visible.
  const ro = new ResizeObserver(() => {
    if (board.clientWidth > 0) { ro.disconnect(); place(); }
  });
  ro.observe(board);
}
