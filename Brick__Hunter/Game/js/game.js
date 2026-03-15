class Game {
  constructor(config) {
    this.audio = config.audio;
    this.data = config.data;
    this.bricks = config.bricks;
    this.ball = new Ball();
    this.paddle = new Paddle();

    this.onUpdateUI = config.onUpdateUI || (() => {});
    this.onShowScreen = config.onShowScreen || (() => {});
    this.onTriggerPuzzle = config.onTriggerPuzzle || (() => {});

    this.level = 1;
    this.score = 0;
    this.lives = 3;
    this.paused = true;
    this.keys = {};
    this.theme = this.data.getTheme();
    this.highScore = this.data.getHighScore() || 0;
    this.puzzleSolution = 0;

    this.init();
  }

  init() {
    window.addEventListener("keydown", (e) => {
      this.keys[e.code] = true;
      if (e.code === "Space") this.resume();
    });
    window.addEventListener("keyup", (e) => (this.keys[e.code] = false));

    this.bricks.generate(this.level, this.theme);
    this.gameLoop();
  }

  async triggerGift() {
    this.paused = true;
    this.audio.play("gift");
    const data = await PuzzleService.fetchChallenge();
    this.puzzleSolution = data.solution;
    // Notify UI to show puzzle without touching the DOM directly
    this.onTriggerPuzzle(data.question);
  }
  toggleSettings() {
    document.getElementById("screen-settings").classList.toggle("hidden");
  }
  setTheme(h) {
    this.theme = h;
    this.data.setTheme(h);
    this.bricks.generate(this.level, h);
  }
  toggleSound() {
    this.audio.toggleMute();
  }

  closePuzzle() {
    const puzzleScreen = document.getElementById("screen-puzzle");
    if (puzzleScreen) puzzleScreen.classList.add("hidden");

    const rewardScreen = document.getElementById("screen-reward");
    if (rewardScreen) rewardScreen.classList.add("hidden");

    this.paused = false;
  }

  verifyPuzzle(val) {
    if (Number(val) === this.puzzleSolution) {
      this.onShowScreen("reward");
    } else {
      this.resume();
    }
  }

  applyGift(type) {
    const powers = {
      wide: () => (this.paddle.w += 40),
      life: () => this.lives++,
      slow: () => {
        this.ball.dx *= 0.7;
        this.ball.dy *= 0.7;
      },
      speed: () => (this.paddle.speed += 4),
    };
    if (powers[type]) powers[type]();
    this.resume();
  }

  update() {
    if (this.paused) return;

    this.paddle.handleInput(this.keys);

    if (this.ball.attached) {
      this.ball.x = this.paddle.getCenterX() - 8;
    } else {
      this.ball.update();

      // Collision check
      if (this.checkPaddleCollision()) {
        this.ball.dy = -Math.abs(this.ball.dy);
        this.audio.play("paddle");
      }

      const col = this.bricks.checkCollision(this.ball);
      if (col.hit) {
        this.score += 10;
        this.audio.play(col.gift ? "gift" : "brick");
        if (col.gift) this.triggerGift();
      }

      if (this.ball.isLost()) {
        this.handleDeath();
      }
    }

    if (this.bricks.isCleared()) {
      this.handleLevelUp();
    }

    this.broadcastState();
  }

  checkPaddleCollision() {
    return (
      this.ball.y + 16 > 470 &&
      this.ball.x + 16 > this.paddle.x &&
      this.ball.x < this.paddle.x + this.paddle.w
    );
  }

  handleDeath() {
    this.audio.play("lose");
    this.lives--;
    this.paused = true;
    if (this.lives <= 0) {
      this.onShowScreen("gameover", { finalScore: this.score });
    } else {
      this.ball.reset(this.paddle.x, this.paddle.w);
      this.onShowScreen("menu", { status: "LIFE LOST" });
    }
  }

  handleLevelUp() {
    this.audio.play("levelup");
    this.level++;
    this.ball.reset(this.paddle.x, this.paddle.w);
    this.paused = true;
    this.bricks.generate(this.level, this.theme);
    this.onShowScreen("menu", { status: `LEVEL ${this.level}` });
  }

  broadcastState() {
    if (this.score > this.highScore) {
      this.highScore = this.score;
      this.data.saveHighScore(this.highScore);
    }
    this.onUpdateUI({
      level: this.level,
      score: this.score,
      lives: this.lives,
      highScore: this.highScore,
    });
  }

  resume() {
    if (this.ball.attached) this.ball.launch();
    this.paused = !this.paused;
    this.onShowScreen(this.paused ? "menu" : "hide-all");
  }

  gameLoop() {
    this.update();
    this.ball.draw();
    this.paddle.draw();
    requestAnimationFrame(() => this.gameLoop());
  }
}
