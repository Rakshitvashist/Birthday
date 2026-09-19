import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Scroll-driven timeline. Each memory slides in and its photo drifts (parallax).
export function mountTimeline(host, content) {
  const c = content.timeline;
  const section = document.createElement('section');
  section.className = 'section timeline';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">Every chapter, with you.</h2>
      <div class="track">
        ${c.events.map((e) => `
          <article class="tl-item">
            <div class="date">${e.date}</div>
            <h3>${e.title}</h3>
            <div class="frame"><img src="${e.photo}" alt="${e.title}" loading="lazy" /></div>
            <p class="cap">${e.caption}</p>
          </article>`).join('')}
      </div>
    </div>`;
  host.appendChild(section);

  section.querySelectorAll('.tl-item').forEach((item, i) => {
    gsap.from(item, {
      opacity: 0, x: i % 2 ? 40 : -40, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: item, start: 'top 85%', once: true },
    });
    gsap.fromTo(item.querySelector('img'), { yPercent: -6 }, {
      yPercent: 6, ease: 'none',
      scrollTrigger: { trigger: item, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });
}
