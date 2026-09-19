import './styles.css';
import './styles-features.css';
import './styles-media.css';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { content } from './content.js';
import { audio } from './audio.js';
import { mountLock } from './sections/lock.js';
import { mountIntro } from './sections/intro.js';
import { mountLetter } from './sections/letter.js';
import { mountTimeline } from './sections/timeline.js';
import { mountYou } from './sections/you.js';
import { mountStories } from './sections/stories.js';
import { mountGarden } from './sections/garden.js';
import { mountMosaic } from './sections/mosaic.js';
import { mountGallery } from './sections/gallery.js';
import { mountReasons } from './sections/reasons.js';
import { mountBouquet } from './sections/bouquet.js';
import { mountCake } from './sections/cake.js';
import { mountBalloons } from './sections/balloons.js';
import { mountGame } from './sections/game.js';
import { mountSky } from './sections/sky.js';
import { mountScratch } from './sections/scratch.js';
import { mountWall } from './sections/wall.js';
import { mountFireworks } from './sections/fireworks.js';
import { mountEnding } from './sections/ending.js';
import { mountWishJar } from './sections/wishjar.js';

gsap.registerPlugin(ScrollTrigger);

const app = document.getElementById('app');
document.title = content.share.title;
document.querySelector('meta[property="og:title"]').content = content.share.title;
document.querySelector('meta[property="og:description"]').content = content.share.description;
document.querySelector('meta[property="og:image"]').content = content.share.image;

// Ambient layers
document.body.insertAdjacentHTML('afterbegin', '<div class="ambient"></div><div class="grain"></div><div class="floating-hearts"></div>');

// Sound toggle
const soundBtn = document.createElement('button');
soundBtn.className = 'sound-toggle';
soundBtn.setAttribute('aria-label', 'Toggle sound');
soundBtn.textContent = '🔊';
soundBtn.addEventListener('click', () => {
  const muted = audio.toggleMute();
  soundBtn.textContent = muted ? '🔇' : '🔊';
});
document.body.appendChild(soundBtn);

// Loader
const loader = document.createElement('div');
loader.className = 'loader';
loader.innerHTML = '<div class="heart">❤️</div><p>Something is loading for you…</p>';
document.body.appendChild(loader);

// Floating hearts (subtle, continuous once unlocked)
function startHearts() {
  const host = document.querySelector('.floating-hearts');
  const glyphs = ['❤', '♡', '✦', '❥'];
  setInterval(() => {
    if (document.hidden) return;
    const s = document.createElement('span');
    s.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
    s.style.left = Math.random() * 100 + 'vw';
    s.style.fontSize = 12 + Math.random() * 16 + 'px';
    s.style.color = Math.random() > 0.5 ? 'var(--rose)' : 'var(--gold)';
    s.style.animationDuration = 9 + Math.random() * 8 + 's';
    host.appendChild(s);
    setTimeout(() => s.remove(), 18000);
  }, 1400);
}

// Generic scroll reveal for anything with .reveal
function setupReveals() {
  document.querySelectorAll('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
    });
  });
}

async function boot() {
  document.body.classList.add('locked');
  await new Promise((r) => setTimeout(r, 1200));
  loader.style.opacity = '0';
  setTimeout(() => loader.remove(), 800);

  // Build every section up front (hidden behind the lock) so scroll layout is ready.
  const intro = mountIntro(app, content);
  mountLetter(app, content);
  mountTimeline(app, content);
  mountYou(app, content);
  mountStories(app, content);
  mountGarden(app, content);
  mountReasons(app, content);
  mountMosaic(app, content);
  mountBouquet(app, content);
  mountCake(app, content);
  mountBalloons(app, content);
  const afterGame = document.createElement('div');
  afterGame.id = 'after-game';
  afterGame.style.display = 'none';
  mountGame(app, content, () => {
    afterGame.style.display = '';
    ScrollTrigger.refresh();
    gsap.from(afterGame, { opacity: 0, duration: 1 });
  });
  app.appendChild(afterGame);
  mountSky(afterGame, content);
  mountScratch(afterGame, content);
  mountGallery(afterGame, content);
  mountWall(afterGame, content);
  mountFireworks(afterGame, content);
  mountEnding(afterGame, content);
  mountWishJar(afterGame, content);
  setupReveals();

  // The lock sits on top of everything.
  await mountLock(document.body, content);

  // Unlock happened via a user gesture, so audio is allowed to start now.
  document.body.classList.remove('locked');
  window.scrollTo(0, 0);
  audio.init(content.audio);
  soundBtn.classList.add('show');
  startHearts();
  intro.play().then(() => audio.playBackground());
  ScrollTrigger.refresh();
}

boot();
