import { gsap } from 'gsap';

// Photos of her, with your captions. Big polaroids taped to the page.
export function mountYou(host, content) {
  const c = content.you;
  const section = document.createElement('section');
  section.className = 'section you';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="you-stack">
        ${c.photos.map((p, i) => `
          <figure class="you-card" style="--tilt:${i % 2 ? 2.5 : -2.5}deg">
            <i class="tape"></i>
            <div class="you-frame"><img src="${p.photo}" alt="" loading="lazy" /></div>
            <figcaption>${p.caption}</figcaption>
          </figure>`).join('')}
      </div>
      <p class="you-message">${c.message}</p>
    </div>`;
  host.appendChild(section);

  section.querySelectorAll('.you-card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0, y: 60, rotation: i % 2 ? 10 : -10, scale: 0.92, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: card, start: 'top 85%', once: true },
    });
    gsap.from(card.querySelector('figcaption'), {
      opacity: 0, y: 10, duration: 0.8, delay: 0.5,
      scrollTrigger: { trigger: card, start: 'top 70%', once: true },
    });
  });
  const msg = section.querySelector('.you-message');
  gsap.to(msg, { opacity: 1, y: 0, duration: 1.2, scrollTrigger: { trigger: msg, start: 'top 90%', once: true } });
}
