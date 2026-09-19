// Makes a poster image for every video in media.json using the installed Chrome.
// Run after `npm run media`: `npm run posters`. Needs Chrome or Edge on this machine (dev only).
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';
import puppeteer from 'puppeteer-core';

const ROOT = process.cwd();
const MANIFEST = path.join(ROOT, 'src', 'media.json');
const data = JSON.parse(fs.readFileSync(MANIFEST, 'utf8'));
const outDir = path.join(ROOT, 'public', 'media', 'posters');
fs.mkdirSync(outDir, { recursive: true });

const candidates = [
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Google/Chrome/Application/chrome.exe',
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
];
const chrome = candidates.find((p) => fs.existsSync(p));
if (!chrome) {
  console.error('No Chrome or Edge found. Posters were not generated.');
  process.exit(1);
}

// Serve /public over HTTP so the browser can read the videos (file:// is blocked for media + canvas).
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') { res.writeHead(200, { 'Content-Type': 'text/html' }); return res.end('<!doctype html><title>posters</title>'); }
  const p = path.join(ROOT, 'public', decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(path.join(ROOT, 'public')) || !fs.existsSync(p) || fs.statSync(p).isDirectory()) { res.statusCode = 404; return res.end(); }
  const size = fs.statSync(p).size;
  const type = p.endsWith('.mp4') ? 'video/mp4' : p.endsWith('.mov') ? 'video/quicktime' : 'application/octet-stream';
  const range = req.headers.range;
  if (range) {
    const [s, e] = range.replace('bytes=', '').split('-').map((n) => parseInt(n, 10));
    const start = s || 0, end = Number.isFinite(e) ? e : size - 1;
    res.writeHead(206, { 'Content-Type': type, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(p, { start, end }).pipe(res);
  } else {
    res.writeHead(200, { 'Content-Type': type, 'Content-Length': size, 'Accept-Ranges': 'bytes' });
    fs.createReadStream(p).pipe(res);
  }
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await puppeteer.launch({ executablePath: chrome, headless: 'new', args: ['--no-sandbox', '--autoplay-policy=no-user-gesture-required'] });
const page = await browser.newPage();
await page.goto(base); // same origin as the videos, so the canvas is not tainted

for (const v of data.videos) {
  const url = base + v.src;
  const result = await page.evaluate(async (src) => {
    const video = document.createElement('video');
    video.src = src;
    video.muted = true;
    video.playsInline = true;
    document.body.appendChild(video);
    await new Promise((res, rej) => {
      video.onloadedmetadata = res;
      video.onerror = () => rej(new Error('load failed'));
    });
    video.currentTime = Math.min(1.0, video.duration / 3);
    await new Promise((res) => { video.onseeked = res; });
    const c = document.createElement('canvas');
    const scale = Math.min(1, 720 / Math.max(video.videoWidth, video.videoHeight));
    c.width = Math.round(video.videoWidth * scale);
    c.height = Math.round(video.videoHeight * scale);
    c.getContext('2d').drawImage(video, 0, 0, c.width, c.height);
    return { data: c.toDataURL('image/jpeg', 0.8), w: video.videoWidth, h: video.videoHeight, duration: video.duration };
  }, url);
  const dest = path.join(outDir, `${v.id}.jpg`);
  fs.writeFileSync(dest, Buffer.from(result.data.split(',')[1], 'base64'));
  v.poster = `media/posters/${v.id}.jpg`;
  v.thumb = v.poster;
  v.w = result.w;
  v.h = result.h;
  v.portrait = result.h >= result.w;
  v.duration = Math.round(result.duration * 10) / 10;
  console.log(`${v.id}  ${result.w}x${result.h}  ${v.duration}s  -> ${v.poster}`);
}

await browser.close();
server.close();
fs.writeFileSync(MANIFEST, JSON.stringify(data, null, 2));
console.log('media.json updated with posters');
