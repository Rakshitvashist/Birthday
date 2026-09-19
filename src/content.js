// ============================================================
//  EDIT THIS FILE ONLY. Everything on the site comes from here.
// ============================================================

export const content = {
  // Her name, exactly how you call her.
  name: 'Priya',
  // Her birthday. Used for the page title and the countdown.
  birthday: '2026-10-05',

  // ---------- Lock screen ----------
  lock: {
    question: 'Enter the date we first met',
    hint: 'Think of the day at the coffee shop… (DD-MM-YYYY)',
    // Accepted answers. Any of these unlocks the site. Keep them lowercase.
    answers: ['14-02-2024', '14/02/2024', '14022024'],
    wrongMessages: [
      'Nope. You know this one 😌',
      'Try again, my love.',
      'Hint: it was raining that day.',
    ],
  },

  // ---------- Intro ----------
  intro: {
    lines: ['Happy Birthday', 'Priya'],
    subtitle: 'I made this for you.',
  },

  // ---------- The letter ----------
  letter: {
    title: 'A letter, from me to you',
    // Each paragraph types out one after another.
    paragraphs: [
      'Happy birthday, my love.',
      'I wanted to give you something that no shop could sell, so I built you this. Every pixel of it is me trying to say what I usually stumble over in words.',
      'You make ordinary days feel like they were written for us. Thank you for choosing me, every single day.',
      'Scroll down. I have a few things to show you.',
    ],
    signature: '— Forever yours, Rakshit',
  },

  // ---------- Timeline ----------
  // Put photos in /public/photos and reference them by filename.
  timeline: {
    title: 'Our story so far',
    events: [
      { date: '14 Feb 2024', title: 'The day we met', caption: 'You spilled coffee on my notes and apologised for five minutes straight.', photo: 'photos/1.svg' },
      { date: '02 Mar 2024', title: 'First date', caption: 'We talked so long the restaurant had to ask us to leave.', photo: 'photos/2.svg' },
      { date: '19 Apr 2024', title: 'First trip together', caption: 'You got us lost on purpose. I still think it was on purpose.', photo: 'photos/3.svg' },
      { date: '05 Oct 2024', title: 'Your last birthday', caption: 'The cake was terrible. Your smile was not.', photo: 'photos/4.svg' },
      { date: '31 Dec 2024', title: 'New Year, together', caption: 'First midnight kiss of many.', photo: 'photos/5.svg' },
      { date: 'Today', title: 'And now this', caption: 'Another year of you. Lucky me.', photo: 'photos/6.svg' },
    ],
  },

  // ---------- Reasons ----------
  reasons: {
    title: 'Reasons I love you',
    list: [
      'The way you laugh at your own jokes before you finish them.',
      'You remember the smallest things I say and bring them up months later.',
      'You steal my hoodies and look better in them than I ever did.',
      'Your voice when you are sleepy.',
      'You believe in me on the days I forget to.',
      'You dance in the kitchen like nobody is watching. I am always watching.',
      'The way you say my name when you are annoyed at me.',
      'You make every place feel like home.',
    ],
  },

  // ---------- Cake ----------
  cake: {
    title: 'Make a wish',
    instruction: 'Blow into your phone to blow out the candles 🎂',
    fallback: 'Or tap the candles',
    candles: 5,
    afterMessage: 'Did you make a wish? Don\'t tell me. Let it come true.',
  },

  // ---------- Game ----------
  game: {
    title: 'Catch our memories',
    instruction: 'Tap the falling polaroids before they hit the ground. Catch 10 to unlock what\'s next.',
    target: 10,
    // Uses the timeline photos automatically.
  },

  // ---------- Polaroid wall ----------
  wall: {
    title: 'Our wall',
    subtitle: 'Drag them around. They\'re all yours.',
  },

  // ---------- Playlist ----------
  playlist: {
    title: 'Songs that sound like us',
    // Use a Spotify embed URL (Share -> Embed) or a YouTube embed URL.
    // Spotify example: https://open.spotify.com/embed/playlist/37i9dQZF1DX50QitC6Oqtn
    // YouTube example: https://www.youtube.com/embed/VIDEO_ID
    embedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DX50QitC6Oqtn?utm_source=generator&theme=0',
  },

  // ---------- Ending ----------
  ending: {
    title: 'One last thing',
    message: 'Every year with you is my favourite year. Here\'s to this one, and all the ones after it.',
    question: 'Will you be mine, forever?',
    yes: 'Yes',
    no: 'No',
    // Shown after she taps Yes.
    afterYes: 'I knew it. Happy birthday, my love. ❤️',
    // Countdown to the next time you see each other. Leave empty ('') to hide.
    nextMeet: '2026-10-05T18:00:00',
    nextMeetLabel: 'Until I see you',
  },

  // ---------- Audio ----------
  // Put files in /public/audio. Leave a value empty ('') to disable it.
  audio: {
    background: 'audio/piano.mp3',   // soft loop for the letter and timeline
    celebrate: 'audio/song.mp3',     // her song, plays after candles go out
  },

  // ---------- Sharing ----------
  // Shown in WhatsApp / iMessage link previews.
  share: {
    title: 'For Priya 💌',
    description: 'Open me on your birthday.',
    image: 'photos/1.svg',
  },
};
