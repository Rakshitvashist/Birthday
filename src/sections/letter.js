import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Typewriter letter. Starts typing when the paper scrolls into view.
export function mountLetter(host, content) {
  const c = content.letter;
  const section = document.createElement('section');
  section.className = 'section letter';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <div class="paper reveal">
        ${c.paragraphs.map(() => '<p></p>').join('')}
        <div class="sig">${c.signature}</div>
      </div>
      <p class="lead reveal" style="font-size:0.8rem;margin-top:14px">Tap the letter to read faster</p>
    </div>`;
  host.appendChild(section);

  const paras = [...section.querySelectorAll('.paper p')];
  const sig = section.querySelector('.sig');
  const paper = section.querySelector('.paper');
  let started = false, fast = false;

  // Tapping the paper speeds the typing up so she never has to wait.
  paper.addEventListener('pointerdown', () => { fast = true; });

  async function type() {
    if (started) return;
    started = true;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    for (let i = 0; i < paras.length; i++) {
      const p = paras[i];
      p.appendChild(cursor);
      // **bold** parts are typed inside <b>
      const segments = c.paragraphs[i].split(/(\*\*[^*]+\*\*)/).filter(Boolean).map((s) =>
        s.startsWith('**') ? { text: s.slice(2, -2), bold: true } : { text: s, bold: false });
      for (const seg of segments) {
        const node = seg.bold ? document.createElement('b') : document.createTextNode('');
        cursor.before(node);
        for (const ch of seg.text) {
          node.textContent += ch;
          const pause = fast ? 3 : /[.!?]/.test(ch) ? 170 : ch === ',' ? 90 : ch === ' ' ? 16 : 14 + Math.random() * 20;
          await new Promise((r) => setTimeout(r, pause));
        }
      }
      await new Promise((r) => setTimeout(r, fast ? 60 : 380));
    }
    cursor.remove();
    gsap.to(sig, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });
    gsap.from(sig, { y: 10, duration: 1.2 });
  }

  ScrollTrigger.create({ trigger: section.querySelector('.paper'), start: 'top 70%', once: true, onEnter: type });
}
