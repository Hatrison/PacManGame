import directions from "./directions.js";
import checkInt from "./checkInteger.js";

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
    this.normalGhost.src = "images/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "images/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "images/scaredGhost2.png";

    this.ghostImage = this.normalGhost;

    this.scaredExpirationTimerDefault = 10;
    this.scaredExpirationTimer = this.scaredExpirationTimerDefault;
  }

  draw(ctx, pause, pacman) {
    if (!pause) {
      this.#move();
      this.#changeDirection();
    }
    this.#setImage(ctx, pacman);
  }

  #setImage(ctx, pacman) {
    pacman.powerDotActive
      ? this.#changeImagePowerDotIsActive(pacman)
      : (this.ghostImage = this.normalGhost);

    ctx.drawImage(this.ghostImage, this.x, this.y, this.size, this.size);
  }

  #changeImagePowerDotIsActive(pacman) {
    if (pacman.powerDotExpiration) {
      this.scaredExpirationTimer--;
      if (this.scaredExpirationTimer === 0) {
        this.scaredExpirationTimer = this.scaredExpirationTimerDefault;

        this.ghostImage === this.scaredGhost
          ? (this.ghostImage = this.scaredGhost2)
          : (this.ghostImage = this.scaredGhost);
      }
    } else {
      this.ghostImage = this.scaredGhost;
    }
  }

  #changeDirection() {
    this.directionTimer--;
    let newDirection = null;
    if (this.directionTimer === 0) {
      this.directionTimer = this.directionTimerDefault;
      newDirection = this.#newDirection();
    }

    if (newDirection !== null && this.direction !== newDirection) {
      if (checkInt(this.x, this.y, this.size))
        if (!this.map.isCollision(this.x, this.y, newDirection))
          this.direction = newDirection;
    }
  }

  #move() {
    const directionsEnemy = {
      up: () => (this.y -= this.speed),
      right: () => (this.x += this.speed),
      down: () => (this.y += this.speed),
      left: () => (this.x -= this.speed),
    };
    if (!this.map.isCollision(this.x, this.y, this.direction))
      directionsEnemy[this.direction]();
  }

  isCollision(pacman) {
    const size = this.size / 2;
    const { x: xPacman, y: yPacman } = pacman;
    const x = this.x + size;
    const y = this.y + size;
    const x2 = xPacman + size;
    const y2 = yPacman + size;
    return this.x < x2 && x > xPacman && this.y < y2 && y > yPacman;
  }

  #newDirection() {
    const numberToStringDirections = {
      0: "up",
      1: "right",
      2: "down",
      3: "left",
    };
    const route = Math.floor(Math.random() * Object.keys(directions).length);
    return numberToStringDirections[route];
  }

  #random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
