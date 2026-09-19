import confetti from 'canvas-confetti';

// "Catch our memories": polaroids fall, she taps them. Reaching the target unlocks the rest.
export function mountGame(host, content, onWin) {
  const c = content.game;
  const photos = content.timeline.events.map((e) => e.photo);
  const section = document.createElement('section');
  section.className = 'section game';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">Don't let them fall.</h2>
      <p class="lead reveal">${c.instruction}</p>
      <div class="arena reveal">
        <div class="hud"><span class="score">Caught 0 / ${c.target}</span><span class="missed">Missed 0</span></div>
        <div class="overlay start">
          <h3>Ready?</h3>
          <p>Tap the polaroids before they hit the ground.</p>
          <button class="btn">Start</button>
        </div>
      </div>
    </div>`;
  host.appendChild(section);

  const arena = section.querySelector('.arena');
  const scoreEl = section.querySelector('.score');
  const missedEl = section.querySelector('.missed');
  let items = [], caught = 0, missed = 0, running = false, raf = 0, spawnTimer = 0, lastT = 0, won = false;

  function spawn() {
    const el = document.createElement('div');
    el.className = 'falling';
    el.innerHTML = `<img src="${photos[Math.floor(Math.random() * photos.length)]}" alt="" draggable="false" />`;
    const w = arena.clientWidth;
    const item = {
      el, x: 10 + Math.random() * (w - 90), y: -110,
      vy: 90 + Math.random() * 70 + caught * 8, rot: (Math.random() - 0.5) * 30, vr: (Math.random() - 0.5) * 60, dead: false,
    };
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (item.dead) return;
      item.dead = true;
      el.classList.add('caught');
      caught += 1;
      scoreEl.textContent = `Caught ${caught} / ${c.target}`;
      setTimeout(() => el.remove(), 350);
      if (caught >= c.target) win();
    });
    arena.appendChild(el);
    items.push(item);
  }

  function loop(t) {
    if (!running) return;
    const dt = Math.min(0.05, (t - lastT) / 1000 || 0);
    lastT = t;
    spawnTimer -= dt;
    if (spawnTimer <= 0) { spawn(); spawnTimer = Math.max(0.45, 1.1 - caught * 0.05); }
    const h = arena.clientHeight;
    items.forEach((it) => {
      if (it.dead) return;
      it.y += it.vy * dt;
      it.rot += it.vr * dt;
      it.el.style.transform = `translate(${it.x}px, ${it.y}px) rotate(${it.rot}deg)`;
      if (it.y > h) {
        it.dead = true;
        it.el.remove();
        missed += 1;
        missedEl.textContent = `Missed ${missed}`;
        if (missed >= 5) lose();
      }
    });
    items = items.filter((it) => !it.dead);
    raf = requestAnimationFrame(loop);
  }

  function reset() {
    items.forEach((it) => it.el.remove());
    items = []; caught = 0; missed = 0; spawnTimer = 0; lastT = 0;
    scoreEl.textContent = `Caught 0 / ${c.target}`;
    missedEl.textContent = 'Missed 0';
  }

  function start() {
    section.querySelectorAll('.overlay').forEach((o) => o.remove());
    reset();
    running = true;
    raf = requestAnimationFrame(loop);
  }

  function overlay(title, text, btnText, action) {
    const o = document.createElement('div');
    o.className = 'overlay';
    o.innerHTML = `<h3>${title}</h3><p>${text}</p><button class="btn">${btnText}</button>`;
    o.querySelector('button').addEventListener('click', action);
    arena.appendChild(o);
  }

  function lose() {
    running = false;
    cancelAnimationFrame(raf);
    overlay('So close!', 'Our memories deserve better than the floor. Again?', 'Try again', start);
  }

  function win() {
    running = false;
    cancelAnimationFrame(raf);
    won = true;
    confetti({ particleCount: 140, spread: 90, origin: { y: 0.7 }, colors: ['#ff6b9d', '#e9c46a', '#ffffff'] });
    overlay('You caught them all 💛', 'Of course you did. You always do.', 'Keep going ↓', () => {
      onWin();
      setTimeout(() => document.getElementById('after-game')?.scrollIntoView({ behavior: 'smooth' }), 50);
    });
  }

  section.querySelector('.overlay.start .btn').addEventListener('click', start);
  return { hasWon: () => won };
}
