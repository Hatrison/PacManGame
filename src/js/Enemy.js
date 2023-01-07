import directions from "./directions.js";

export default class Enemy {
  constructor(x, y, size, speed, map) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.map = map;

    this.direction = this.#newDirection();
    this.directionTimerDefault = this.#random(10, 30);
    this.directionTimer = this.directionTimerDefault;

    this.normalGhost = new Image();
    this.normalGhost.src = "../../images/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "../../images/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "../../images/scaredGhost2.png";

    this.ghostImage = this.normalGhost;
  }

  draw(ctx) {
    this.#move();
    this.#changeDirection();
    ctx.drawImage(this.ghostImage, this.x, this.y, this.size, this.size);
  }

  #changeDirection() {
    this.directionTimer--;
    let newDirection = null;
    if (this.directionTimer === 0) {
      this.directionTimer = this.directionTimerDefault;
      newDirection = this.#newDirection();
    }

    if (newDirection !== null && this.direction !== newDirection) {
      if (
        Number.isInteger(this.x / this.size) &&
        Number.isInteger(this.y / this.size)
      ) {
        if (!this.map.isCollision(this.x, this.y, newDirection)) {
          this.direction = newDirection;
        }
      }
    }
  }

  #move() {
    if (!this.map.isCollision(this.x, this.y, this.direction)) {
      switch (this.direction) {
        case directions.up:
          this.y -= this.speed;
          break;
        case directions.right:
          this.x += this.speed;
          break;
        case directions.down:
          this.y += this.speed;
          break;
        case directions.left:
          this.x -= this.speed;
          break;
      }
    }
  }

  #newDirection() {
    return Math.floor(Math.random() * Object.keys(directions).length);
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
