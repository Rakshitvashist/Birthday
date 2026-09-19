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
    // The photo her face is painted with in the particle intro. A clear, front-facing portrait works best.
    photo: 'media/photos/p15.jpg',
    // Which part of that photo to use, as fractions (left, top, width, height). Frame her face tightly.
    photoCrop: { x: 0.3, y: 0.02, w: 0.5, h: 0.96 },
  },

  // ---------- The letter ----------
  letter: {
    title: 'For Kanishka ❤️',
    // Each paragraph types out one after another.
    paragraphs: [
      "I don't really know where to start, because there are so many things I could write about you, but somehow my mind keeps going back to **16 May 2026**.",
      "My college farewell.",
      "The day I met you for the first time.",
      "I still remember you in that **light purple top**, the **Rajiv Chowk metro station**, and then sitting together while you ordered your **Citrus Iced Tea**. We didn't know each other then, but we sat there, talked about random things, laughed, and somehow that ordinary day became the beginning of something that I never expected.",
      "Then we met again, did a little shopping, had your **Sleepy Owl coffee**, and somewhere around those little moments, I started getting attracted towards you. Not because of one particular thing, but because of the way being around you started feeling different.",
      "And then came **27 June, my birthday**.",
      "I still remember you waiting for me at McDonald's with a **red rose bouquet and chocolates**. Maybe it sounds like a small thing, but for me it wasn't. That day, I felt that someone was actually making an effort for me too. Someone was thinking about me, planning something for me, and doing something just to make me happy.",
      "I remember that **tight hug** I gave you for the first time.",
      "I don't think you realise how special that moment was for me.",
      "After that, the days just kept passing. We started talking more, meeting more, getting more attached. Our first movie, our random plans, all those little dates, the coffees, the walks, the stupid conversations, the laughs, the small fights, making up again. Everything slowly became a part of my life.",
      "And somewhere along the way, you became one of the most important people in it.",
      "When I look back now, I realise that my favourite memories aren't necessarily the big things. It's those random little moments with you that I remember the most. The way we used to talk about absolutely anything, the way a normal day could become special just because I was with you, and the feeling of having someone I genuinely wanted to share things with.",
      "I know things haven't been perfect.",
      "Somewhere along the way, things got complicated. We had a lot of fights, misunderstandings and moments where we both ended up hurting each other. I know I have hurt you too, more than once, and there are things I wish I had handled differently. I can't change those moments now, but I can at least acknowledge them.",
      "I don't know what the future looks like for us. I genuinely don't.",
      "Maybe things will become better, maybe life will take us in different directions, maybe we'll find our way back to each other in a better version of ourselves. I don't want to make promises about something neither of us can know right now.",
      "But one thing I know for sure is that **you will always be a very special part of my life**.",
      "You were a beautiful chapter of my life. One that gave me some of my happiest memories, made me feel things I hadn't felt in a long time, and taught me a lot about love, effort, attachment, mistakes and understanding.",
      "So on your birthday, I don't want to talk about the fights or the things that went wrong.",
      "I just want you to know that I remember the girl in that light purple top at my college farewell.",
      "I remember the Citrus Iced Tea at Rajiv Chowk.",
      "I remember the Sleepy Owl coffee.",
      "I remember the red roses and chocolates at McDonald's.",
      "I remember our first hug, our first movie, our random dates and all those little moments that slowly became **our memories**.",
      "And no matter what happens from here, I will always be grateful that I got to experience all of that with you.",
      "**Happy Birthday, Kanishka. ❤️**",
      "I hope this year is kinder to you. I hope you find peace, happiness, and all the things you've been looking for. I hope you keep smiling the way you used to, keep exploring, keep travelling, keep becoming the person you want to be.",
      "And somewhere, whenever you look back at 2026, I hope you remember that there was someone who genuinely cared about you, was happy to have met you, and will always be grateful for the memories you gave him.",
      "**Happy Birthday once again.**",
      "**And thank you… for being one of my favourite parts of this chapter of my life. ❤️**",
    ],
    signature: '— Rakshit',
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
