import directions from "./directions.js";

export default class Pacman {
  constructor(x, y, size, speed, map) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.map = map;

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
  }

  draw(ctx) {
    ctx.drawImage(
      this.arrayOfPacmanImages[this.arrayOfPacmanImagesIndex],
      this.x,
      this.y,
      this.size,
      this.size
    );
  }
}
