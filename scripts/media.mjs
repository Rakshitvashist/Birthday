// Import pipeline: drop photos in /Image and videos in /Video, run `npm run media`.
// Photos are resized for phones, thumbnails are generated, videos are copied,
// and src/media.json is written. Captions already in media.json are preserved.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const IMG_DIR = path.join(ROOT, 'Image');
const VID_DIR = path.join(ROOT, 'Video');
const OUT = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'src', 'media.json');
const MAX_EDGE = 1400;   // full-size long edge in px
const THUMB_EDGE = 420;  // thumbnail long edge in px

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
const listFiles = (dir, exts) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => exts.includes(path.extname(f).toLowerCase())).sort(natural) : []);

for (const d of ['photos', 'thumbs', 'videos']) fs.mkdirSync(path.join(OUT, d), { recursive: true });

const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : { photos: [], videos: [] };
const prevBySource = new Map([...previous.photos, ...previous.videos].map((m) => [m.source, m]));

const photos = [];
const photoFiles = listFiles(IMG_DIR, ['.jpg', '.jpeg', '.png', '.webp', '.heic']);
for (let i = 0; i < photoFiles.length; i++) {
  const file = photoFiles[i];
  const id = `p${String(i + 1).padStart(2, '0')}`;
  const src = path.join(IMG_DIR, file);
  const image = sharp(src).rotate(); // honour orientation
  const meta = await image.metadata();
  const fullPath = path.join(OUT, 'photos', `${id}.jpg`);
  const thumbPath = path.join(OUT, 'thumbs', `${id}.jpg`);
  await image.clone().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(fullPath);
  await image.clone().resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toFile(thumbPath);
  const full = await sharp(fullPath).metadata();
  // dominant colour for placeholders while loading
  const { dominant } = await sharp(thumbPath).stats();
  const prev = prevBySource.get(file) || {};
  photos.push({
    id, type: 'photo', source: file,
    src: `media/photos/${id}.jpg`, thumb: `media/thumbs/${id}.jpg`,
    w: full.width, h: full.height, portrait: full.height >= full.width,
    color: `rgb(${dominant.r},${dominant.g},${dominant.b})`,
    caption: prev.caption || '',
  });
  process.stdout.write(`photo ${id}  ${meta.width}x${meta.height} -> ${full.width}x${full.height}  ${file}\n`);
}

const videos = [];
const videoFiles = listFiles(VID_DIR, ['.mp4', '.mov', '.webm']);
for (let i = 0; i < videoFiles.length; i++) {
  const file = videoFiles[i];
  const id = `v${String(i + 1).padStart(2, '0')}`;
  const ext = path.extname(file).toLowerCase() === '.mov' ? '.mov' : path.extname(file).toLowerCase();
  const dest = path.join(OUT, 'videos', `${id}${ext}`);
  fs.copyFileSync(path.join(VID_DIR, file), dest);
  const prev = prevBySource.get(file) || {};
  videos.push({ id, type: 'video', source: file, src: `media/videos/${id}${ext}`, bytes: fs.statSync(dest).size, caption: prev.caption || '' });
  process.stdout.write(`video ${id}  ${(fs.statSync(dest).size / 1e6).toFixed(1)} MB  ${file}\n`);
}

fs.writeFileSync(MANIFEST, JSON.stringify({ generated: new Date().toISOString(), photos, videos }, null, 2));
const totalPhoto = photos.reduce((s, p) => s + fs.statSync(path.join(ROOT, 'public', p.src)).size, 0);
const totalVideo = videos.reduce((s, v) => s + v.bytes, 0);
console.log(`\n${photos.length} photos (${(totalPhoto / 1e6).toFixed(1)} MB), ${videos.length} videos (${(totalVideo / 1e6).toFixed(1)} MB) -> src/media.json`);
