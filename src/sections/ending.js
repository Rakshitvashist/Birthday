import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

// Final message, countdown to the next time you meet, the question with a runaway "No",
// and a video message that plays after she says yes.
export function mountEnding(host, content) {
  const c = content.ending;
  const section = document.createElement('section');
  section.className = 'section ending';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${content.name}, listen.</h2>
      <p class="lead reveal">${c.message}</p>
      ${c.nextMeet ? `
        <div class="reveal">
          <div class="eyebrow" style="font-size:1.2rem">${c.nextMeetLabel}</div>
          <div class="countdown">
            <div><b data-u="d">0</b><small>days</small></div>
            <div><b data-u="h">0</b><small>hrs</small></div>
            <div><b data-u="m">0</b><small>min</small></div>
            <div><b data-u="s">0</b><small>sec</small></div>
          </div>
        </div>` : ''}
      <div class="question reveal">${c.question}</div>
      <div class="answers reveal">
        <button class="btn yes">${c.yes} ❤️</button>
        <button class="btn ghost no">${c.no}</button>
      </div>
      <div class="after-yes">${c.afterYes}</div>
      <div class="video-wrap" hidden>
        <p class="eyebrow">${c.videoCaption}</p>
        <div class="video-frame"></div>
      </div>
      <p class="footer">Made with too much love, and a little bit of code.</p>
    </div>`;
  host.appendChild(section);

  // Countdown
  if (c.nextMeet) {
    const target = new Date(c.nextMeet).getTime();
    const units = Object.fromEntries([...section.querySelectorAll('[data-u]')].map((el) => [el.dataset.u, el]));
    const tick = () => {
      let diff = Math.max(0, target - Date.now()) / 1000;
      const d = Math.floor(diff / 86400); diff -= d * 86400;
      const h = Math.floor(diff / 3600); diff -= h * 3600;
      const m = Math.floor(diff / 60);
      const s = Math.floor(diff - m * 60);
      units.d.textContent = d; units.h.textContent = h; units.m.textContent = m; units.s.textContent = s;
    };
    tick();
    setInterval(tick, 1000);
  }

  // Runaway "No" button
  const no = section.querySelector('.no');
  const yes = section.querySelector('.yes');
  const after = section.querySelector('.after-yes');
  const videoWrap = section.querySelector('.video-wrap');
  const videoFrame = section.querySelector('.video-frame');
  let dodges = 0;
  const dodge = () => {
    dodges += 1;
    const range = Math.min(140, 60 + dodges * 15);
    gsap.to(no, { x: (Math.random() - 0.5) * range * 2, y: (Math.random() - 0.5) * range, duration: 0.25, ease: 'back.out(2)' });
    const taunts = ['Nope', 'Try again', 'Not this one', 'Too slow', 'Really?', 'Hmm', 'Just say yes'];
    no.textContent = taunts[Math.min(dodges - 1, taunts.length - 1)];
    if (dodges > 3) gsap.to(yes, { scale: 1 + dodges * 0.06, duration: 0.3 });
  };
  no.addEventListener('pointerenter', dodge);
  no.addEventListener('pointerdown', (e) => { e.preventDefault(); dodge(); });
  no.addEventListener('click', (e) => e.preventDefault());

  function showVideo() {
    if (!c.video) return;
    if (/youtube\.com|youtu\.be/.test(c.video)) {
      const url = c.video.includes('/embed/') ? c.video : c.video.replace(/.*(?:v=|youtu\.be\/)([\w-]+).*/, 'https://www.youtube.com/embed/$1');
      videoFrame.innerHTML = `<iframe src="${url}?autoplay=1&playsinline=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen title="A message for you"></iframe>`;
    } else {
      videoFrame.innerHTML = `<video src="${c.video}" controls playsinline autoplay></video>`;
    }
    videoWrap.hidden = false;
    gsap.fromTo(videoWrap, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1, delay: 0.8 });
    setTimeout(() => videoWrap.scrollIntoView({ behavior: 'smooth', block: 'center' }), 1200);
  }

  yes.addEventListener('click', () => {
    gsap.to(no, { opacity: 0, scale: 0, duration: 0.3 });
    gsap.to(yes, { scale: 1, duration: 0.3 });
    gsap.to(after, { opacity: 1, y: 0, duration: 1 });
    gsap.from(after, { y: 14, duration: 1 });
    const end = Date.now() + 4000;
    (function rain() {
      confetti({ particleCount: 6, spread: 120, startVelocity: 25, origin: { x: Math.random(), y: 0 },
        shapes: ['circle'], colors: ['#ff6b9d', '#ffb3c9', '#e9c46a', '#ffffff'], scalar: 1.2 });
      if (Date.now() < end) requestAnimationFrame(rain);
    })();
    showVideo();
  });
}
