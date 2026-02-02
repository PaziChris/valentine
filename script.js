const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");
const buttons = document.getElementById("buttons");
const question = document.getElementById("question");
const hint = document.getElementById("hint");

let yesScale = 1;
let noMoves = 0;

// Hilfsfunktion: zufällige Position innerhalb der Button-Zone
function moveNoButton() {
  const area = buttons.getBoundingClientRect();
  const btn = noBtn.getBoundingClientRect();

  const padding = 10;
  const maxX = area.width - btn.width - padding;
  const maxY = area.height - btn.height - padding;

  // Zufallsposition, aber im Bereich
  const x = Math.max(padding, Math.random() * maxX);
  const y = Math.max(padding, Math.random() * maxY);

  noBtn.style.left = `${x}px`;
  noBtn.style.top = `${y}px`;
}

function showResult() {
  buttons.style.display = "none";
  hint.style.display = "none";
  question.textContent = "Nirali, willst du mein Valentine sein?";
  result.classList.remove("hidden");
}

// "Nein" weicht aus (Desktop: hover, Mobile: touch)
noBtn.addEventListener("mouseenter", () => {
  noMoves++;
  moveNoButton();
});

noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  noMoves++;
  moveNoButton();
});

// Bonus: mit jedem “Nein”-Versuch wird “Ja” größer
function growYes() {
  yesScale = Math.min(2.2, yesScale + 0.18);
  yesBtn.style.transform = `scale(${yesScale})`;
}

noBtn.addEventListener("mouseenter", growYes);
noBtn.addEventListener("click", growYes);

yesBtn.addEventListener("click", () => {
  showResult();
});

// Startposition für "Nein"
window.addEventListener("load", () => {
  // Absolute Position braucht top/left initial
  noBtn.style.top = "18px";
  noBtn.style.left = "50%";
});
