import Map from "./Map.js";

const size = 48;
const speed = 3;
const fps = 1000 / 60;

const canvas = document.getElementById("js-canvas");
const textDiv = document.querySelector(".js-final-text-thumb");
const text = document.querySelector(".js-final-text");
const startButton = document.getElementById("start-button");
const exitButton = document.getElementById("exit-button");
const restartButton = document.getElementById("restart-button");
const menuButton = document.getElementById("menu-button");
const menu = document.getElementById("menu");
const ctx = canvas.getContext("2d");
const map = new Map(size);
const pacman = map.getPacman(speed);
const enemies = map.getEnemies(speed);

let gameOver = false;
let gameWin = false;
let gameRunning = false;
let mainLoop;

let paused = false;

document.addEventListener("keydown", (e) => {
  if (e.key === "p" || e.key === "P") {
    paused = !paused;
    if (paused) {
      showPauseScreen();
    } else {
      hidePauseScreen();
    }
  }
});

startButton.addEventListener("click", () => {
  menu.classList.add("hidden");
  canvas.classList.remove("hidden");
  startGame();
});

exitButton.addEventListener("click", () => {
  window.close();
});

restartButton.addEventListener("click", () => {
  resetGame();
  startGame();
});

menuButton.addEventListener("click", () => {
  resetGame();
  textDiv.classList.add("hidden");
  canvas.classList.add("hidden");
  menu.classList.remove("hidden");
});

function startGame() {
  gameRunning = true;
  map.setCanvasSize(canvas);
  mainLoop = setInterval(gameLoop, fps);
}

function resetGame() {
  clearInterval(mainLoop);
  gameOver = false;
  gameWin = false;
  textDiv.classList.add("hidden");

  map.resetMap();

  pacman.reset();
  enemies.length = 0;
  enemies.push(...map.getEnemies(speed));
}

function showPauseScreen() {
  const pauseOverlay = document.createElement("div");
  pauseOverlay.id = "pause-overlay";

  const pauseText = document.createElement("div");
  pauseText.className = "pause-text";
  pauseText.innerText = "Paused";

  const continueText = document.createElement("div");
  continueText.className = "continue-text";
  continueText.innerText = "To continue, press 'P'";

  const continueButton = document.createElement("button");
  continueButton.className = "continue-button";
  continueButton.innerText = "Continue";
  continueButton.addEventListener("click", () => {
    paused = false;
    hidePauseScreen();
  });

  pauseOverlay.appendChild(pauseText);
  pauseOverlay.appendChild(continueText);
  pauseOverlay.appendChild(continueButton);

  document.body.appendChild(pauseOverlay);
}

function hidePauseScreen() {
  const pauseOverlay = document.getElementById("pause-overlay");
  if (pauseOverlay) {
    pauseOverlay.remove();
  }
}

function gameLoop() {
  if (paused) return;

  map.draw(ctx);
  drawGameEnd();
  pacman.draw(ctx, enemies, pause());
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function pause() {
  return !pacman.firstMove || gameOver || gameWin;
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = enemies.some(
      (enemy) => !pacman.powerDotActive && enemy.isCollision(pacman)
    );
  }
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = map.win();
  }
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    text.innerText = gameWin ? "You Win!" : "Game Over";
    textDiv.classList.remove("hidden");
    clearInterval(mainLoop);
  }
}
