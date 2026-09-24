import { gsap } from 'gsap';
import { childhood, byId } from '../media.js';
import { openLightbox } from '../lightbox.js';

// Her childhood photos as an old film strip, then a "then and now" slider.
export function mountChildhood(host, content) {
  const c = content.childhood;
  if (!childhood.length) return;
  const thenPhoto = byId(c.then) || childhood[0];
  const nowPhoto = byId(c.now);
  // captions from content.js unless the photo has its own in media.json
  const items = childhood.map((p, i) => ({ ...p, caption: p.caption || (c.captions && c.captions[i]) || '' }));
  const section = document.createElement('section');
  section.className = 'section childhood';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="film reveal">
        <div class="film-holes"></div>
        <div class="film-track">
          ${items.map((p, i) => `
            <figure class="film-frame" data-i="${i}">
              <div class="print" style="background:${p.color}"><img src="${p.thumb}" alt="" loading="lazy" /></div>
              <figcaption>${p.caption}</figcaption>
            </figure>`).join('')}
        </div>
        <div class="film-holes"></div>
      </div>
      <p class="lead reveal" style="font-size:0.85rem;margin-top:12px">Swipe the strip. Tap a photo.</p>
      ${nowPhoto ? `
        <div class="then-now reveal">
          <div class="tn-label left">Then</div>
          <div class="tn-label right">Now</div>
          <div class="tn-now"><img src="${nowPhoto.src}" alt="" style="object-position:${c.nowFocus || '50% 50%'}" /></div>
          <div class="tn-then"><img src="${thenPhoto.src}" alt="" style="object-position:${c.thenFocus || '50% 50%'}" /></div>
          <div class="tn-handle"><i></i></div>
        </div>
        <p class="lead reveal" style="font-size:0.85rem;margin-top:12px">Drag the line.</p>` : ''}
      <p class="child-message">${c.message}</p>
    </div>`;
  host.appendChild(section);

  section.querySelectorAll('.film-frame').forEach((f) => {
    f.addEventListener('click', () => openLightbox(items, Number(f.dataset.i)));
  });

  // film frames slide in
  gsap.from(section.querySelectorAll('.film-frame'), {
    opacity: 0, x: 40, duration: 0.7, stagger: 0.1, ease: 'power2.out',
    scrollTrigger: { trigger: section.querySelector('.film'), start: 'top 85%', once: true },
  });

  // then / now slider
  const tn = section.querySelector('.then-now');
  if (tn) {
    const then = tn.querySelector('.tn-then');
    const handle = tn.querySelector('.tn-handle');
    let dragging = false;
    const setPos = (clientX) => {
      const r = tn.getBoundingClientRect();
      const k = Math.max(0.03, Math.min(0.97, (clientX - r.left) / r.width));
      then.style.clipPath = `inset(0 ${(1 - k) * 100}% 0 0)`;
      handle.style.left = k * 100 + '%';
    };
    tn.addEventListener('pointerdown', (e) => { dragging = true; tn.setPointerCapture(e.pointerId); setPos(e.clientX); });
    tn.addEventListener('pointermove', (e) => { if (dragging) setPos(e.clientX); });
    const stop = () => { dragging = false; };
    tn.addEventListener('pointerup', stop);
    tn.addEventListener('pointercancel', stop);
    // start half way, with a little nudge so she notices it moves
    gsap.fromTo({ k: 0.5 }, { k: 0.5 }, { k: 0.62, duration: 1.2, yoyo: true, repeat: 1, ease: 'sine.inOut', delay: 0.6,
      onUpdate() { const r = tn.getBoundingClientRect(); setPos(r.left + r.width * this.targets()[0].k); },
      scrollTrigger: { trigger: tn, start: 'top 75%', once: true } });
    setPos(tn.getBoundingClientRect().left + tn.getBoundingClientRect().width * 0.5);
    new ResizeObserver(() => { const r = tn.getBoundingClientRect(); if (r.width && !dragging) setPos(r.left + r.width * (parseFloat(handle.style.left) || 50) / 100); }).observe(tn);
  }

  gsap.to(section.querySelector('.child-message'), { opacity: 1, y: 0, duration: 1.2,
    scrollTrigger: { trigger: section.querySelector('.child-message'), start: 'top 90%', once: true } });
}
