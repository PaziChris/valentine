const yesBtn = document.getElementById("yesBtn");
const noBtn  = document.getElementById("noBtn");
const buttons = document.getElementById("buttons");
const question = document.getElementById("question");
const hint = document.getElementById("hint");
const result = document.getElementById("result");

let yesStep = 0;         // 0 = normal, 1 = "bist du sicher", 2 = "sicher sicher"
let noJumpsLeft = 6;     // "paarmal" -> Anzahl Sprünge (kannst du anpassen)

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

function showGif() {
  buttons.style.display = "none";
  hint.style.display = "none";
  result.classList.remove("hidden");
}

function resetNoIfDone() {
  if (noJumpsLeft <= 0) {
    // danach bleibt "Nein" stehen, damit es nicht unendlich nervt
    noBtn.style.position = "static";
    noBtn.style.transform = "none";
    buttons.style.gap = "14px";
  }
}

// Nein springt nur ein paar Mal
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

// Ja: Bestätigungs-Flow
yesBtn.addEventListener("click", () => {
  if (yesStep === 0) {
    yesStep = 1;
    question.textContent = "bist du sicher?";
    yesBtn.textContent = "Ja";
    noBtn.textContent = "Nein";
    return;
  }

  if (yesStep === 1) {
    yesStep = 2;
    question.textContent = "sicher sicher?";
    return;
  }

  // yesStep === 2
  showGif();
});

// Startposition für Nein (damit absolute Position sauber ist)
window.addEventListener("load", () => {
  noBtn.style.top = "18px";
  noBtn.style.left = "50%";
});
