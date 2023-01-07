import directions from "./directions.js";

export default class Enemy {
  constructor(x, y, size, speed, map) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.spped = speed;
    this.map = map;

    this.normalGhost = new Image();
    this.normalGhost.src = "../../images/ghost.png";

    this.scaredGhost = new Image();
    this.scaredGhost.src = "../../images/scaredGhost.png";

    this.scaredGhost2 = new Image();
    this.scaredGhost2.src = "../../images/scaredGhost2.png";

    this.ghostImage = this.normalGhost;
  }

  draw(ctx) {
    ctx.drawImage(this.ghostImage, this.x, this.y, this.size, this.size);
  }
}
