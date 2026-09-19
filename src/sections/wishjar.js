import { gsap } from 'gsap';

// A glass jar. She types a wish, it folds and drops in, and it is saved on her phone for next year.
const KEY = 'wishjar.v1';

function load() { try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; } }
function save(list) { try { localStorage.setItem(KEY, JSON.stringify(list)); } catch { /* private mode */ } }

export function mountWishJar(host, content) {
  const c = content.wishjar;
  const section = document.createElement('section');
  section.className = 'section wishjar';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="jar-stage reveal">
        <div class="jar-bubble" hidden><span></span><small></small></div>
        <svg class="jar" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="glass" x1="0" x2="1"><stop offset="0" stop-color="rgba(255,255,255,0.22)" /><stop offset="0.5" stop-color="rgba(255,255,255,0.06)" /><stop offset="1" stop-color="rgba(255,255,255,0.18)" /></linearGradient>
            <clipPath id="jarclip"><path d="M40 70 Q40 58 52 58 H148 Q160 58 160 70 V210 Q160 228 142 228 H58 Q40 228 40 210Z" /></clipPath>
          </defs>
          <rect x="58" y="22" width="84" height="26" rx="6" fill="#c98b5a" />
          <rect x="52" y="44" width="96" height="14" rx="4" fill="#a9703f" />
          <g class="jar-notes" clip-path="url(#jarclip)"></g>
          <path d="M40 70 Q40 58 52 58 H148 Q160 58 160 70 V210 Q160 228 142 228 H58 Q40 228 40 210Z" fill="url(#glass)" stroke="rgba(255,255,255,0.45)" stroke-width="2" />
          <path d="M52 80 V200" stroke="rgba(255,255,255,0.35)" stroke-width="5" stroke-linecap="round" />
          <text class="jar-count" x="100" y="150" text-anchor="middle" font-family="Caveat, cursive" font-size="22" fill="rgba(255,255,255,0.7)"></text>
        </svg>
        <div class="paper-drop" hidden></div>
      </div>
      <form class="wish-form reveal" autocomplete="off">
        <input type="text" maxlength="140" placeholder="${c.placeholder}" aria-label="Your wish" />
        <button class="btn" type="submit">${c.button}</button>
      </form>
      <p class="wish-status"></p>
      <p class="lead reveal" style="font-size:0.85rem;margin-top:10px">${c.shake}</p>
    </div>`;
  host.appendChild(section);

  const jar = section.querySelector('.jar');
  const notesG = section.querySelector('.jar-notes');
  const countEl = section.querySelector('.jar-count');
  const form = section.querySelector('form');
  const input = form.querySelector('input');
  const status = section.querySelector('.wish-status');
  const bubble = section.querySelector('.jar-bubble');
  const paper = section.querySelector('.paper-drop');
  let wishes = load();

  const tints = ['#fff8e7', '#ffe3ec', '#e9f7ff', '#f1ffe9'];
  function addNoteShape(i, animate) {
    const n = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    const x = 55 + Math.random() * 78, y = 205 - Math.min(i, 14) * 9 - Math.random() * 6;
    n.setAttribute('width', 26); n.setAttribute('height', 12); n.setAttribute('rx', 2);
    n.setAttribute('fill', tints[i % tints.length]);
    n.setAttribute('transform', `translate(${x} ${y}) rotate(${(Math.random() - 0.5) * 50})`);
    notesG.appendChild(n);
    if (animate) gsap.from(n, { opacity: 0, duration: 0.4 });
  }
  function renderCount() {
    countEl.textContent = wishes.length ? `${wishes.length} wish${wishes.length > 1 ? 'es' : ''}` : 'empty, for now';
  }
  wishes.forEach((_, i) => addNoteShape(i, false));
  renderCount();

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    input.blur();
    const wish = { text, date: new Date().toISOString() };
    // animate a folded note dropping into the jar
    paper.hidden = false;
    paper.textContent = text.length > 22 ? text.slice(0, 22) + '…' : text;
    gsap.fromTo(paper, { y: 0, x: 0, rotation: 0, scale: 1, opacity: 1 }, {
      y: 150, rotation: 25, scale: 0.35, duration: 0.9, ease: 'power2.in',
      onComplete: () => {
        paper.hidden = true;
        wishes.push(wish); save(wishes);
        addNoteShape(wishes.length - 1, true);
        renderCount();
        gsap.fromTo(jar, { rotation: -2 }, { rotation: 2, duration: 0.08, yoyo: true, repeat: 5, transformOrigin: '50% 100%', onComplete: () => gsap.set(jar, { rotation: 0 }) });
        status.textContent = c.saved;
        gsap.fromTo(status, { opacity: 0 }, { opacity: 1, duration: 0.6 });
      },
    });
  });

  jar.addEventListener('pointerdown', () => {
    if (!wishes.length) return;
    const w = wishes[Math.floor(Math.random() * wishes.length)];
    bubble.querySelector('span').textContent = w.text;
    bubble.querySelector('small').textContent = new Date(w.date).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    bubble.hidden = false;
    gsap.fromTo(jar, { rotation: -3 }, { rotation: 3, duration: 0.07, yoyo: true, repeat: 5, transformOrigin: '50% 100%', onComplete: () => gsap.set(jar, { rotation: 0 }) });
    gsap.fromTo(bubble, { opacity: 0, y: 8, scale: 0.9 }, { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'back.out(1.6)' });
    clearTimeout(jar.t);
    jar.t = setTimeout(() => gsap.to(bubble, { opacity: 0, duration: 0.4, onComplete: () => { bubble.hidden = true; } }), 4000);
  });
}
