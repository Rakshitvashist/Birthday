import { gsap } from 'gsap';
import { interleaved } from '../media.js';

// Instagram-style stories: tap right for next, left for back, hold to pause. Videos play through.
export function mountStories(host, content) {
  const c = content.stories;
  const items = interleaved(c.videoEvery || 3);
  const section = document.createElement('section');
  section.className = 'section stories';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.subtitle}</h2>
      <div class="story reveal">
        <div class="story-bars">${items.map(() => '<i><b></b></i>').join('')}</div>
        <div class="story-head"><span class="story-avatar" style="background-image:url(${items[0].thumb || ''})"></span><span>${c.label}</span><span class="story-count"></span></div>
        <div class="story-stage"></div>
        <button class="story-sound" hidden aria-label="Sound">🔇</button>
        <div class="story-tap left"></div><div class="story-tap right"></div>
        <div class="story-start"><button class="btn">▶ &nbsp;Play</button></div>
        <div class="story-end" hidden><p>${c.endMessage}</p><button class="btn ghost">Watch again</button></div>
      </div>
    </div>`;
  host.appendChild(section);

  const story = section.querySelector('.story');
  const stage = story.querySelector('.story-stage');
  const bars = [...story.querySelectorAll('.story-bars b')];
  const count = story.querySelector('.story-count');
  const soundBtn = story.querySelector('.story-sound');
  const startOverlay = story.querySelector('.story-start');
  const endOverlay = story.querySelector('.story-end');
  const PHOTO_MS = c.secondsPerPhoto ? c.secondsPerPhoto * 1000 : 4500;
  let i = -1, started = false, paused = false, muted = true, tween = null, video = null, visible = true, holdTimer = 0;

  function fillBars() {
    bars.forEach((b, k) => { b.style.width = k < i ? '100%' : '0%'; });
  }

  function show(k) {
    if (tween) tween.kill();
    if (video) { video.pause(); video = null; }
    i = k;
    if (i >= items.length) return finish();
    if (i < 0) i = 0;
    const item = items[i];
    fillBars();
    count.textContent = `${i + 1} / ${items.length}`;
    const old = stage.firstElementChild;
    let el;
    if (item.type === 'video') {
      el = document.createElement('video');
      el.src = item.src; el.playsInline = true; el.muted = muted; el.preload = 'auto'; el.setAttribute('playsinline', '');
      video = el;
      soundBtn.hidden = false;
      el.addEventListener('timeupdate', () => { if (el.duration) bars[i].style.width = (el.currentTime / el.duration) * 100 + '%'; });
      el.addEventListener('ended', () => next());
      el.play().catch(() => {});
    } else {
      el = document.createElement('div');
      el.className = 'story-photo';
      el.style.backgroundColor = item.color || '#000';
      el.innerHTML = `<img src="${item.src}" alt="" draggable="false" />`;
      soundBtn.hidden = true;
      tween = gsap.fromTo(bars[i], { width: '0%' }, { width: '100%', duration: PHOTO_MS / 1000, ease: 'none', onComplete: next });
      // slow Ken Burns drift
      gsap.fromTo(el.firstElementChild, { scale: 1.06, xPercent: i % 2 ? 1.5 : -1.5 }, { scale: 1, xPercent: 0, duration: PHOTO_MS / 1000 + 0.5, ease: 'none' });
    }
    if (item.caption) {
      const cap = document.createElement('div');
      cap.className = 'story-caption';
      cap.textContent = item.caption;
      el.appendChild(cap);
    }
    stage.appendChild(el);
    gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.35 });
    if (old) gsap.to(old, { opacity: 0, duration: 0.35, onComplete: () => old.remove() });
    // preload the next photo
    const nx = items[i + 1];
    if (nx && nx.type === 'photo') { const im = new Image(); im.src = nx.src; }
  }

  const next = () => show(i + 1);
  const prev = () => show(Math.max(0, i - 1));

  function pause() {
    if (paused) return;
    paused = true;
    if (tween) tween.pause();
    if (video) video.pause();
  }
  function resume() {
    if (!paused) return;
    paused = false;
    if (tween) tween.resume();
    if (video) video.play().catch(() => {});
  }

  function finish() {
    bars.forEach((b) => { b.style.width = '100%'; });
    endOverlay.hidden = false;
    gsap.fromTo(endOverlay, { opacity: 0 }, { opacity: 1, duration: 0.5 });
  }

  function start() {
    started = true;
    startOverlay.hidden = true;
    endOverlay.hidden = true;
    show(0);
  }

  startOverlay.querySelector('button').addEventListener('click', start);
  endOverlay.querySelector('button').addEventListener('click', start);
  soundBtn.addEventListener('click', () => {
    muted = !muted;
    soundBtn.textContent = muted ? '🔇' : '🔊';
    if (video) video.muted = muted;
  });

  // tap zones: quick tap = navigate, press and hold = pause
  story.querySelectorAll('.story-tap').forEach((zone) => {
    let downAt = 0;
    zone.addEventListener('pointerdown', (e) => {
      if (!started) return;
      e.preventDefault();
      downAt = Date.now();
      holdTimer = setTimeout(pause, 220);
    });
    const up = () => {
      if (!started) return;
      clearTimeout(holdTimer);
      const held = Date.now() - downAt > 220;
      if (held) resume();
      else zone.classList.contains('left') ? prev() : next();
    };
    zone.addEventListener('pointerup', up);
    zone.addEventListener('pointercancel', () => { clearTimeout(holdTimer); resume(); });
  });

  // pause when scrolled away
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (!started) return;
    visible ? resume() : pause();
  }, { threshold: 0.3 }).observe(story);
}
