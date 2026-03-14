// js/game.js
class Game {
    constructor() {
        this.audio = new AudioManager();

        this.ball     = new Ball();
        this.paddle   = new Paddle();
        this.bricks   = new BrickManager(document.getElementById('bricks-container'));
        this.data     = new DataManager();
        this.highScore = this.data.getHighScore() || 0;   // Load saved high score (or start at 0)

        this.auth = new Auth(this);

        this.level    = 1;
        this.score    = 0;
        this.lives    = 3;
        this.paused   = true;
        this.keys     = {};
        this.theme    = this.data.getTheme();
        this.puzzleSolution = 0;

        this.init();
    }

    init() {
        window.addEventListener('keydown', e => {
            this.keys[e.code] = true;
            if (e.code === 'Space') this.resume();
        });
        window.addEventListener('keyup', e => this.keys[e.code] = false);

        this.bricks.generate(this.level, this.theme);
        this.gameLoop();
    }

    async triggerGift() {
        this.paused = true;
        this.audio.play('gift');
        const data = await PuzzleService.fetchChallenge();
        this.puzzleSolution = data.solution;
        document.getElementById('puzzle-img').src = data.question;
        document.getElementById('screen-puzzle').classList.remove('hidden');
    }

    verifyPuzzle() {
        const input = document.getElementById('puzzle-input');
        if (Number(input.value) === this.puzzleSolution) {
            document.getElementById('screen-puzzle').classList.add('hidden');
            document.getElementById('screen-reward').classList.remove('hidden');
        } else {
            this.closeOverlays();
        }
        input.value = '';
    }

    applyGift(type) {
        switch (type) {
            case 'wide':  this.paddle.w += 40; break;
            case 'life':  this.lives++; break;
            case 'slow':  this.ball.dx *= 0.7; this.ball.dy *= 0.7; break;
            case 'speed': this.paddle.speed += 4; break;
        }
        this.closeOverlays();
    }

    closeOverlays() {
        document.getElementById('screen-puzzle')?.classList.add('hidden');
        document.getElementById('screen-reward')?.classList.add('hidden');
        this.paused = false;
    }

    update() {
        if (this.paused) return;

        this.paddle.handleInput(this.keys);

        if (this.ball.attached) {
            this.ball.x = this.paddle.getCenterX() - 8;
        } else {
            this.ball.update();

            if (this.ball.y + 16 > 470 &&
                this.ball.x + 16 > this.paddle.x &&
                this.ball.x < this.paddle.x + this.paddle.w) {
                this.ball.dy = -Math.abs(this.ball.dy);
                this.audio.play('paddle');
            }

            const col = this.bricks.checkCollision(this.ball);
            if (col.hit) {
                this.score += 10;
                this.audio.play(col.gift ? 'gift' : 'brick');
                if (col.gift) this.triggerGift();
            }

            if (this.ball.isLost()) {
                this.audio.play('lose');
                this.lives--;
                if (this.lives <= 0) {
                    this.showGameOver();
                } else {
                    this.ball.reset(this.paddle.x, this.paddle.w);
                    this.paused = true;
                    document.getElementById('menu-status').innerText = "LIFE LOST";
                    document.getElementById('screen-menu').classList.remove('hidden');
                }
            }
        }

        if (this.bricks.isCleared()) {
            this.audio.play('levelup');
            this.level++;
            this.ball.reset(this.paddle.x, this.paddle.w);
            this.paused = true;
            this.bricks.generate(this.level, this.theme);
            document.getElementById('menu-status').innerText = `LEVEL ${this.level}`;
            document.getElementById('screen-menu').classList.remove('hidden');
        }

        this.syncUI();
    }

   showGameOver() {
    this.paused = true;
    document.getElementById('final-score').innerText = this.score;
    document.getElementById('screen-gameover').classList.remove('hidden');
   }

    restart() {
        document.getElementById('screen-gameover').classList.add('hidden');
        this.level = 1;
        this.score = 0;
        this.lives = 3;
        this.ball.reset(this.paddle.x, this.paddle.w);
        this.bricks.generate(this.level, this.theme);
        this.paused = true;
        document.getElementById('screen-menu').classList.remove('hidden');
        this.syncUI();
    }

syncUI() {
    document.getElementById('ui-lvl').innerText   = this.level;
    document.getElementById('ui-score').innerText = this.score;
    document.getElementById('ui-lives').innerText = this.lives;

    // Check and update high score
    if (this.score > this.highScore) {
        this.highScore = this.score;
        this.data.saveHighScore(this.highScore);
    }

    // Always show the current high score
    document.getElementById('ui-high').innerText = this.highScore;
}

    setTheme(h) {
        this.theme = h;
        this.data.setTheme(h);
        this.bricks.generate(this.level, h);
    }

    toggleSettings() {
        document.getElementById('screen-settings').classList.toggle('hidden');
    }

    toggleSound() {
        this.audio.toggleMute();
    }

    resume() {
        if (this.ball.attached) this.ball.launch();
        this.paused = !this.paused;
        document.getElementById('screen-menu').classList.toggle('hidden', !this.paused);
    }

    gameLoop() {
        this.update();
        this.ball.draw();
        this.paddle.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

const game = new Game();
window.game = {
    resume:        () => game.resume(),
    toggleSettings:() => game.toggleSettings(),
    setTheme:      (h) => game.setTheme(h),
    verifyPuzzle:  () => game.verifyPuzzle(),
    applyGift:     (t) => game.applyGift(t),
    closePuzzle:   () => game.closeOverlays(),
    restart:       () => game.restart(),
    toggleSound:   () => game.toggleSound(),
};