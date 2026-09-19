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
    hint: 'Mera farewell. Rajiv Chowk. Light purple top. (DD-MM-YYYY)',
    // Accepted answers. Any of these unlocks the site. Keep them lowercase.
    answers: ['16-05-2026', '16/05/2026', '16052026'],
    wrongMessages: [
      'Nope. You know this one 😌',
      'Try again, my love.',
      'Hint: Citrus Iced Tea, Third Wave.',
    ],
  },

  // ---------- Intro ----------
  intro: {
    lines: ['Happy Birthday', 'Kanishka'],
    subtitle: 'I made this for you.',
    // The photo her face is painted with in the particle intro. A clear, front-facing portrait works best.
    photo: 'media/photos/p15.jpg',
    // Which part of that photo to use, as fractions (left, top, width, height). Frame her face tightly.
    photoCrop: { x: 0.3, y: 0.02, w: 0.5, h: 0.96 },
  },

  // ---------- The letter ----------
  letter: {
    title: 'A letter, from me to you',
    // Each paragraph types out one after another.
    paragraphs: [
      'Happy birthday, Kanishka.',
      '16 May 2026. Mera college farewell tha, aur mujhe laga tha wo din ek ending hai. Rajiv Chowk metro station, light purple top mein tum, aur Third Wave ki wo table jahan tumne Citrus Iced Tea order ki thi. Hum baatein karte rahe, aur mujhe pata bhi nahi chala ki wo din ending nahi thi. Shuruaat thi.',
      'Phir hum dobara mile. Thodi si shopping, tumhari Sleepy Owl coffee, aur pehli baar mujhe laga ki main tumhari taraf kheencha ja raha hoon. Bina koshish kiye. Bas.',
      '27 June. Mera birthday. Tum McDonald\'s mein baithi mera wait kar rahi thi, haath mein red roses aur chocolate. Us din pehli baar laga ki koi mere liye bhi efforts karta hai. Us din maine tumhe pehli baar tight hug kiya tha. Wo hug aaj bhi mere andar kahin rakha hua hai.',
      'Phir din baat karte karte nikalte gaye, aur main har din tumse thoda aur attach hota gaya. Humari pehli movie, wo saari dates, wo chhoti chhoti cheezein. Meri life ke best moments ki list banaun, toh har line mein tum ho.',
      'Sach bhi bolunga. Sab kuch perfect nahi tha. Kuch cheezein bigdi, kaafi ladaiyaan hui, aur maine tumhe kai baar hurt kiya, bina chahe. Uske liye main sorry hoon, dil se. Tum us sab ki haqdaar nahi thi.',
      'Mujhe nahi pata aage cheezein kaisi rahengi. But itna pata hai: tum meri life ka favourite period ho. Aur main chahta hoon ki ye period kabhi khatam na ho.',
      'Toh is birthday pe meri bas ek wish hai. Jaise tum us din Rajiv Chowk pe milne aayi thi, waise hi har din mere saath rehna. Main efforts karunga, har din, jaise tumne 27 June ko kiye the. Happy birthday, meri favourite insaan.',
    ],
    signature: '— Tumhara, Rakshit',
  },

  // ---------- Timeline ----------
  // Put photos in /public/photos and reference them by filename.
  timeline: {
    title: 'Our story so far',
    events: [
      { date: '16 May 2026', title: 'The day we met', caption: 'Mera farewell. Rajiv Chowk. Light purple top. Citrus Iced Tea at Third Wave, aur baatein jo khatam hi nahi hui.', photo: 'media/photos/p10.jpg' },
      { date: 'June 2026', title: 'The shopping day', caption: 'Thodi si shopping, tumhari Sleepy Owl coffee, aur pehli baar main tumhari taraf kheencha gaya.', photo: 'media/photos/p16.jpg' },
      { date: '27 Jun 2026', title: 'My birthday', caption: 'Tum McD mein red roses aur chocolate ke saath wait kar rahi thi. Humara pehla tight hug.', photo: 'media/photos/p07.jpg' },
      { date: 'July 2026', title: 'Our first movie', caption: 'Popcorn se zyada main tumhe dekh raha tha.', photo: 'media/photos/p22.jpg' },
      { date: 'Since then', title: 'Every date after that', caption: 'Har mulaqat ke baad ghar jaake ek hi soch: dobara kab?', photo: 'media/photos/p23.jpg' },
      { date: 'Today', title: 'And now this', caption: 'Another year of you. Lucky me.', photo: 'media/photos/p27.jpg' },
    ],
  },

  // ---------- Photos of her ----------
  you: {
    title: 'Through my eyes',
    subtitle: 'My favourite photos of you.',
    photos: [
      { caption: 'A messy photo of you..', photo: 'media/photos/p08.jpg' },
      { caption: 'You, just existing.', photo: 'media/photos/p25.jpg' },
      { caption: 'The photo of you that melts my heart.', photo: 'media/photos/p14.jpg' },
    ],
    message: 'I could fill a hundred of these.',
  },

  // ---------- Stories (all photos + videos, Instagram style) ----------
  stories: {
    title: 'Our story, the long version',
    subtitle: 'Tap to move forward. Hold to pause.',
    label: 'kanishka & rakshit',
    videoEvery: 3,        // a video after every N photos
    secondsPerPhoto: 4.5,
    endMessage: 'And we are only getting started.',
  },

  // ---------- Photo mosaic ----------
  mosaic: {
    title: 'All of you',
    subtitle: 'Tap any tile.',
    message: '{n} photos. One heart.',
  },

  // ---------- Full gallery ----------
  gallery: {
    title: 'Everything',
    subtitle: '{p} photos, {v} videos, zero regrets.',
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
    photo: 'media/photos/p03.jpg',
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
    image: 'media/photos/p27.jpg',
  },
};
