export default class Map {
  constructor(size) {
    this.size = size;

    this.yellowDot = new Image();
    this.yellowDot.src = "../../images/yellowDot.png";

    this.pinkDot = new Image();
    this.pinkDot.src = "../../images/pinkDot.png";

    this.wall = new Image();
    this.wall.src = "../../images/wall.png";
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
    [0, 1, 0, 0, 0, 0, 0, 1, 1, 0, 1, 1, 0],
    [0, 4, 1, 1, 1, 1, 1, 1, 1, 1, 1, 4, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  draw(ctx) {
    for (let row = 0; row < this.map.length; row++) {
      for (let column = 0; column < this.map[row].length; column++) {
        const block = this.map[row][column];
        if (block === 0) {
          this.#drawBlock(ctx, this.wall, column, row);
        } else if (block === 1) {
          this.#drawBlock(ctx, this.yellowDot, column, row);
        }
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
}
