import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import directions from "./directions.js";

export default class Map {
  constructor(size) {
    this.size = size;

    this.yellowDot = new Image();
    this.yellowDot.src = "images/yellowDot.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "images/pinkDot.png";

    this.wall = new Image();
    this.wall.src = "images/wall.png";

    this.powerDot = this.pinkDot;
    this.powerDotAnimationTimerDefault = 30;
    this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;
  }

  //0 - wall
  //1 - dots
  //2 - power dot
  //3 - pacman
  //4 - enemy
  //5 - empty space

  map = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 3, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 4, 1, 1, 0, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 0, 1, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 2, 1, 0, 1, 1, 0],
    [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const block = this.map[row][column];
        if (block === 0) this.#drawBlock(ctx, this.wall, column, row);
        else if (block === 1) this.#drawBlock(ctx, this.yellowDot, column, row);
        else if (block === 2) this.#drawPowerDot(ctx, column, row);
        else this.#drawEmptySpace(ctx, column, row);
      }
    }
  }

  setCanvasSize(canvas) {
    canvas.width = this.map[0].length * this.size;
    canvas.height = this.map.length * this.size;
  }

  #drawBlock(ctx, image, column, row) {
    ctx.drawImage(
      image,
      column * this.size,
      row * this.size,
      this.size,
      this.size
    );
  }

  #drawPowerDot(ctx, column, row) {
    this.powerDotAnimationTimer--;
    if (this.powerDotAnimationTimer === 0) {
      this.powerDotAnimationTimer = this.powerDotAnimationTimerDefault;

      this.powerDot === this.pinkDot
        ? (this.powerDot = this.yellowDot)
        : (this.powerDot = this.pinkDot);
    }

    ctx.drawImage(
      this.powerDot,
      column * this.size,
      row * this.size,
      this.size,
      this.size
    );
  }

  #drawEmptySpace(ctx, column, row) {
    ctx.fillStyle = "black";
    ctx.fillRect(column * this.size, row * this.size, this.size, this.size);
  }

  getPacman(speed) {
    for (let row = 0; row < this.map.length; row++) {
      const column = this.map[row].indexOf(3);
      if (column === -1) continue;
      this.map[row][column] = 1;
      return new Pacman(
        column * this.size,
        row * this.size,
        this.size,
        speed,
        this
      );
    }
  }

  getEnemies(speed) {
    const enemies = [];

    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        if (this.map[row][column] !== 4) continue;
        this.map[row][column] = 1;
        enemies.push(
          new Enemy(column * this.size, row * this.size, this.size, speed, this)
        );
      }
    }

    return enemies;
  }

  isCollision(x, y, direction) {
    if (direction === undefined) return;
    console.log(direction);

    const row = y / this.size;
    const column = x / this.size;
    if (!(Number.isInteger(row) && Number.isInteger(column))) return;

    let nextColumn = 0;
    let nextRow = 0;
    const nextBlock = {
      up: () => {
        nextRow = row - 1;
        nextColumn = column;
      },
      right: () => {
        nextRow = row;
        nextColumn = column + 1;
      },
      down: () => {
        nextRow = row + 1;
        nextColumn = column;
      },
      left: () => {
        nextRow = row;
        nextColumn = column - 1;
      },
    };
    nextBlock[direction]();

    return this.map[nextRow][nextColumn] === 0;
  }

  eatDot(x, y) {
    const row = y / this.size;
    const column = x / this.size;
    if (!(Number.isInteger(row) && Number.isInteger(column))) return;

    if (this.map[row][column] === 1) this.map[row][column] = 5;
  }

  eatPowerDot(x, y) {
    const row = y / this.size;
    const column = x / this.size;
    if (!(Number.isInteger(row) && Number.isInteger(column))) return;

    if (this.map[row][column] === 2) {
      this.map[row][column] = 5;
      return true;
    }
  }

  win() {
    return this.#dotsLeft() === undefined;
  }

  #dotsLeft() {
    return this.map.flat().find((block) => block === 1);
  }
}
