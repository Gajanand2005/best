/* =========================================================
   How Well Do You Know Me? ❤️  —  script.js
   Pure Vanilla JavaScript. No libraries. Nothing is stored or
   sent anywhere: all state lives in memory and disappears when
   the tab is closed.

   >>> EDIT THE "CONFIG" AND "QUESTIONS" SECTIONS BELOW <<<
   ========================================================= */

'use strict';

/* =========================================================
   1. CONFIG — your name, letter text and result messages
   ========================================================= */
const CONFIG = {
  ownerName: 'Your Name',               // Shown on the certificate + letter. Change me!
  shuffleOptions: true,                 // true = answers appear in random order each play
  musicFile: 'assets/music.mp3',        // Set in index.html (<audio src>). Falls back to a built-in melody.

  // Use {friend} and {owner} placeholders. Each string is one paragraph.
  letter: [
    'Dear {friend},',
    'I made this little quiz because I wanted to see how well you really know me — and also because I wanted an excuse to tell you something important.',
    'Thank you for the late-night talks, the silly jokes, the shared secrets, and for staying by my side on both the good days and the hard ones.',
    'You make my ordinary days brighter, and my bad days a lot easier to get through. I am so grateful to have you.',
    'Always yours, {owner} ❤️',
  ],
  closing: 'Life is better with a friend like you. Thank you for being a special part of my story. ❤️',
};

/* Result messages. First tier whose "min" percentage is reached wins.
   Keep them sorted from highest to lowest. */
const RESULT_TIERS = [
  { min: 90, title: 'Soulmate-level Bestie 👑',  message: 'Wow! You know me better than I know myself. You are truly one of a kind, and I am so lucky to have you!' },
  { min: 70, title: 'Certified Best Friend 💖',  message: 'Amazing! You clearly pay attention to the little things about me. That means the world to me.' },
  { min: 50, title: 'Great Friend 🌸',           message: 'Not bad at all! You know me pretty well, and there is still room for more adventures together.' },
  { min: 30, title: 'Friend in Progress ✨',     message: 'You know a few of my secrets! Let\'s hang out more so you can ace it next time.' },
  { min: 0,  title: 'New Friend Unlocked 🌱',    message: 'Haha, we definitely need more time together! Try again — I promise to give you hints. 😄' },
];

/* Little messages shown after each answer */
const CORRECT_MESSAGES = [
  'Yesss! You know me so well! 🎉', 'Perfect! I\'m impressed! 💖', 'Spot on, bestie! ✨',
  'You really get me! 🥹', 'Correct! Friendship goals! 🌟', 'Nailed it! 💜',
];
const WRONG_MESSAGES = [
  'Oops! Close, but not quite 💭', 'Aww, so near! Keep going 💪', 'Not this time, but I still love you! 💕',
  'Plot twist! 😄', 'Hehe, I\'ll let that one slide 🌸', 'Don\'t worry, you\'ve got this next! ✨',
];

/* =========================================================
   2. QUESTIONS — customize everything here!
   ---------------------------------------------------------
   Each question:  { q: "text", options: [4 answers], answer: index of the correct one (0-3) }
   Replace the sample answers with the TRUTH about you.
   You can add or remove questions — any number from 1 to 30 works.
   ========================================================= */
