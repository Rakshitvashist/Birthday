import { gsap } from 'gsap';
import { photos, videos } from '../media.js';
import { openLightbox } from '../lightbox.js';

// Every photo and video, in a masonry wall. Tap anything to open it full screen.
export function mountGallery(host, content) {
  const c = content.gallery;
  const items = [...photos, ...videos];
  const section = document.createElement('section');
  section.className = 'section gallery';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle.replace('{p}', photos.length).replace('{v}', videos.length)}</h2>
      <div class="masonry">
        ${items.map((it, i) => it.type === 'video'
          ? `<button class="m-item m-video" data-i="${i}" style="aspect-ratio:${it.w && it.h ? `${it.w}/${it.h}` : '9/16'}">${it.poster ? `<img src="${it.poster}" alt="" loading="lazy" />` : ''}<span>▶${it.duration ? `<small>${Math.round(it.duration)}s</small>` : ''}</span></button>`
          : `<button class="m-item" data-i="${i}" style="aspect-ratio:${it.w}/${it.h};background:${it.color}"><img src="${it.thumb}" alt="" loading="lazy" /></button>`
        ).join('')}
      </div>
    </div>`;
  host.appendChild(section);

  const tiles = [...section.querySelectorAll('.m-item')];
  tiles.forEach((t) => t.addEventListener('click', () => openLightbox(items, Number(t.dataset.i))));

  // reveal in small batches as they scroll in
  tiles.forEach((t, i) => {
    gsap.from(t, { opacity: 0, y: 24, duration: 0.6, delay: (i % 4) * 0.08, ease: 'power2.out',
      scrollTrigger: { trigger: t, start: 'top 95%', once: true } });
  });
}
