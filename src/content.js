// ============================================================
//  EDIT THIS FILE ONLY. Everything on the site comes from here.
// ============================================================

export const content = {
  // Her name, exactly how you call her.
  name: 'Kanishka',
  // Her birthday. Used for the page title and the countdown.
  birthday: '2026-10-05',

  // ---------- Lock screen ----------
  lock: {
    question: 'Enter the date we first met',
    hint: 'Think of the day at the coffee shop… (DD-MM-YYYY)',
    // Accepted answers. Any of these unlocks the site. Keep them lowercase.
    answers: ['16-05-2026', '16/05/2026', '16052026'],
    wrongMessages: [
      'Nope. You know this one 😌',
      'Try again, my love.',
      'Hint: it was raining that day.',
    ],
  },

  // ---------- Intro ----------
  intro: {
    lines: ['Happy Birthday', 'Kanishka'],
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
      { date: '16 May 2026', title: 'The day we met', caption: 'You spilled coffee on my notes and apologised for five minutes straight.', photo: 'photos/1.svg' },
      { date: '02 Jun 2026', title: 'First date', caption: 'We talked so long the restaurant had to ask us to leave.', photo: 'photos/2.svg' },
      { date: '19 Jun 2026', title: 'First trip together', caption: 'You got us lost on purpose. I still think it was on purpose.', photo: 'photos/3.svg' },
      { date: '14 Jul 2026', title: 'The rainy evening', caption: 'One umbrella. Both of us soaked anyway.', photo: 'photos/4.svg' },
      { date: '30 Aug 2026', title: 'That late-night call', caption: 'Four hours. Neither of us wanted to hang up first.', photo: 'photos/5.svg' },
      { date: 'Today', title: 'And now this', caption: 'Another year of you. Lucky me.', photo: 'photos/6.svg' },
    ],
  },

  // ---------- Photos of her ----------
  you: {
    title: 'Through my eyes',
    subtitle: 'My favourite photos of you.',
    photos: [
      { caption: 'A messy photo of you..', photo: 'photos/7.svg' },
      { caption: 'You, just existing.', photo: 'photos/8.svg' },
      { caption: 'The photo of you that melts my heart.', photo: 'photos/9.svg' },
    ],
    message: 'I could fill a hundred of these.',
  },

  // ---------- Flower garden ----------
  garden: {
    title: 'Tap the ground',
    subtitle: 'Something grows wherever you touch.',
    target: 10,
    message: 'You make everything grow.',
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

  // ---------- Bouquet ----------
  bouquet: {
    title: 'Build me a bouquet',
    subtitle: 'Drag the flowers into the wrap, or just tap them.',
    cardMessage: 'Real ones arrive on your birthday. This one never wilts.',
  },

  // ---------- Cake ----------
  cake: {
    title: 'Make a wish',
    instruction: 'Blow into your phone to blow out the candles 🎂',
    fallback: 'Or tap the candles',
    candles: 5,
    afterMessage: 'Did you make a wish? Don\'t tell me. Let it come true.',
  },

  // ---------- Balloons ----------
  balloons: {
    title: 'Pop them',
    subtitle: 'Every balloon is carrying a little note for you.',
    notes: [
      'You are the best part of my every day.',
      'I still get nervous before I see you. In a good way.',
      'Nobody has ever made me laugh like you do.',
      'I saved your first message. I read it more than I should.',
      'You are braver than you think. I see it every day.',
      'I would choose you in every version of this life.',
    ],
    doneMessage: 'That was all of them. For now.',
  },

  // ---------- Game ----------
  game: {
    title: 'Catch our memories',
    instruction: 'Tap the falling polaroids before they hit the ground. Catch 10 to unlock what\'s next.',
    target: 10,
    // Uses the timeline photos automatically.
  },

  // ---------- Night sky ----------
  sky: {
    title: 'Look up',
    subtitle: 'Every bright star is a day I remember. Tap them all.',
    message: 'Even the sky knows.',
    // Uses the timeline events as the stars.
  },

  // ---------- Scratch card ----------
  scratch: {
    title: 'Scratch here',
    hint: 'Rub it with your finger.',
    revealTitle: 'Surprise 🎟️',
    revealText: 'We are going away for the weekend. Pack a bag. Don\'t ask where.',
    photo: 'photos/3.svg',
  },

  // ---------- Polaroid wall ----------
  wall: {
    title: 'Our wall',
    subtitle: 'Drag them around. They\'re all yours.',
  },

  // ---------- Fireworks ----------
  fireworks: {
    title: 'Light up the city',
    subtitle: 'Tap the sky. Keep tapping.',
    finaleMessage: 'Every night sky should have your name on it.',
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
    // Video that plays after she says yes. Put a file in /public/video (e.g. 'video/message.mp4')
    // or paste a YouTube embed link (https://www.youtube.com/embed/VIDEO_ID). Leave '' to skip.
    video: '',
    videoCaption: 'I recorded this for you.',
    // Countdown to the next time you see each other. Leave empty ('') to hide.
    nextMeet: '2026-10-05T18:00:00',
    nextMeetLabel: 'Until I see you',
  },

  // ---------- Wish jar ----------
  wishjar: {
    title: 'The wish jar',
    subtitle: 'Write a wish. It stays in this jar until next year.',
    placeholder: 'I wish…',
    button: 'Drop it in',
    saved: 'Saved. Come back next birthday and read it again.',
    shake: 'Tap the jar to read one back.',
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
    title: 'For Kanishka 💌',
    description: 'Open me on your birthday.',
    image: 'photos/1.svg',
  },
};
