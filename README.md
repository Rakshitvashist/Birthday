# For Her 💌

A cinematic, scroll-driven birthday website. Open it on a phone.

## What happens when she opens it

1. **Lock screen** – she must enter a date only she knows.
2. **Intro** – thousands of particles form a heart, then her name.
3. **The letter** – your words type out live over soft piano.
4. **Timeline** – your story, photo by photo, with parallax.
5. **Reasons I love you** – a swipeable card deck.
6. **Blow out the candles** – she blows into the mic (or taps).
7. **Catch our memories** – a mini game that unlocks the rest.
8. **Polaroid wall** – drag the photos around.
9. **Our playlist** – Spotify / YouTube embed.
10. **The ending** – countdown, the question, the runaway "No" button.

## Make it hers (5 steps)

1. **Edit `src/content.js`.** Every word on the site lives there: her name, dates,
   the lock answer, the letter, timeline captions, reasons, the ending.
2. **Add photos** to `public/photos/`. Portrait photos (4:5) look best.
   Name them `1.jpg`, `2.jpg`… and update the `photo:` paths in `content.js`.
   Keep each under ~500 KB so it loads fast on mobile.
3. **Add audio** to `public/audio/`:
   - `piano.mp3` – a soft instrumental loop (plays during the letter and timeline)
   - `song.mp3` – her song (plays when the candles go out)
   Missing files are ignored, the site still works without them.
4. **Playlist** – in Spotify, Share → Embed playlist → copy the `src` URL into `content.js`.
5. **Preview**: `npm run dev` then open the URL it prints. Test on your phone too
   (same Wi-Fi, use the "Network" URL Vite prints).

## Deploy (free, GitHub Pages)

```bash
git add -A
git commit -m "Make it hers"
gh repo create Birthday --public --source=. --push     # or create the repo on github.com and push
```

Then on GitHub: **Settings → Pages → Source: GitHub Actions**. The workflow in
`.github/workflows/deploy.yml` builds and publishes on every push to `main`.

Your link will be `https://<your-username>.github.io/Birthday/`.

Want it private-ish? Keep the repo public (Pages needs it on free plans) but the
lock screen means only she can get past the first screen.

## Tips

- The **microphone** only works over HTTPS (GitHub Pages is HTTPS) or on localhost.
- **WhatsApp preview**: set `share.image` in `content.js` to a full URL
  (e.g. `https://<user>.github.io/Birthday/photos/1.jpg`) once deployed.
- **Custom domain** (optional): buy one, add a `CNAME` file in `public/` and set it in Pages settings.
- Send her the link at midnight. Trust me.
