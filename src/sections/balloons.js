import { gsap } from 'gsap';

// Balloons drift up carrying notes. Tap one to pop it and read the note.
export function mountBalloons(host, content) {
  const c = content.balloons;
  const colors = ['#ff6b9d', '#e9c46a', '#9b6bff', '#5ec27f', '#ff8c5a', '#4fc3f7'];
  const section = document.createElement('section');
  section.className = 'section balloons';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="sky-box reveal">
        <div class="read-count">0 / ${c.notes.length} notes</div>
        <div class="note-card" hidden>
          <div class="note-paper"><p></p><button class="btn">Keep it ❤️</button></div>
        </div>
      </div>
      <p class="balloons-done">${c.doneMessage}</p>
    </div>`;
  host.appendChild(section);

  const box = section.querySelector('.sky-box');
  const readCount = section.querySelector('.read-count');
  const noteCard = section.querySelector('.note-card');
  const noteText = noteCard.querySelector('p');
  const doneMsg = section.querySelector('.balloons-done');
  const unread = c.notes.map((_, i) => i);
  const read = new Set();
  const floating = new Map(); // noteIndex -> element
  let visible = false, timer = 0;

  function balloonMarkup(color) {
    return `
      <svg viewBox="0 0 60 120" width="60" height="120" xmlns="http://www.w3.org/2000/svg">
        <path d="M30 4 C48 4 56 22 56 38 C56 58 42 74 30 84 C18 74 4 58 4 38 C4 22 12 4 30 4Z" fill="${color}" />
        <ellipse cx="20" cy="26" rx="6" ry="12" fill="rgba(255,255,255,0.35)" transform="rotate(-20 20 26)" />
        <path d="M26 84 L34 84 L30 90Z" fill="${color}" />
        <path d="M30 90 C 22 100, 38 108, 30 120" stroke="rgba(255,255,255,0.6)" stroke-width="1.5" fill="none" />
        <rect x="22" y="100" width="16" height="11" rx="2" fill="#fff8e7" transform="rotate(-8 30 105)" />
      </svg>`;
  }

  function spawn() {
    if (!visible || noteCard.hidden === false) return;
    const free = unread.filter((i) => !floating.has(i));
    if (!free.length || floating.size >= 4) return;
    const idx = free[Math.floor(Math.random() * free.length)];
    const el = document.createElement('div');
    el.className = 'balloon';
    el.innerHTML = balloonMarkup(colors[idx % colors.length]);
    el.style.left = 8 + Math.random() * (box.clientWidth - 76) + 'px';
    box.appendChild(el);
    floating.set(idx, el);
    // Rise and sway are driven by GSAP (not CSS) so they survive "reduce motion" settings.
    gsap.fromTo(el, { y: 0 }, { y: -(box.clientHeight + 160), duration: 9 + Math.random() * 5, ease: 'none',
      onComplete: () => { if (floating.get(idx) === el) { floating.delete(idx); el.remove(); } } });
    gsap.fromTo(el.querySelector('svg'), { rotation: -6 }, { rotation: 6, duration: 1.5 + Math.random(), yoyo: true, repeat: -1, ease: 'sine.inOut', transformOrigin: '50% 0%' });
    el.addEventListener('pointerdown', (e) => { e.preventDefault(); gsap.killTweensOf(el); pop(idx, el, e); });
  }

  function pop(idx, el, e) {
    floating.delete(idx);
    const r = box.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    el.remove();
    for (let i = 0; i < 10; i++) {
      const bit = document.createElement('i');
      bit.className = 'bit';
      bit.style.background = colors[idx % colors.length];
      bit.style.left = x + 'px'; bit.style.top = y + 'px';
      box.appendChild(bit);
      const a = (Math.PI * 2 * i) / 10;
      gsap.to(bit, { x: Math.cos(a) * (40 + Math.random() * 40), y: Math.sin(a) * (40 + Math.random() * 40) + 30, opacity: 0, rotation: 180, duration: 0.7, ease: 'power2.out', onComplete: () => bit.remove() });
    }
    noteText.textContent = c.notes[idx];
    noteCard.hidden = false;
    gsap.fromTo(noteCard.firstElementChild, { scale: 0.6, opacity: 0, rotation: -6 }, { scale: 1, opacity: 1, rotation: 0, duration: 0.5, ease: 'back.out(1.6)' });
    read.add(idx);
    const k = unread.indexOf(idx);
    if (k > -1) unread.splice(k, 1);
    readCount.textContent = `${read.size} / ${c.notes.length} notes`;
  }

  noteCard.querySelector('button').addEventListener('click', () => {
    gsap.to(noteCard.firstElementChild, { scale: 0.8, opacity: 0, duration: 0.25, onComplete: () => {
      noteCard.hidden = true;
      if (!unread.length) {
        gsap.to(doneMsg, { opacity: 1, y: 0, duration: 1 });
        gsap.from(doneMsg, { y: 12, duration: 1 });
      }
    } });
  });

  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    clearInterval(timer);
    if (visible) { spawn(); timer = setInterval(spawn, 1600); }
  }, { threshold: 0.2 }).observe(section);
}