const QUESTIONS = [
  { q: 'What is my favourite colour? 🎨',
    options: ['Pastel Pink', 'Ocean Blue', 'Forest Green', 'Jet Black'], answer: 0 },

  { q: 'What is my favourite food? 🍕',
    options: ['Pizza', 'Biryani', 'Pasta', 'Chocolate Cake'], answer: 2 },

  { q: 'What is my biggest dream? 🌠',
    options: ['A AI Devloper', 'Build my own business', 'Become famous', 'Live a peaceful life'], answer: 0 },

  { q: 'What makes me the happiest? 😊',
    options: ['Spending time with loved ones', 'Listening to music', 'Eating good food', 'Sleeping all day'], answer: 0 },

  { q: 'What is my biggest fear? 😨',
    options: ['Losing the people I love', 'Heights', 'Darkness', 'Failing'], answer: 0 },

  { q: 'What is my favourite song? 🎶',
    options: ['Mirza', 'Shape of You', 'Tum Hi Ho', 'Counting Stars'], answer: 0 },

  { q: 'What do I usually do when I am sad? 😔',
    options: ['Listen to music alone', 'Call a friend', 'Sleep it off', 'Eat my feelings'], answer: 0 },

  { q: 'What is my favourite memory with you? 💭',
    options: ['Our first trip together', 'That crazy late-night talk', 'Our first meeting', 'The day we laughed non-stop'], answer: 1 },

  { q: 'What is my biggest weakness? 🥺',
    options: ['I overthink everything', 'I trust too easily', 'I can\'t say no', 'I get angry fast'], answer: 0 },

  { q: 'How would you describe my personality? 🌈',
    options: ['Caring and loyal', 'Wild and unpredictable', 'Quiet and mysterious', 'Bossy but lovable'], answer: 0 },

  { q: 'What is my favourite place in the world? 🏝️',
    options: ['The mountains', 'The beach', 'My own room', 'A busy city'], answer: 1 },

  { q: 'What is my favourite movie genre? 🎬',
    options: ['Romantic comedy', 'Horror', 'Action', 'Sci-fi'], answer: 0 },

  { q: 'Am I a morning person or a night owl? 🌙',
    options: ['Total night owl', 'Early bird', 'Depends on the day', 'I sleep both times'], answer: 0 },

  { q: 'What is my go-to comfort drink? ☕',
    options: ['Chai', 'Coffee', 'Hot chocolate', 'Cold drink'], answer: 0 },

  { q: 'What is my favourite way to spend a weekend? 🛋️',
    options: ['Movies + snacks at home', 'Going out with friends', 'Reading or studying', 'Gaming'], answer: 0 },

  { q: 'What do I value most in a friend? 🤝',
    options: ['Honesty', 'Humour', 'Loyalty', 'Money'], answer: 2 },
];

/* =========================================================
   3. DOM HELPERS
   ========================================================= */
const $ = (id) => document.getElementById(id);

const els = {
  screens: document.querySelectorAll('.screen'),
  startForm: $('startForm'), nameInput: $('friendName'), nameError: $('nameError'),
  quizCard: $('quizCard'), qCounter: $('qCounter'), scorePill: $('scorePill'),
  progress: document.querySelector('.progress'), progressBar: $('progressBar'),
  question: $('questionText'), options: $('options'), feedback: $('feedback'), nextBtn: $('nextBtn'),
  ringFill: $('ringFill'), percentText: $('percentText'), resultTitle: $('resultTitle'),
  scoreText: $('scoreText'), resultMessage: $('resultMessage'),
  certName: $('certName'), certText: $('certText'), certDate: $('certDate'), certOwner: $('certOwner'),
  playAgainBtn: $('playAgainBtn'), printBtn: $('printBtn'), surpriseBtn: $('surpriseBtn'),
  envelope: $('envelope'), envelopeStage: $('envelopeStage'), tapHint: $('tapHint'),
  letterCard: $('letterCard'), letterGreeting: $('letterGreeting'), letterBody: $('letterBody'),
  closingMsg: $('closingMsg'), backResultBtn: $('backResultBtn'), restartBtn: $('restartBtn'),
  musicBtn: $('musicBtn'), bgm: $('bgm'), floaters: $('floaters'), confetti: $('confetti'),
};

/* Quiz state (kept only in memory) */
const state = {
  friend: 'Friend',
  index: 0,
  score: 0,
  answered: false,
  deck: [],            // questions with (optionally) shuffled options
};

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Fisher–Yates shuffle (returns a new array) */
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Replace {friend} / {owner} placeholders */
const fill = (text) => text.replace(/\{friend\}/g, state.friend).replace(/\{owner\}/g, CONFIG.ownerName);

/* =========================================================
   4. SCREEN NAVIGATION
   ========================================================= */
function showScreen(id) {
  els.screens.forEach((s) => s.classList.toggle('active', s.id === id));
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
}

/* =========================================================
   5. AUDIO — sound effects + music (Web Audio, no files needed)
   ========================================================= */
const audio = {
  ctx: null,
  muted: false,
  musicStarted: false,
  mode: null,          // 'file' | 'synth'
  synthTimer: null,
  musicGain: null,
  step: 0,
};

