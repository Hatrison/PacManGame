import Map from "./Map.js";

const size = 48;
const speed = 3;

const canvas = document.getElementById("js-canvas");
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
    let text = " You Win!";
    if (gameOver) {
      text = "Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 160);

    ctx.font = "160px comic sans";
    ctx.fillStyle = "white";
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

map.setCanvasSize(canvas);
const mainLoop = setInterval(gameLoop, 1000 / 60);
