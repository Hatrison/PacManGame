import Pacman from "./Pacman.js";
import Enemy from "./Enemy.js";
import checkInt from "./checkInteger.js";

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

    this.levels = [this.level1, this.level2];
    this.currentLevelIndex = 0;
    this.loadLevel(this.currentLevelIndex);
  }

  // 0 - wall
  // 1 - dots
  // 2 - power dot
  // 3 - pacman
  // 4 - enemy
  // 5 - empty space

  #wall = 0;
  #dot = 1;
  #powerDot = 2;
  #pacman = 3;
  #enemy = 4;
  #emptySpace = 5;

  level1 = [
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

  level2 = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0],
    [0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 1, 4, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
    [0, 1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 2, 1, 0, 1, 1, 0],
    [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  loadLevel(levelIndex) {
    this.currentLevelIndex = levelIndex;
    this.map = JSON.parse(JSON.stringify(this.levels[levelIndex]));
  }

  nextLevel() {
    if (this.currentLevelIndex + 1 < this.levels.length) {
      this.currentLevelIndex++;
      this.loadLevel(this.currentLevelIndex);
      this.updateLevelDisplay();
    } else {
      console.log("You've completed the game!");
    }
  }

  updateLevelDisplay() {
    const levelDisplay = document.getElementById("level-display");
    levelDisplay.innerText = `Level: ${this.currentLevelIndex + 1}`;
  }

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const block = this.map[row][column];
        if (block === this.#wall) this.#drawBlock(ctx, this.wall, column, row);
        else if (block === this.#dot)
          this.#drawBlock(ctx, this.yellowDot, column, row);
        else if (block === this.#powerDot) this.#drawPowerDot(ctx, column, row);
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

  resetMap() {
    this.loadLevel(this.currentLevelIndex);
  }

  getPacman(speed) {
    for (let row = 0; row < this.map.length; row++) {
      const column = this.map[row].indexOf(this.#pacman);
      if (column === -1) continue;
      this.map[row][column] = this.#dot;
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
        if (this.map[row][column] === this.#enemy) {
          this.map[row][column] = this.#dot;
          enemies.push(
            new Enemy(
              column * this.size,
              row * this.size,
              this.size,
              speed,
              this
            )
          );
        }
      }
    }

    return enemies;
  }

  getPacmanStartingPoint() {
    for (let row = 0; row < this.map.length; row++) {
      const column = this.map[row].indexOf(this.#pacman);
      if (column !== -1) {
        return { x: column * this.size, y: row * this.size };
      }
    }
    return { x: 0, y: 0 };
  }

  getRandomStartingPoint() {
    const emptySpaces = [];
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        if (this.map[row][column] === this.#emptySpace) {
          emptySpaces.push({ x: column * this.size, y: row * this.size });
        }
      }
    }
    if (emptySpaces.length === 0) return { x: 0, y: 0 };
    const randomIndex = Math.floor(Math.random() * emptySpaces.length);
    return emptySpaces[randomIndex];
  }

  isCollision(x, y, direction) {
    if (direction === undefined) return;

    const row = y / this.size;
    const column = x / this.size;
    if (!checkInt(column, row)) return;

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

    return this.map[nextRow][nextColumn] === this.#wall;
  }

  eatDot(x, y) {
    const row = y / this.size;
    const column = x / this.size;
    if (!checkInt(column, row)) return;

    if (this.map[row][column] === this.#dot)
      this.map[row][column] = this.#emptySpace;
  }

  eatPowerDot(x, y) {
    const row = y / this.size;
    const column = x / this.size;
    if (!checkInt(column, row)) return;

    if (this.map[row][column] === this.#powerDot) {
      this.map[row][column] = this.#emptySpace;
      return true;
    }
  }

  win() {
    return this.#dotsLeft() === undefined;
  }

  #dotsLeft() {
    return this.map.flat().find((block) => block === this.#dot);
  }
}
