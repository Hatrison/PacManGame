import directions from "./directions.js";

export default class Pacman {
  constructor(x, y, size, speed, map) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.map = map;

    this.currenDirection = null;
    this.requestedDirection = null;

    this.animationTimerDefault = 10;
    this.animationTimer = null;

    this.pacmanClosed = new Image();
    this.pacmanClosed.src = "../../images/pac0.png";

    this.pacmanNormal = new Image();
    this.pacmanNormal.src = "../../images/pac1.png";

    this.pacmanOpened = new Image();
    this.pacmanOpened.src = "../../images/pac2.png";

    this.arrayOfPacmanImages = [
      this.pacmanClosed,
      this.pacmanNormal,
      this.pacmanOpened,
      this.pacmanNormal,
    ];

    this.arrayOfPacmanImagesIndex = 0;

    document.addEventListener("keydown", this.#onKeyDown);
  }

  draw(ctx) {
    this.#move();
    this.#animate();
    ctx.drawImage(
      this.arrayOfPacmanImages[this.arrayOfPacmanImagesIndex],
      this.x,
      this.y,
      this.size,
      this.size
    );
  }

  #onKeyDown = (event) => {
    const code = event.code;
    if (code === "KeyW" || code === "ArrowUp") {
      if (this.currentDirection === directions.down)
        this.currentDirection = directions.up;
      this.requestedDirection = directions.up;
    }
    if (code === "KeyD" || code === "ArrowRight") {
      if (this.currentDirection === directions.left)
        this.currentDirection = directions.right;
      this.requestedDirection = directions.right;
    }
    if (code === "KeyS" || code === "ArrowDown") {
      if (this.currentDirection === directions.up)
        this.currentDirection = directions.down;
      this.requestedDirection = directions.down;
    }
    if (code === "KeyA" || code === "ArrowLeft") {
      if (this.currentDirection === directions.right)
        this.currentDirection = directions.left;
      this.requestedDirection = directions.left;
    }
  };

  #move() {
    if (this.currentDirection !== this.requestedDirection) {
      if (
        Number.isInteger(this.x / this.size) &&
        Number.isInteger(this.y / this.size)
      ) {
        if (!this.map.isCollision(this.x, this.y, this.requestedDirection))
          this.currentDirection = this.requestedDirection;
      }
    }

    if (this.map.isCollision(this.x, this.y, this.currentDirection)) {
      this.animationTimer = null;
      this.arrayOfPacmanImagesIndex = 1;
      return;
    } else if (this.currentDirection !== null && this.animationTimer === null) {
      this.animationTimer = this.animationTimerDefault;
    }

    switch (this.currentDirection) {
      case directions.up:
        this.y -= this.speed;
        break;
      case directions.down:
        this.y += this.speed;
        break;
      case directions.left:
        this.x -= this.speed;
        break;
      case directions.right:
        this.x += this.speed;
        break;
    }
  }

  #animate() {
    if (this.animationTimer === null) {
      return;
    }
    this.animationTimer--;
    if (this.animationTimer === 0) {
      this.animationTimer = this.animationTimerDefault;
      this.arrayOfPacmanImagesIndex++;
      if (this.arrayOfPacmanImagesIndex === this.arrayOfPacmanImages.length)
        this.arrayOfPacmanImagesIndex = 0;
    }
  }
}
