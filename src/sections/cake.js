import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import confetti from 'canvas-confetti';
import { audio } from '../audio.js';

// A cake whose candles go out when she blows into the mic (or taps them).
export function mountCake(host, content) {
  const c = content.cake;
  const n = c.candles;
  const section = document.createElement('section');
  section.className = 'section cake';

  const candleSvg = Array.from({ length: n }, (_, i) => {
    const x = 60 + (i * 140) / Math.max(1, n - 1);
    return `
      <g class="candle-group" data-i="${i}">
        <rect x="${x - 5}" y="70" width="10" height="42" rx="2" fill="${i % 2 ? '#ffb3c9' : '#e9c46a'}" />
        <rect x="${x - 5}" y="70" width="10" height="42" rx="2" fill="url(#stripes)" opacity="0.5" />
        <line x1="${x}" y1="62" x2="${x}" y2="70" stroke="#333" stroke-width="2" />
        <ellipse class="smoke" cx="${x}" cy="58" rx="4" ry="8" fill="rgba(200,200,200,0.6)" />
        <path class="flame" d="M${x} 42 C${x + 8} 52 ${x + 6} 62 ${x} 64 C${x - 6} 62 ${x - 8} 52 ${x} 42Z" fill="url(#flame)" />
      </g>`;
  }).join('');

  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">Close your eyes.</h2>
      <p class="lead reveal">${c.instruction}</p>
      <div class="cake-wrap reveal">
        <svg class="cake-svg" viewBox="0 0 260 240" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="flame" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stop-color="#fff5c2" /><stop offset="0.5" stop-color="#ffb347" /><stop offset="1" stop-color="#ff6b3d" />
            </linearGradient>
            <pattern id="stripes" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <rect width="3" height="6" fill="#fff" />
            </pattern>
            <linearGradient id="cream" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0" stop-color="#fff0f5" /><stop offset="1" stop-color="#ffd1e0" />
            </linearGradient>
          </defs>
          ${candleSvg}
          <!-- top tier -->
          <rect x="40" y="110" width="180" height="50" rx="10" fill="#7a2e4a" />
          <path d="M40 120 Q60 140 80 120 T120 120 T160 120 T200 120 T220 120 V110 H40Z" fill="url(#cream)" />
          <!-- bottom tier -->
          <rect x="20" y="158" width="220" height="60" rx="12" fill="#5c2138" />
          <path d="M20 168 Q40 190 60 168 T100 168 T140 168 T180 168 T220 168 T240 168 V158 H20Z" fill="url(#cream)" />
          <!-- plate -->
          <ellipse cx="130" cy="222" rx="125" ry="12" fill="rgba(255,255,255,0.12)" />
        </svg>
      </div>
      <div class="meter reveal"><i></i></div>
      <button class="btn ghost mic reveal">🎤 Use microphone</button>
      <p class="lead reveal" style="margin-top:12px;font-size:0.85rem">${c.fallback}</p>
      <p class="after">${c.afterMessage}</p>
    </div>`;
  host.appendChild(section);

  const flames = [...section.querySelectorAll('.flame')];
  const smokes = [...section.querySelectorAll('.smoke')];
  const meter = section.querySelector('.meter i');
  const micBtn = section.querySelector('.mic');
  const after = section.querySelector('.after');
  let outCount = 0, done = false, stream = null, raf = 0;

  function blowOut(i) {
    if (flames[i].classList.contains('out')) return;
    flames[i].classList.add('out');
    smokes[i].classList.add('show');
    outCount += 1;
    if (outCount >= n) finish();
  }

  function finish() {
    if (done) return;
    done = true;
    if (stream) stream.getTracks().forEach((t) => t.stop());
    cancelAnimationFrame(raf);
    micBtn.style.display = 'none';
    audio.celebrate();
    const end = Date.now() + 2500;
    (function burst() {
      confetti({ particleCount: 5, angle: 60, spread: 70, origin: { x: 0 }, colors: ['#ff6b9d', '#e9c46a', '#ffffff'] });
      confetti({ particleCount: 5, angle: 120, spread: 70, origin: { x: 1 }, colors: ['#ff6b9d', '#e9c46a', '#ffffff'] });
      if (Date.now() < end) requestAnimationFrame(burst);
    })();
    confetti({ particleCount: 180, spread: 100, origin: { y: 0.6 }, colors: ['#ff6b9d', '#e9c46a', '#ffb3c9', '#ffffff'] });
    gsap.to(after, { opacity: 1, y: 0, duration: 1.2, delay: 0.6 });
    gsap.from(after, { y: 12, duration: 1.2, delay: 0.6 });
  }

  // Tap fallback
  section.querySelectorAll('.candle-group').forEach((g) => {
    g.addEventListener('click', () => blowOut(Number(g.dataset.i)));
  });

  // Microphone: measure loudness; a sustained gust puts candles out one by one.
  async function startMic() {
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      micBtn.textContent = 'Mic blocked, tap the candles instead';
      return;
    }
    micBtn.textContent = '🎤 Listening… blow!';
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const src = ctx.createMediaStreamSource(stream);
    const analyser = ctx.createAnalyser();
    analyser.fftSize = 512;
    src.connect(analyser);
    const buf = new Uint8Array(analyser.frequencyBinCount);
    let energy = 0;
    const tick = () => {
      analyser.getByteTimeDomainData(buf);
      let sum = 0;
      for (let i = 0; i < buf.length; i++) { const v = (buf[i] - 128) / 128; sum += v * v; }
      const rms = Math.sqrt(sum / buf.length);
      // Blowing is loud and broadband; accumulate while above threshold, decay otherwise.
      energy = rms > 0.12 ? Math.min(1, energy + 0.035) : Math.max(0, energy - 0.01);
      meter.style.width = energy * 100 + '%';
      const shouldBeOut = Math.floor(energy * n);
      for (let i = 0; i < shouldBeOut; i++) blowOut(i);
      if (!done) raf = requestAnimationFrame(tick);
    };
    tick();
  }
  micBtn.addEventListener('click', startMic);

  // Gentle flame wobble when the section is in view, and prompt for the mic once.
  ScrollTrigger.create({ trigger: section, start: 'top 60%', once: true, onEnter: () => {
    gsap.from(section.querySelectorAll('.candle-group'), { y: 20, opacity: 0, stagger: 0.08, duration: 0.6 });
  } });
}
