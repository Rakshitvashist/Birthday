import { gsap } from 'gsap';

// One shared full-screen viewer for photos and videos. Swipe or tap the edges to move.
let el = null, items = [], index = 0, onClose = null;

function build() {
  el = document.createElement('div');
  el.className = 'lightbox';
  el.hidden = true;
  el.innerHTML = `
    <button class="lb-close" aria-label="Close">✕</button>
    <div class="lb-stage"></div>
    <div class="lb-caption"></div>
    <div class="lb-count"></div>
    <button class="lb-prev" aria-label="Previous">‹</button>
    <button class="lb-next" aria-label="Next">›</button>`;
  document.body.appendChild(el);
  el.querySelector('.lb-close').addEventListener('click', close);
  el.querySelector('.lb-prev').addEventListener('click', () => go(-1));
  el.querySelector('.lb-next').addEventListener('click', () => go(1));
  const stage = el.querySelector('.lb-stage');
  let sx = 0, sy = 0, dx = 0;
  stage.addEventListener('pointerdown', (e) => { sx = e.clientX; sy = e.clientY; dx = 0; });
  stage.addEventListener('pointerup', (e) => {
    dx = e.clientX - sx;
    const dy = e.clientY - sy;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
    else if (dy > 90 && Math.abs(dx) < 50) close();
  });
  document.addEventListener('keydown', (e) => {
    if (el.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowRight') go(1);
    if (e.key === 'ArrowLeft') go(-1);
  });
}

function render() {
  const item = items[index];
  const stage = el.querySelector('.lb-stage');
  stage.innerHTML = item.type === 'video'
    ? `<video src="${item.src}" controls autoplay playsinline></video>`
    : `<img src="${item.src}" alt="" style="background:${item.color || '#000'}" />`;
  el.querySelector('.lb-caption').textContent = item.caption || '';
  el.querySelector('.lb-count').textContent = `${index + 1} / ${items.length}`;
  gsap.fromTo(stage.firstElementChild, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' });
}

function go(dir) {
  index = (index + dir + items.length) % items.length;
  render();
}

export function openLightbox(list, start = 0, opts = {}) {
  if (!el) build();
  items = list; index = start; onClose = opts.onClose || null;
  el.hidden = false;
  document.body.style.overflow = 'hidden';
  gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.3 });
  render();
}

export function close() {
  if (!el || el.hidden) return;
  const v = el.querySelector('video');
  if (v) v.pause();
  gsap.to(el, { opacity: 0, duration: 0.25, onComplete: () => { el.hidden = true; el.querySelector('.lb-stage').innerHTML = ''; } });
  document.body.style.overflow = '';
  if (onClose) onClose();
}
