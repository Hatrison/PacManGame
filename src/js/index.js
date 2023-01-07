import Map from "./Map.js";

const size = 32;

const canvas = document.getElementById("js-canvas");
const ctx = canvas.getContext("2d");
const map = new Map(size);

function gameLoop() {
  map.draw(ctx);
}

map.setCanvasSize(canvas);
const mainLoop = setInterval(gameLoop, 1000 / 60);
