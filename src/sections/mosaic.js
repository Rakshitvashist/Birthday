import { gsap } from 'gsap';
import { photos, shuffled } from '../media.js';
import { openLightbox } from '../lightbox.js';

// A heart made of photo tiles. Tiles keep swapping; tap one to open it.
export function mountMosaic(host, content) {
  const c = content.mosaic;
  const section = document.createElement('section');
  section.className = 'section mosaic';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="mosaic-grid reveal"></div>
      <p class="mosaic-message">${c.message.replace('{n}', photos.length)}</p>
    </div>`;
  host.appendChild(section);

  const grid = section.querySelector('.mosaic-grid');
  const COLS = 13, ROWS = 12;
  grid.style.setProperty('--cols', COLS);
  grid.style.setProperty('--rows', ROWS);

  // implicit heart: (x^2 + y^2 - 1)^3 - x^2 y^3 <= 0
  const inHeart = (col, row) => {
    const x = ((col + 0.5) / COLS - 0.5) * 2.6;
    const y = (0.5 - (row + 0.5) / ROWS) * 2.6 + 0.15;
    return Math.pow(x * x + y * y - 1, 3) - x * x * y * y * y <= 0;
  };

  const tiles = [];
  let k = 0;
  const order = shuffled(photos, 7);
  for (let r = 0; r < ROWS; r++) {
    for (let col = 0; col < COLS; col++) {
      if (!inHeart(col, r)) continue;
      const p = order[k++ % order.length];
      const t = document.createElement('button');
      t.className = 'tile';
      t.style.gridColumn = col + 1;
      t.style.gridRow = r + 1;
      t.style.backgroundImage = `url(${p.thumb})`;
      t.style.backgroundColor = p.color;
      t.dataset.id = p.id;
      t.style.setProperty('--d', `${Math.hypot(col - COLS / 2, r - ROWS / 2) * 0.06}s`);
      t.addEventListener('click', () => {
        const idx = photos.findIndex((x) => x.id === t.dataset.id);
        openLightbox(photos, Math.max(0, idx));
      });
      grid.appendChild(t);
      tiles.push(t);
    }
  }

  // tiles bloom in from the centre when scrolled into view
  gsap.set(tiles, { scale: 0, opacity: 0 });
  new IntersectionObserver(([e], obs) => {
    if (!e.isIntersecting) return;
    obs.disconnect();
    tiles.forEach((t) => gsap.to(t, { scale: 1, opacity: 1, duration: 0.5, delay: parseFloat(t.style.getPropertyValue('--d')), ease: 'back.out(1.7)' }));
    gsap.to(section.querySelector('.mosaic-message'), { opacity: 1, y: 0, duration: 1, delay: 1.2 });
    // then keep the heart alive by swapping random tiles
    setInterval(() => {
      if (document.hidden) return;
      const t = tiles[Math.floor(Math.random() * tiles.length)];
      const p = photos[Math.floor(Math.random() * photos.length)];
      gsap.to(t, { rotationY: 90, duration: 0.25, ease: 'power1.in', onComplete: () => {
        t.style.backgroundImage = `url(${p.thumb})`;
        t.style.backgroundColor = p.color;
        t.dataset.id = p.id;
        gsap.fromTo(t, { rotationY: -90 }, { rotationY: 0, duration: 0.25, ease: 'power1.out' });
      } });
    }, 900);
  }, { threshold: 0.3 }).observe(grid);
}
