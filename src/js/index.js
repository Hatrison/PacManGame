import Map from "./Map.js";

const size = 64;
const speed = 4;

const canvas = document.getElementById("js-canvas");
const ctx = canvas.getContext("2d");
const map = new Map(size);
const pacman = map.getPacman(speed);
const enemies = map.getEnemies(speed);

function gameLoop() {
  map.draw(ctx);
  pacman.draw(ctx);
  enemies.forEach((enemy) => enemy.draw(ctx, pause()));
}

function pause() {
  return !pacman.firstMove;
}

map.setCanvasSize(canvas);
const mainLoop = setInterval(gameLoop, 1000 / 60);
