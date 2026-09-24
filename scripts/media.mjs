// Import pipeline. Drop photos in /Image, videos in /Video, childhood photos in /child_phots,
// then run `npm run media`. Photos are resized for phones, thumbnails are generated,
// videos are copied, and src/media.json is written. Captions already in media.json are kept.

import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'public', 'media');
const MANIFEST = path.join(ROOT, 'src', 'media.json');
const MAX_EDGE = 1400;   // full-size long edge in px
const THUMB_EDGE = 420;  // thumbnail long edge in px

const natural = (a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
const listFiles = (dir, exts) => (fs.existsSync(dir) ? fs.readdirSync(dir).filter((f) => exts.includes(path.extname(f).toLowerCase())).sort(natural) : []);
const PHOTO_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.heic'];

const previous = fs.existsSync(MANIFEST) ? JSON.parse(fs.readFileSync(MANIFEST, 'utf8')) : {};
const prevBySource = new Map();
for (const list of Object.values(previous)) if (Array.isArray(list)) for (const m of list) prevBySource.set(m.source, m);

// Resize every photo in `dir` into public/media/<outSub>/ and return manifest entries.
async function processPhotos(dir, prefix, outSub, thumbSub) {
  fs.mkdirSync(path.join(OUT, outSub), { recursive: true });
  fs.mkdirSync(path.join(OUT, thumbSub), { recursive: true });
  const files = listFiles(path.join(ROOT, dir), PHOTO_EXTS);
  const list = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const id = `${prefix}${String(i + 1).padStart(2, '0')}`;
    const prev = prevBySource.get(file) || {};
    // honour EXIF orientation, plus any manual "rotate": 90 / 180 / 270 set on the entry in media.json
    const image = prev.rotate ? sharp(path.join(ROOT, dir, file)).rotate().rotate(prev.rotate) : sharp(path.join(ROOT, dir, file)).rotate();
    const meta = await image.metadata();
    const fullPath = path.join(OUT, outSub, `${id}.jpg`);
    const thumbPath = path.join(OUT, thumbSub, `${id}.jpg`);
    await image.clone().resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 82, mozjpeg: true }).toFile(fullPath);
    await image.clone().resize({ width: THUMB_EDGE, height: THUMB_EDGE, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 74, mozjpeg: true }).toFile(thumbPath);
    const full = await sharp(fullPath).metadata();
    const { dominant } = await sharp(thumbPath).stats();
    list.push({
      id, type: 'photo', source: file,
      src: `media/${outSub}/${id}.jpg`, thumb: `media/${thumbSub}/${id}.jpg`,
      w: full.width, h: full.height, portrait: full.height >= full.width,
      color: `rgb(${dominant.r},${dominant.g},${dominant.b})`,
      caption: prev.caption || '',
      ...(prev.rotate ? { rotate: prev.rotate } : {}),
    });
    process.stdout.write(`${dir}: ${id}  ${meta.width}x${meta.height} -> ${full.width}x${full.height}  ${file}\n`);
  }
  return list;
}

const photos = await processPhotos('Image', 'p', 'photos', 'thumbs');
const childhood = await processPhotos('child_phots', 'c', 'child', 'child/thumbs');

fs.mkdirSync(path.join(OUT, 'videos'), { recursive: true });
const videos = [];
const videoFiles = listFiles(path.join(ROOT, 'Video'), ['.mp4', '.mov', '.webm']);
for (let i = 0; i < videoFiles.length; i++) {
  const file = videoFiles[i];
  const id = `v${String(i + 1).padStart(2, '0')}`;
  const ext = path.extname(file).toLowerCase();
  const dest = path.join(OUT, 'videos', `${id}${ext}`);
  fs.copyFileSync(path.join(ROOT, 'Video', file), dest);
  const prev = prevBySource.get(file) || {};
  videos.push({
    id, type: 'video', source: file, src: `media/videos/${id}${ext}`, bytes: fs.statSync(dest).size, caption: prev.caption || '',
    // poster data from `npm run posters` is kept across re-runs
    ...(prev.poster ? { poster: prev.poster, thumb: prev.thumb, w: prev.w, h: prev.h, portrait: prev.portrait, duration: prev.duration } : {}),
  });
  process.stdout.write(`Video: ${id}  ${(fs.statSync(dest).size / 1e6).toFixed(1)} MB  ${file}\n`);
}

fs.writeFileSync(MANIFEST, JSON.stringify({ generated: new Date().toISOString(), photos, childhood, videos }, null, 2));
const mb = (list) => (list.reduce((s, p) => s + fs.statSync(path.join(ROOT, 'public', p.src)).size, 0) / 1e6).toFixed(1);
console.log(`\n${photos.length} photos (${mb(photos)} MB), ${childhood.length} childhood photos (${mb(childhood)} MB), ${videos.length} videos (${mb(videos)} MB) -> src/media.json`);
