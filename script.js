const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");
const question = document.getElementById("question");
const hint = document.getElementById("hint");
const result = document.getElementById("result");

let yesStep = 0;
let noJumpsLeft = 6;

// ---------- NO button jumps (few times) ----------
function moveNoButton() {
  const area = buttons.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();
  const padding = 8;

  const maxX = Math.max(padding, area.width - btn.width - padding);
  const maxY = Math.max(padding, area.height - btn.height - padding);

  const x = padding + Math.random() * (maxX - padding);
  const y = padding + Math.random() * (maxY - padding);

  noBtn.style.left = `${x}px`;
  noBtn.style.top  = `${y}px`;
}

function resetNoIfDone() {
  if (noJumpsLeft <= 0) {
    noBtn.style.position = "static";
    noBtn.style.transform = "none";
    buttons.style.gap = "14px";
  }
}

noBtn.addEventListener("mouseenter", () => {
  if (noJumpsLeft > 0) {
    noJumpsLeft--;
    moveNoButton();
    resetNoIfDone();
  }
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (noJumpsLeft > 0) {
    noJumpsLeft--;
    moveNoButton();
    resetNoIfDone();
  }
});

// ---------- Tiny party sound (WebAudio) ----------
function partyPop() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();

    const o1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    o1.type = "triangle";
    o1.frequency.setValueAtTime(880, ctx.currentTime);
    o1.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.12);
    g1.gain.setValueAtTime(0.0001, ctx.currentTime);
    g1.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
    g1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.14);
    o1.connect(g1).connect(ctx.destination);
    o1.start();
    o1.stop(ctx.currentTime + 0.15);

    // Little "sparkle" noise
    const bufferSize = 2 * ctx.sampleRate;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) output[i] = (Math.random() * 2 - 1) * 0.25;

    const noise = ctx.createBufferSource();
    noise.buffer = noiseBuffer;

    const bandpass = ctx.createBiquadFilter();
    bandpass.type = "bandpass";
    bandpass.frequency.value = 1200;

    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.0001, ctx.currentTime);
    g2.gain.exponentialRampToValueAtTime(0.12, ctx.currentTime + 0.01);
    g2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.18);

    noise.connect(bandpass).connect(g2).connect(ctx.destination);
    noise.start();
    noise.stop(ctx.currentTime + 0.18);

    setTimeout(() => ctx.close(), 400);
  } catch (_) {
    // ignore if blocked
  }
}

// ---------- Confetti (no libs) ----------
function confettiBurst(count = 120) {
  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.inset = "0";
  container.style.pointerEvents = "none";
  container.style.overflow = "hidden";
  container.style.zIndex = "9999";
  document.body.appendChild(container);

  const colors = ["#d90429", "#ef233c", "#ffb703", "#ffffff", "#fb5607", "#8338ec"];

  for (let i = 0; i < count; i++) {
    const piece = document.createElement("div");
    const size = 6 + Math.random() * 10;

    piece.style.position = "absolute";
    piece.style.width = `${size}px`;
    piece.style.height = `${size * 0.6}px`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.top = `-20px`;
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.opacity = "0.95";
    piece.style.borderRadius = "3px";
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;

    const fall = 60 + Math.random() * 40; // vh
    const drift = (Math.random() * 2 - 1) * 25; // vw
    const duration = 900 + Math.random() * 900; // ms

    piece.animate(
      [
        { transform: `translate(0, 0) rotate(${Math.random() * 360}deg)` },
        { transform: `translate(${drift}vw, ${fall}vh) rotate(${720 + Math.random() * 720}deg)` }
      ],
      { duration, easing: "cubic-bezier(.2,.8,.2,1)", fill: "forwards" }
    );

    container.appendChild(piece);
  }

  setTimeout(() => container.remove(), 2200);
}

// ---------- UI helpers ----------
function showGif() {
  buttons.style.display = "none";
  hint.style.display = "none";
  result.classList.remove("hidden");
}

function setQuestion(text, className = "") {
  question.textContent = text;
  question.classList.remove("oppa", "yaay");
  if (className) question.classList.add(className);
}

// ---------- YES flow ----------
yesBtn.addEventListener("click", () => {
  if (yesStep === 0) {
    yesStep = 1;
    setQuestion("bist du sicher?");
    return;
  }

  if (yesStep === 1) {
    yesStep = 2;
    setQuestion("opppaaaaaaaa", "oppa");
    return;
  }

  // FINAL
  setQuestion("YAAYYYYYYYYYYYYYYYYYYYYYYYYYYYY", "yaay");
  partyPop();
  confettiBurst(140);
  showGif();
});

// Start position for absolute "No"
window.addEventListener("load", () => {
  noBtn.style.top = "18px";
  noBtn.style.left = "50%";
});
