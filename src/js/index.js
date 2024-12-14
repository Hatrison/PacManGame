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
const levelDisplay = document.getElementById("level-display");
const ctx = canvas.getContext("2d");
const map = new Map(size);
let pacman = map.getPacman(speed);
let enemies = map.getEnemies(speed);

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
  clearInterval(mainLoop);
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
  reinitializeEnemies();
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

function nextLevel() {
  if (map.currentLevelIndex + 1 < map.levels.length) {
    map.nextLevel();
    pacman.reset();
    reinitializeEnemies();
    showLevelModal(map.currentLevelIndex + 1);
  } else {
    gameWin = true;
    map.currentLevelIndex = 0;
    drawGameEnd();
  }
}

function reinitializeEnemies() {
  enemies.length = 0;
  const newEnemies = map.getEnemies(speed);
  newEnemies.forEach((enemy) => enemies.push(enemy));
}

function showLevelModal(level) {
  const levelModal = document.createElement("div");
  levelModal.id = "level-modal";

  const levelText = document.createElement("div");
  levelText.className = "level-text";
  levelText.innerText = `Level ${level}`;

  const continueButton = document.createElement("button");
  continueButton.className = "continue-button";
  continueButton.innerText = "Continue";

  continueButton.addEventListener("click", () => {
    levelModal.remove();
    startGame();
  });

  continueButton.addEventListener("mouseover", () => {
    continueButton.style.backgroundColor = "#0056b3";
  });

  continueButton.addEventListener("mouseout", () => {
    continueButton.style.backgroundColor = "#007bff";
  });

  levelModal.appendChild(levelText);
  levelModal.appendChild(continueButton);

  document.body.appendChild(levelModal);
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
    if (gameOver) {
      drawGameEnd();
    }
  }
}

function checkGameWin() {
  if (!gameWin && map.win()) {
    nextLevel();
  }
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    text.innerText = gameWin
      ? map.currentLevelIndex + 1 >= map.levels.length
        ? "You Win the Game!"
        : "Level Complete!"
      : "Game Over";
    textDiv.classList.remove("hidden");
    clearInterval(mainLoop);
  }
}