/** Lazily create AudioContext (must happen after a user gesture) */
function getCtx() {
  if (!audio.ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audio.ctx = new AC();
  }
  if (audio.ctx.state === 'suspended') audio.ctx.resume();
  return audio.ctx;
}

/** Play one soft note */
function tone(freq, when, dur, { type = 'sine', vol = 0.15, dest } = {}) {
  const ctx = getCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const t = ctx.currentTime + when;
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  gain.gain.setValueAtTime(0.0001, t);
  gain.gain.exponentialRampToValueAtTime(vol, t + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(gain).connect(dest || ctx.destination);
  osc.start(t);
  osc.stop(t + dur + 0.05);
}

const sfx = {
  correct() { if (audio.muted) return; [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.09, 0.35, { vol: 0.14 })); },
  wrong()   { if (audio.muted) return; tone(246.9, 0, 0.28, { type: 'triangle', vol: 0.16 }); tone(185, 0.16, 0.4, { type: 'triangle', vol: 0.16 }); },
  click()   { if (audio.muted) return; tone(880, 0, 0.1, { vol: 0.08 }); },
  win()     { if (audio.muted) return; [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5].forEach((f, i) => tone(f, i * 0.13, 0.5, { vol: 0.13 })); },
  open()    { if (audio.muted) return; [392, 523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.12, 0.6, { vol: 0.1 })); },
};

/* ---- Built-in lullaby (used when assets/music.mp3 is missing) ---- */
const CHORDS = [            // Am – F – C – G, each as three notes
  [220.0, 261.63, 329.63],
  [174.61, 220.0, 261.63],
  [261.63, 329.63, 392.0],
  [196.0, 246.94, 293.66],
];
function synthStep() {
  const ctx = getCtx();
  if (!ctx || audio.muted) return;
  const bar = Math.floor(audio.step / 8) % CHORDS.length;
  const chord = CHORDS[bar];
  const beat = audio.step % 8;
  if (beat === 0) chord.forEach((f) => tone(f / 2, 0, 3.6, { type: 'sine', vol: 0.05, dest: audio.musicGain }));
  const arp = [0, 1, 2, 1, 2, 1, 0, 1][beat];
  tone(chord[arp] * 2, 0, 0.9, { type: 'triangle', vol: 0.06, dest: audio.musicGain });
  audio.step++;
}
function startSynth() {
  const ctx = getCtx();
  if (!ctx) return;
  audio.mode = 'synth';
  audio.musicGain = ctx.createGain();
  audio.musicGain.gain.value = 1;
  audio.musicGain.connect(ctx.destination);
  synthStep();
  audio.synthTimer = setInterval(synthStep, 480);
}

/** Start background music. Called only from a user click. */
function startMusic() {
  if (audio.musicStarted) return;
  audio.musicStarted = true;
  getCtx();
  els.bgm.volume = 0.35;
  const p = els.bgm.play();
  if (p && typeof p.then === 'function') {
    p.then(() => { audio.mode = 'file'; updateMusicBtn(); })
     .catch(() => { startSynth(); updateMusicBtn(); });   // file missing/blocked → built-in melody
  } else {
    startSynth();
  }
  updateMusicBtn();
}

function toggleMute() {
  audio.muted = !audio.muted;
  els.bgm.muted = audio.muted;
  if (audio.musicGain) audio.musicGain.gain.value = audio.muted ? 0 : 1;
  if (!audio.musicStarted && !audio.muted) startMusic();   // first click on the button starts music
  updateMusicBtn();
}

function updateMusicBtn() {
  const playing = audio.musicStarted && !audio.muted;
  els.musicBtn.classList.toggle('muted', audio.muted);
  els.musicBtn.classList.toggle('playing', playing);
  els.musicBtn.setAttribute('aria-pressed', String(audio.muted));
  els.musicBtn.setAttribute('aria-label', audio.muted ? 'Turn sound on' : 'Turn sound off');
}

/* =========================================================
   6. FLOATING HEARTS / STARS
   ========================================================= */
