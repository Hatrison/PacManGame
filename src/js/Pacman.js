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

    this.rotation = {
      right: 0,
      down: 1,
      left: 2,
      up: 3,
    };
    this.pacmanRotation = this.rotation.right;

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

    this.firstMove = false;

    document.addEventListener("keydown", this.#onKeyDown);
  }

  draw(ctx, enemies) {
    this.#move();
    this.#animate();
    this.map.eatDot(this.x, this.y);
    this.#eatPowerDot();
    this.#eatGhost(enemies);

    const size = this.size / 2;

    ctx.save();
    ctx.translate(this.x + size, this.y + size);
    ctx.rotate((this.pacmanRotation * 90 * Math.PI) / 180);
    ctx.drawImage(
      this.arrayOfPacmanImages[this.arrayOfPacmanImagesIndex],
      -size,
      -size,
      this.size,
      this.size
    );

    ctx.restore();
  }

  #onKeyDown = (event) => {
    const code = event.code;
    if (code === "KeyW" || code === "ArrowUp") {
      if (this.currentDirection === directions.down)
        this.currentDirection = directions.up;
      this.requestedDirection = directions.up;
      this.firstMove = true;
    }
    if (code === "KeyD" || code === "ArrowRight") {
      if (this.currentDirection === directions.left)
        this.currentDirection = directions.right;
      this.requestedDirection = directions.right;
      this.firstMove = true;
    }
    if (code === "KeyS" || code === "ArrowDown") {
      if (this.currentDirection === directions.up)
        this.currentDirection = directions.down;
      this.requestedDirection = directions.down;
      this.firstMove = true;
    }
    if (code === "KeyA" || code === "ArrowLeft") {
      if (this.currentDirection === directions.right)
        this.currentDirection = directions.left;
      this.requestedDirection = directions.left;
      this.firstMove = true;
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
        this.pacmanRotation = this.rotation.up;
        break;
      case directions.right:
        this.x += this.speed;
        this.pacmanRotation = this.rotation.right;
        break;
      case directions.down:
        this.y += this.speed;
        this.pacmanRotation = this.rotation.down;
        break;
      case directions.left:
        this.x -= this.speed;
        this.pacmanRotation = this.rotation.left;
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

  #eatPowerDot() {
    if (this.map.eatPowerDot(this.x, this.y)) {
      this.powerDotActive = true;
      this.powerDotExpiration = false;
      this.timers = [];
      this.timers.forEach((timer) => clearTimeout(timer));

      let powerDotTimer = setTimeout(() => {
        this.powerDotActive = false;
        this.powerDotExpiration = false;
      }, 6000);

      this.timers.push(powerDotTimer);

      let powerDotExpirationTimer = setTimeout(() => {
        this.powerDotExpiration = true;
      }, 3000);

      this.timers.push(powerDotExpirationTimer);
    }
  }

  #eatGhost(enemies) {
    if (this.powerDotActive) {
      const enemiesCollided = enemies.filter((enemy) =>
        enemy.isCollision(this)
      );
      enemiesCollided.forEach((enemy) =>
        enemies.splice(enemies.indexOf(enemy), 1)
      );
    }
  }
}
