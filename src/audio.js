// Tiny audio manager. Missing files fail silently so the site never breaks
// just because a track has not been added yet.

function make(src, { loop = false, volume = 1 } = {}) {
  if (!src) return null;
  const a = new Audio(src);
  a.loop = loop;
  a.volume = volume;
  a.preload = 'auto';
  a.addEventListener('error', () => { a.dataset.broken = '1'; });
  return a;
}

function fade(a, to, ms = 1200) {
  if (!a) return;
  const from = a.volume;
  const start = performance.now();
  const step = (t) => {
    const k = Math.min(1, (t - start) / ms);
    a.volume = from + (to - from) * k;
    if (k < 1) requestAnimationFrame(step);
    else if (to === 0) a.pause();
  };
  requestAnimationFrame(step);
}

export const audio = {
  bg: null,
  song: null,
  muted: false,

  init(cfg) {
    this.bg = make(cfg.background, { loop: true, volume: 0 });
    this.song = make(cfg.celebrate, { loop: false, volume: 0 });
  },

  playBackground() {
    const a = this.bg;
    if (!a || a.dataset.broken || this.muted) return;
    a.play().then(() => fade(a, 0.45, 2500)).catch(() => {});
  },

  celebrate() {
    if (this.bg) fade(this.bg, 0, 1500);
    const a = this.song;
    if (!a || a.dataset.broken || this.muted) return;
    a.currentTime = 0;
    a.play().then(() => fade(a, 0.8, 1500)).catch(() => {});
  },

  toggleMute() {
    this.muted = !this.muted;
    [this.bg, this.song].forEach((a) => { if (a) a.muted = this.muted; });
    if (!this.muted && this.bg && this.bg.paused && !(this.song && !this.song.paused)) this.playBackground();
    return this.muted;
  },
};
