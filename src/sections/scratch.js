import { gsap } from 'gsap';
import confetti from 'canvas-confetti';

// A silver scratch-off card. Rub it to reveal a photo and a surprise.
export function mountScratch(host, content) {
  const c = content.scratch;
  const section = document.createElement('section');
  section.className = 'section scratch';
  section.innerHTML = `
    <div class="section-inner">
      <div class="eyebrow reveal">${c.title}</div>
      <h2 class="reveal">${c.hint}</h2>
      <div class="scratch-card reveal">
        <div class="scratch-under">
          <img src="${c.photo}" alt="" />
          <div class="scratch-text"><b>${c.revealTitle}</b><p>${c.revealText}</p></div>
        </div>
        <canvas class="scratch-foil"></canvas>
      </div>
    </div>`;
  host.appendChild(section);

  const card = section.querySelector('.scratch-card');
  const canvas = section.querySelector('.scratch-foil');
  const ctx = canvas.getContext('2d');
  let W = 0, H = 0, dpr = 1, ready = false, done = false, scratching = false, moves = 0, last = null;

  function paintFoil() {
    W = card.clientWidth; H = card.clientHeight; dpr = Math.min(2, window.devicePixelRatio || 1);
    if (!W || !H) return;
    canvas.width = W * dpr; canvas.height = H * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const g = ctx.createLinearGradient(0, 0, W, H);
    g.addColorStop(0, '#bfc3cc'); g.addColorStop(0.3, '#e9ecf1'); g.addColorStop(0.5, '#a9aeb8'); g.addColorStop(0.7, '#e3e6eb'); g.addColorStop(1, '#b3b8c2');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    // brushed texture
    ctx.strokeStyle = 'rgba(255,255,255,0.12)';
    for (let i = 0; i < H; i += 3) { ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(W, i + 6); ctx.stroke(); }
    ctx.fillStyle = 'rgba(60,64,72,0.55)';
    ctx.font = '600 22px Inter, sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('SCRATCH ME', W / 2, H / 2 - 6);
    ctx.font = '30px serif';
    ctx.fillText('🪙', W / 2, H / 2 + 34);
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 46;
    ready = true;
  }

  function erasedRatio() {
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0, total = 0;
    for (let i = 3; i < data.length; i += 4 * 16) { total += 1; if (data[i] === 0) clear += 1; }
    return clear / total;
  }

  function reveal() {
    done = true;
    gsap.to(canvas, { opacity: 0, duration: 0.8, onComplete: () => { canvas.style.pointerEvents = 'none'; } });
    confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 }, colors: ['#e9ecf1', '#ff6b9d', '#e9c46a'] });
    gsap.fromTo(section.querySelector('.scratch-text'), { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, delay: 0.3 });
  }

  const pos = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener('pointerdown', (e) => { if (!ready || done) return; scratching = true; last = pos(e); canvas.setPointerCapture(e.pointerId); e.preventDefault(); });
  canvas.addEventListener('pointermove', (e) => {
    if (!scratching || done) return;
    const p = pos(e);
    ctx.beginPath(); ctx.moveTo(last.x, last.y); ctx.lineTo(p.x, p.y); ctx.stroke();
    last = p;
    moves += 1;
    if (moves % 10 === 0 && erasedRatio() > 0.5) reveal();
  });
  const stop = () => { scratching = false; if (!done && moves > 0 && erasedRatio() > 0.5) reveal(); };
  canvas.addEventListener('pointerup', stop);
  canvas.addEventListener('pointercancel', stop);

  const ro = new ResizeObserver(() => { if (card.clientWidth > 0 && !ready) { paintFoil(); } });
  ro.observe(card);
}
