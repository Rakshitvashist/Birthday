import { gsap } from 'gsap';

// Swipeable card deck. Drag a card left or right (or tap it) to reveal the next.
export function mountReasons(host, content) {
  const c = content.reasons;
  const section = document.createElement('section');
  section.className = 'section reasons';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.list.length} of a million.</h2>
      <div class="deck reveal"></div>
      <div class="swipe-hint reveal">Swipe to see the next one</div>
    </div>`;
  host.appendChild(section);

  const deck = section.querySelector('.deck');
  const hint = section.querySelector('.swipe-hint');
  const cards = c.list.map((text, i) => {
    const el = document.createElement('div');
    el.className = 'reason-card';
    el.innerHTML = `<div class="num">${i + 1} / ${c.list.length}</div><p>${text}</p>`;
    deck.appendChild(el);
    return el;
  });

  function layout() {
    const remaining = cards.filter((el) => !el.dataset.gone);
    remaining.forEach((el, i) => {
      gsap.to(el, {
        y: i * 10, scale: 1 - i * 0.05, opacity: i < 3 ? 1 - i * 0.2 : 0,
        rotation: 0, x: 0, duration: 0.4, ease: 'power2.out',
      });
      el.style.zIndex = 100 - i;
      el.style.pointerEvents = i === 0 ? 'auto' : 'none';
    });
    if (!remaining.length) {
      hint.className = 'done';
      hint.textContent = 'And I could keep going forever. ❤️';
    }
  }

  cards.forEach((el) => {
    let startX = 0, startY = 0, dx = 0, dragging = false;
    el.addEventListener('pointerdown', (e) => {
      dragging = true; startX = e.clientX; startY = e.clientY; dx = 0;
      el.setPointerCapture(e.pointerId);
      gsap.killTweensOf(el);
    });
    el.addEventListener('pointermove', (e) => {
      if (!dragging) return;
      dx = e.clientX - startX;
      const dy = e.clientY - startY;
      gsap.set(el, { x: dx, y: dy * 0.3, rotation: dx / 14 });
    });
    const release = () => {
      if (!dragging) return;
      dragging = false;
      const fling = Math.abs(dx) > 70;
      const dir = dx === 0 ? 1 : Math.sign(dx);
      if (fling || Math.abs(dx) < 6) {
        // swiped, or a plain tap: fly it away
        el.dataset.gone = '1';
        gsap.to(el, { x: dir * 600, rotation: dir * 30, opacity: 0, duration: 0.5, ease: 'power2.in' });
        layout();
      } else {
        layout();
      }
    };
    el.addEventListener('pointerup', release);
    el.addEventListener('pointercancel', release);
  });

  layout();
}
