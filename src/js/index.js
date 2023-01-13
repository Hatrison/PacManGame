import Map from "./Map.js";

const size = 48;
const speed = 3;
const fps = 1000 / 60;

const canvas = document.getElementById("js-canvas");
const textDiv = document.querySelector(".js-final-text-thumb");
let text = document.querySelector(".js-final-text");
const ctx = canvas.getContext("2d");
const map = new Map(size);
const pacman = map.getPacman(speed);
const enemies = map.getEnemies(speed);

let gameOver = false;
let gameWin = false;

function gameLoop() {
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
    text.innerText = " You Win!";
    if (gameOver) {
      text.innerText = "Game Over";
    }

    textDiv.classList.remove("hidden");
  }
}

map.setCanvasSize(canvas);
const mainLoop = setInterval(gameLoop, fps);
