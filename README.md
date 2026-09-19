# For Her 💌

A cinematic, scroll-driven birthday website. Open it on a phone.

Live: https://rakshitvashist.github.io/Birthday/

## What happens when she opens it

1. **Lock screen** – she must enter a date only she knows.
2. **Intro** – thousands of particles form a heart, then her name.
3. **The letter** – your words type out live over soft piano.
4. **Timeline** – your story, photo by photo, with parallax.
5. **Flower garden** – tap the ground and a flower grows. Ten taps fill the field.
6. **Reasons I love you** – a swipeable card deck.
7. **Bouquet** – drag flowers from a shelf into a paper wrap. A card slides out when it is full.
8. **Blow out the candles** – she blows into the mic (or taps).
9. **Balloons** – pop them to read the notes they carry.
10. **Catch our memories** – a mini game that unlocks the rest.
11. **Night sky** – your dates as stars. Tap them all to draw the heart.
12. **Scratch card** – rub the silver foil to reveal a photo and a surprise.
13. **Polaroid wall** – drag the photos around.
14. **Fireworks** – each tap launches a burst that spells the next letter of her name.
15. **The ending** – countdown, the question, the runaway "No", and a video message after Yes.
16. **Wish jar** – she writes a wish, it drops into the jar and is kept on her phone for next year.

## Adding photos and videos

1. Drop photos into `Image/` and videos into `Video/` (any names, any sizes).
2. Run `npm run media`. It resizes photos for phones, makes thumbnails, copies videos,
   and writes `src/media.json`. Then run `npm run posters` to make a cover image for each video.
3. Every media section (stories, mosaic, gallery, game, corkboard, photo rain) updates by itself.
   Sections that show a specific photo (intro face, timeline, "Through my eyes", scratch card)
   name the photo in `src/content.js`, e.g. `media/photos/p15.jpg`. Ids follow file order.
4. To caption a photo or video, add `"caption": "..."` to its entry in `src/media.json`.
   Captions survive re-runs of the script.

Keep the total under ~500 MB. Long videos are better on YouTube (unlisted) and pasted into
`ending.video`.

## Make it hers

1. **Edit `src/content.js`.** Every word on the site lives there: her name, dates,
   the lock answer, the letter, timeline, reasons, balloon notes, the scratch-card
   surprise, the ending.
2. **Add photos** to `public/photos/`. Portrait photos (4:5) look best.
   Name them `1.jpg`, `2.jpg`… and update the `photo:` paths in `content.js`.
   Keep each under ~500 KB so it loads fast on mobile.
3. **Add audio** to `public/audio/`:
   - `piano.mp3` – a soft instrumental loop (plays during the letter and timeline)
   - `song.mp3` – her song (plays when the candles go out)
   Missing files are ignored, the site still works without them.
4. **Add the video** (optional). Put a file at `public/video/message.mp4` and set
   `ending.video: 'video/message.mp4'` in `content.js`, or paste a YouTube link.
   Keep the file under ~50 MB. Portrait (9:16) fits the frame.
5. **Preview**: `npm run dev` then open the URL it prints. Test on your phone too
   (same Wi-Fi, use the "Network" URL Vite prints).

## Deploy

Every push to `main` builds and publishes the site through the workflow in
`.github/workflows/deploy.yml`. GitHub Pages must be set to **Source: GitHub Actions**
(Settings → Pages), which is already done for this repo.

```bash
git add -A
git commit -m "Update content"
git push
```

## Tips

- The **microphone** only works over HTTPS (GitHub Pages is HTTPS) or on localhost.
- **WhatsApp preview**: set `share.image` in `content.js` to a full URL
  (e.g. `https://rakshitvashist.github.io/Birthday/photos/1.jpg`) once photos are in.
- The **wish jar** saves to her phone's browser storage. It stays until she clears site data.
- **Custom domain** (optional): buy one, add a `CNAME` file in `public/` and set it in Pages settings.
- Send her the link at midnight. Trust me.
