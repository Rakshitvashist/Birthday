import { gsap } from 'gsap';
import { FLOWER_TYPES, flowerHead, stemMarkup } from './flowers.js';

// A dark field. Tap anywhere and a flower grows from that spot: stem, leaves, then petals.
export function mountGarden(host, content) {
  const c = content.garden;
  const section = document.createElement('section');
  section.className = 'section garden';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="field reveal">
        <svg class="field-svg" xmlns="http://www.w3.org/2000/svg"></svg>
        <div class="fireflies">${Array.from({ length: 14 }, () => '<i></i>').join('')}</div>
        <div class="field-hint">Tap anywhere</div>
        <div class="field-count">0 / ${c.target}</div>
      </div>
      <p class="grow-message">${c.message}</p>
    </div>`;
  host.appendChild(section);

  const field = section.querySelector('.field');
  const svg = section.querySelector('.field-svg');
  const hint = section.querySelector('.field-hint');
  const count = section.querySelector('.field-count');
  const message = section.querySelector('.grow-message');
  let taps = 0;

  // fireflies drift randomly
  section.querySelectorAll('.fireflies i').forEach((f) => {
    f.style.left = Math.random() * 100 + '%';
    f.style.top = 20 + Math.random() * 70 + '%';
    f.style.animationDuration = 4 + Math.random() * 6 + 's';
    f.style.animationDelay = -Math.random() * 6 + 's';
  });

  function resize() {
    svg.setAttribute('viewBox', `0 0 ${field.clientWidth} ${field.clientHeight}`);
  }
  new ResizeObserver(resize).observe(field);

  function grow(x, y) {
    const type = FLOWER_TYPES[taps % FLOWER_TYPES.length];
    const h = 70 + Math.random() * 70;
    const yy = Math.max(y, h + 30);
    const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    g.setAttribute('class', 'gflower');
    g.innerHTML = `${stemMarkup(h, Math.random() > 0.5 ? 1 : -1)}<g transform="translate(0,${-h})"><g class="head">${flowerHead(type)}</g></g>`;
    svg.appendChild(g);
    gsap.set(g, { x, y: yy });

    const stem = g.querySelector('.stem');
    const len = stem.getTotalLength();
    stem.style.strokeDasharray = len;
    stem.style.strokeDashoffset = len;
    const leaves = g.querySelectorAll('.leaf');
    const head = g.querySelector('.head');
    const petals = head.querySelectorAll('.petal');

    gsap.timeline()
      .to(stem, { strokeDashoffset: 0, duration: 0.9, ease: 'power2.out' }, 0)
      .fromTo(leaves, { scale: 0, transformOrigin: '0% 100%' }, { scale: 1, duration: 0.5, stagger: 0.1, ease: 'back.out(2)' }, 0.35)
      .fromTo(head, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.55)' }, 0.75)
      .fromTo(petals, { scale: 0.2, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.5, stagger: 0.03, ease: 'back.out(1.8)' }, 0.85)
      .to(g, { rotation: (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2), transformOrigin: '50% 100%', duration: 1.6 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut' }, 1.2);

    // tiny sparkle at the tap
    const spark = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    spark.setAttribute('r', '4'); spark.setAttribute('fill', '#ffe9a8'); spark.setAttribute('cx', x); spark.setAttribute('cy', yy);
    svg.appendChild(spark);
    gsap.to(spark, { attr: { r: 26 }, opacity: 0, duration: 0.6, onComplete: () => spark.remove() });
  }

  field.addEventListener('pointerdown', (e) => {
    const r = field.getBoundingClientRect();
    grow(e.clientX - r.left, e.clientY - r.top);
    taps += 1;
    count.textContent = `${Math.min(taps, c.target)} / ${c.target}`;
    if (taps === 1) gsap.to(hint, { opacity: 0, duration: 0.4 });
    if (taps === c.target) {
      gsap.to(message, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });
      gsap.from(message, { y: 14, duration: 1.2 });
      gsap.to(count, { opacity: 0, duration: 0.5 });
    }
  });
}