const FLOATERS = ['💖', '💜', '💗', '✨', '⭐', '🌸', '💫', '🤍'];
function spawnFloater() {
  if (document.hidden) return;
  const f = document.createElement('span');
  f.className = 'floater';
  f.textContent = pick(FLOATERS);
  f.style.left = Math.random() * 100 + 'vw';
  f.style.fontSize = 14 + Math.random() * 26 + 'px';
  f.style.setProperty('--sway', (Math.random() * 120 - 60) + 'px');
  f.style.setProperty('--rot', (Math.random() * 60 - 30) + 'deg');
  const dur = 9 + Math.random() * 9;
  f.style.animationDuration = dur + 's';
  els.floaters.appendChild(f);
  f.addEventListener('animationend', () => f.remove());
}
function initFloaters() {
  if (reduceMotion) return;
  for (let i = 0; i < 8; i++) setTimeout(spawnFloater, i * 350);   // initial burst
  setInterval(spawnFloater, 900);
}

/* =========================================================
   7. CONFETTI (canvas)
   ========================================================= */
const confetti = {
  ctx: els.confetti.getContext('2d'),
  parts: [],
  raf: null,
  colors: ['#ff8fb8', '#ffc2dc', '#b58cff', '#9d7bff', '#cfc0ff', '#ffe08a', '#8fd9ff'],
};
function resizeConfetti() {
  const dpr = window.devicePixelRatio || 1;
  els.confetti.width = window.innerWidth * dpr;
  els.confetti.height = window.innerHeight * dpr;
  confetti.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}
function burstConfetti(count = 160) {
  if (reduceMotion) return;
  const w = window.innerWidth;
  for (let i = 0; i < count; i++) {
    const fromLeft = i % 2 === 0;
    confetti.parts.push({
      x: fromLeft ? -10 : w + 10,
      y: window.innerHeight * (0.45 + Math.random() * 0.2),
      vx: (fromLeft ? 1 : -1) * (4 + Math.random() * 9),
      vy: -(8 + Math.random() * 11),
      g: 0.28 + Math.random() * 0.12,
      size: 6 + Math.random() * 8,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.4,
      color: pick(confetti.colors),
      heart: Math.random() < 0.3,
      life: 0,
    });
  }
  if (!confetti.raf) confetti.raf = requestAnimationFrame(tickConfetti);
}
function drawHeart(c, s) {
  c.beginPath();
  c.moveTo(0, s * 0.35);
  c.bezierCurveTo(-s, -s * 0.3, -s * 0.4, -s * 0.9, 0, -s * 0.35);
  c.bezierCurveTo(s * 0.4, -s * 0.9, s, -s * 0.3, 0, s * 0.35);
  c.fill();
}
function tickConfetti() {
  const c = confetti.ctx;
  c.clearRect(0, 0, window.innerWidth, window.innerHeight);
  confetti.parts = confetti.parts.filter((p) => p.y < window.innerHeight + 40 && p.life < 400);
  for (const p of confetti.parts) {
    p.vy += p.g; p.vx *= 0.99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life++;
    c.save();
    c.translate(p.x, p.y);
    c.rotate(p.rot);
    c.fillStyle = p.color;
    if (p.heart) drawHeart(c, p.size); else c.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
    c.restore();
  }
  confetti.raf = confetti.parts.length ? requestAnimationFrame(tickConfetti) : null;
}

/* =========================================================
   8. QUIZ LOGIC
   ========================================================= */
/** Build the working deck (optionally shuffling answer order) */
function buildDeck() {
  state.deck = QUESTIONS.map((item) => {
    const opts = item.options.map((text, i) => ({ text, correct: i === item.answer }));
    return { q: item.q, options: CONFIG.shuffleOptions ? shuffle(opts) : opts };
  });
}

function startQuiz() {
  state.index = 0;
  state.score = 0;
  buildDeck();
  showScreen('quiz');
  renderQuestion();
}

