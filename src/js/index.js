import Map from "./Map.js";

class Game {
  constructor() {
    this.size = 48;
    this.speed = 3;
    this.fps = 1000 / 60;

    this.canvas = document.getElementById("js-canvas");
    this.textDiv = document.querySelector(".js-final-text-thumb");
    this.text = document.querySelector(".js-final-text");
    this.startButton = document.getElementById("start-button");
    this.exitButton = document.getElementById("exit-button");
    this.restartButton = document.getElementById("restart-button");
    this.menuButton = document.getElementById("menu-button");
    this.menu = document.getElementById("menu");
    this.levelDisplay = document.getElementById("level-display");
    this.ctx = this.canvas.getContext("2d");

    this.map = new Map(this.size);
    this.pacman = this.map.getPacman(this.speed);
    this.enemies = this.map.getEnemies(this.speed);

    this.gameOver = false;
    this.gameWin = false;
    this.gameRunning = false;
    this.mainLoop = null;
    this.paused = false;
    this.started = false;

    this.initEventListeners();
    this.showStartMessage();
  }

  initEventListeners() {
    document.addEventListener("keydown", (e) => {
      const startKeys = ["ArrowLeft", "ArrowRight", "KeyA", "KeyD"];

      if (!this.started && startKeys.includes(e.code)) {
        this.hideStartMessage();
        this.started = true;
      }

      if (e.key === "p" || e.key === "P") {
        this.paused = !this.paused;
        this.paused ? this.showPauseScreen() : this.hidePauseScreen();
      }
    });

    this.startButton.addEventListener("click", () => {
      this.menu.classList.add("hidden");
      this.canvas.classList.remove("hidden");
      this.startGame();
    });

    this.exitButton.addEventListener("click", () => {
      window.close();
    });

    this.restartButton.addEventListener("click", () => {
      this.resetGame();
      this.startGame();
    });

    this.menuButton.addEventListener("click", () => {
      this.resetGame();
      this.textDiv.classList.add("hidden");
      this.canvas.classList.add("hidden");
      this.menu.classList.remove("hidden");
    });
  }

  showStartMessage() {
    const startMessage = document.createElement("div");
    startMessage.id = "start-message";
    startMessage.innerText = "Press any move key to start moving";

    document.body.appendChild(startMessage);
  }

  hideStartMessage() {
    const startMessage = document.getElementById("start-message");
    if (startMessage) {
      startMessage.remove();
    }
  }

  startGame() {
    clearInterval(this.mainLoop);
    this.gameRunning = true;
    this.map.setCanvasSize(this.canvas);
    this.mainLoop = setInterval(() => this.gameLoop(), this.fps);
    this.map.updateLevelDisplay();
  }

  resetGame() {
    clearInterval(this.mainLoop);
    this.gameOver = false;
    this.gameWin = false;
    this.started = false;
    this.textDiv.classList.add("hidden");

    this.map.resetMap();
    this.pacman.reset();
    this.reinitializeEnemies();
  }

  reinitializeEnemies() {
    this.enemies = this.map.getEnemies(this.speed);
  }

  showPauseScreen() {
    const pauseOverlay = document.createElement("div");
    pauseOverlay.id = "pause-overlay";

    const pauseText = document.createElement("div");
    pauseText.className = "pause-text";
    pauseText.innerText = "Paused";

    const continueText = document.createElement("div");
    continueText.className = "continue-text";
    continueText.innerText = "To continue, press 'P'";

    const continueButton = document.createElement("button");
    continueButton.className = "continue-button";
    continueButton.innerText = "Continue";
    continueButton.addEventListener("click", () => {
      this.paused = false;
      this.hidePauseScreen();
    });

    pauseOverlay.appendChild(pauseText);
    pauseOverlay.appendChild(continueText);
    pauseOverlay.appendChild(continueButton);

    document.body.appendChild(pauseOverlay);
  }

  hidePauseScreen() {
    const pauseOverlay = document.getElementById("pause-overlay");
    if (pauseOverlay) {
      pauseOverlay.remove();
    }
  }

  nextLevel() {
    if (this.map.currentLevelIndex + 1 < this.map.levels.length) {
      this.map.nextLevel();
      this.pacman.reset();
      this.reinitializeEnemies();
      this.showLevelModal(this.map.currentLevelIndex + 1);
    } else {
      this.gameWin = true;
      this.drawGameEnd();
      this.map.currentLevelIndex = 0;
    }
  }

  showLevelModal(level) {
    const levelModal = document.createElement("div");
    levelModal.id = "level-modal";

    const levelText = document.createElement("div");
    levelText.className = "level-text";
    levelText.innerText = `Level ${level}`;

    const continueButton = document.createElement("button");
    continueButton.className = "continue-button";
    continueButton.innerText = "Continue";

    continueButton.addEventListener("click", () => {
      levelModal.remove();
      this.startGame();
    });

    levelModal.appendChild(levelText);
    levelModal.appendChild(continueButton);

    document.body.appendChild(levelModal);
  }

  gameLoop() {
    if (this.paused) return;

    this.map.draw(this.ctx);
    this.drawGameEnd();
    this.pacman.draw(this.ctx, this.enemies, this.pause());
    this.enemies.forEach((enemy) =>
      enemy.draw(this.ctx, this.pause(), this.pacman)
    );
    this.checkGameOver();
    this.checkGameWin();
  }

  pause() {
    return !this.pacman.firstMove || this.gameOver || this.gameWin;
  }

  checkGameOver() {
    if (!this.gameOver) {
      this.gameOver = this.enemies.some(
        (enemy) => !this.pacman.powerDotActive && enemy.isCollision(this.pacman)
      );
      if (this.gameOver) {
        this.drawGameEnd();
      }
    }
  }

  checkGameWin() {
    if (!this.gameWin && this.map.win()) {
      this.nextLevel();
    }
  }

  drawGameEnd() {
    if (this.gameOver || this.gameWin) {
      this.text.innerText = this.gameWin
        ? this.map.currentLevelIndex + 1 >= this.map.levels.length
          ? "You Win the Game!"
          : "Level Complete!"
        : "Game Over";
      this.textDiv.classList.remove("hidden");
      clearInterval(this.mainLoop);
    }
  }
}

const game = new Game();
