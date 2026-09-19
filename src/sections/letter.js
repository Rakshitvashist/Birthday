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
    </div>`;
  host.appendChild(section);

  const paras = [...section.querySelectorAll('.paper p')];
  const sig = section.querySelector('.sig');
  let started = false;

  async function type() {
    if (started) return;
    started = true;
    const cursor = document.createElement('span');
    cursor.className = 'cursor';
    for (let i = 0; i < paras.length; i++) {
      const p = paras[i];
      const text = c.paragraphs[i];
      p.appendChild(cursor);
      for (const ch of text) {
        cursor.insertAdjacentText('beforebegin', ch);
        const pause = /[.,!?]/.test(ch) ? 220 : ch === ' ' ? 30 : 28 + Math.random() * 40;
        await new Promise((r) => setTimeout(r, pause));
      }
      await new Promise((r) => setTimeout(r, 500));
    }
    cursor.remove();
    gsap.to(sig, { opacity: 1, y: 0, duration: 1.2, ease: 'power2.out' });
    gsap.from(sig, { y: 10, duration: 1.2 });
  }

  ScrollTrigger.create({ trigger: section.querySelector('.paper'), start: 'top 70%', once: true, onEnter: type });
}