function renderQuestion() {
  const item = state.deck[state.index];
  const total = state.deck.length;
  state.answered = false;

  els.qCounter.textContent = `Question ${state.index + 1} / ${total}`;
  els.scorePill.textContent = `Score: ${state.score}`;
  const pct = (state.index / total) * 100;
  els.progressBar.style.width = pct + '%';
  els.progress.setAttribute('aria-valuenow', String(Math.round(pct)));

  els.question.textContent = item.q;
  els.feedback.textContent = '';
  els.feedback.className = 'feedback';
  els.nextBtn.hidden = true;
  els.options.innerHTML = '';

  item.options.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'option';
    btn.style.setProperty('--i', i);
    btn.dataset.correct = String(opt.correct);
    const letter = document.createElement('span');
    letter.className = 'letter';
    letter.setAttribute('aria-hidden', 'true');
    letter.textContent = 'ABCD'[i];
    const label = document.createElement('span');
    label.textContent = opt.text;
    btn.append(letter, label);
    btn.addEventListener('click', () => selectAnswer(btn));
    els.options.appendChild(btn);
  });
}

function selectAnswer(chosen) {
  if (state.answered) return;            // only one answer per question
  state.answered = true;

  const isCorrect = chosen.dataset.correct === 'true';
  const buttons = [...els.options.children];

  buttons.forEach((b) => {
    b.disabled = true;
    if (b.dataset.correct === 'true') b.classList.add('correct');
    else if (b === chosen) b.classList.add('wrong');
    else b.classList.add('dim');
  });

  if (isCorrect) {
    state.score++;
    sfx.correct();
    burstConfetti(25);
  } else {
    sfx.wrong();
  }

  els.scorePill.textContent = `Score: ${state.score}`;
  els.feedback.textContent = pick(isCorrect ? CORRECT_MESSAGES : WRONG_MESSAGES);
  els.feedback.className = 'feedback pop ' + (isCorrect ? 'good' : 'bad');

  const last = state.index === state.deck.length - 1;
  els.nextBtn.innerHTML = last ? 'See My Results <span aria-hidden="true">🎉</span>' : 'Next <span aria-hidden="true">→</span>';
  els.nextBtn.hidden = false;
  els.nextBtn.focus({ preventScroll: true });
}

async function nextQuestion() {
  sfx.click();
  const total = state.deck.length;
  if (state.index >= total - 1) {
    els.progressBar.style.width = '100%';
    els.progress.setAttribute('aria-valuenow', '100');
    await wait(350);
    showResult();
    return;
  }
  // Smooth slide-out → render → slide-in
  els.quizCard.classList.add('leaving');
  await wait(reduceMotion ? 0 : 320);
  state.index++;
  renderQuestion();
  els.quizCard.classList.remove('leaving');
  els.quizCard.classList.add('entering');
  els.question.focus({ preventScroll: true });
  setTimeout(() => els.quizCard.classList.remove('entering'), 500);
}

/* =========================================================
   9. RESULT SCREEN
   ========================================================= */
function showResult() {
  const total = state.deck.length;
  const percent = Math.round((state.score / total) * 100);
  const tier = RESULT_TIERS.find((t) => percent >= t.min) || RESULT_TIERS[RESULT_TIERS.length - 1];

  els.resultTitle.textContent = tier.title;
  els.scoreText.textContent = `${state.friend}, you scored ${state.score} out of ${total}`;
  els.resultMessage.textContent = tier.message;

  // Certificate
  els.certName.textContent = state.friend;
  els.certText.textContent = `for scoring ${state.score}/${total} (${percent}%) on "How Well Do You Know Me?" and being an amazing friend.`;
  els.certDate.textContent = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
  els.certOwner.textContent = CONFIG.ownerName;

  showScreen('result');

  // Animate the ring + counter
  const C = 2 * Math.PI * 54;
  els.ringFill.style.strokeDasharray = C;
  els.ringFill.style.strokeDashoffset = C;
  els.percentText.textContent = '0%';
  requestAnimationFrame(() => requestAnimationFrame(() => {
    els.ringFill.style.strokeDashoffset = C * (1 - percent / 100);
  }));
  countUp(percent);

  // Celebration (a bit bigger for better scores)
  sfx.win();
  burstConfetti(percent >= 50 ? 220 : 90);
  if (percent >= 70) setTimeout(() => burstConfetti(160), 700);
}

function countUp(target) {
  if (reduceMotion || target === 0) { els.percentText.textContent = target + '%'; return; }
  const start = performance.now();
  const dur = 1600;
  (function step(now) {
    const t = Math.min((now - start) / dur, 1);
    els.percentText.textContent = Math.round(target * (1 - Math.pow(1 - t, 3))) + '%';
    if (t < 1) requestAnimationFrame(step);
  })(start);
}

/* =========================================================
   10. SURPRISE: ENVELOPE + LETTER
   ========================================================= */
function openSurpriseScreen() {
  sfx.click();
  // Reset envelope state each time
  els.envelope.classList.remove('open');
  els.envelope.disabled = false;
  els.envelopeStage.hidden = false;
  els.envelopeStage.classList.remove('gone');
  els.tapHint.hidden = false;
  els.letterCard.hidden = true;
  showScreen('surprise');
  els.envelope.focus({ preventScroll: true });
}

async function openEnvelope() {
  if (els.envelope.classList.contains('open')) return;
  els.envelope.classList.add('open');
  els.envelope.disabled = true;
  els.tapHint.hidden = true;
  sfx.open();
  burstConfetti(60);

  await wait(reduceMotion ? 0 : 1900);
  els.envelopeStage.classList.add('gone');
  await wait(reduceMotion ? 0 : 500);
  els.envelopeStage.hidden = true;
  revealLetter();
}

function revealLetter() {
  const paras = CONFIG.letter.map(fill);
  els.letterGreeting.textContent = paras[0];
  els.letterBody.innerHTML = '';

  const body = paras.slice(1);
  body.forEach((text, i) => {
    const p = document.createElement('p');
    p.textContent = text;
    if (i === body.length - 1) p.classList.add('sign');   // last line = sign-off
    p.style.animationDelay = (0.8 + i * 0.9) + 's';
    els.letterBody.appendChild(p);
  });

  const closingDelay = 0.8 + body.length * 0.9 + 0.3;
  els.letterCard.style.setProperty('--closing-delay', closingDelay + 's');
  els.closingMsg.textContent = CONFIG.closing;

  // Re-trigger CSS animations on repeat plays
  els.letterCard.hidden = false;
  els.letterCard.style.animation = 'none';
  void els.letterCard.offsetWidth;
  els.letterCard.style.animation = '';

  els.letterCard.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
  setTimeout(() => burstConfetti(120), closingDelay * 1000);
}

/* =========================================================
   11. RESTART (no page reload)
   ========================================================= */
function restart() {
  sfx.click();
  state.index = 0;
  state.score = 0;
  els.letterCard.hidden = true;
  showScreen('welcome');
  els.nameInput.focus({ preventScroll: true });
}

/* =========================================================
   12. EVENT WIRING
   ========================================================= */
function init() {
  resizeConfetti();
  window.addEventListener('resize', resizeConfetti);
  initFloaters();

  // Welcome form
  els.startForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = els.nameInput.value.trim();
    if (!name) {
      els.nameError.hidden = false;
      els.nameInput.setAttribute('aria-invalid', 'true');
      els.nameInput.focus();
      return;
    }
    els.nameError.hidden = true;
    els.nameInput.removeAttribute('aria-invalid');
    state.friend = name;
    startMusic();           // allowed: this runs inside a user gesture
    sfx.click();
    startQuiz();
  });
  els.nameInput.addEventListener('input', () => { els.nameError.hidden = true; });

  els.nextBtn.addEventListener('click', nextQuestion);
  els.playAgainBtn.addEventListener('click', restart);
  els.restartBtn.addEventListener('click', restart);
  els.printBtn.addEventListener('click', () => window.print());
  els.surpriseBtn.addEventListener('click', openSurpriseScreen);
  els.envelope.addEventListener('click', openEnvelope);
  els.backResultBtn.addEventListener('click', () => { sfx.click(); showScreen('result'); });
  els.musicBtn.addEventListener('click', toggleMute);

  // Keyboard shortcuts during the quiz: 1–4 / A–D choose, Enter/Space → next handled by focus
  document.addEventListener('keydown', (e) => {
    if (!$('quiz').classList.contains('active') || state.answered) return;
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    const map = { '1': 0, '2': 1, '3': 2, '4': 3, a: 0, b: 1, c: 2, d: 3 };
    const idx = map[e.key.toLowerCase()];
    const btn = els.options.children[idx];
    if (idx !== undefined && btn) selectAnswer(btn);
  });
}

document.addEventListener('DOMContentLoaded', init);
