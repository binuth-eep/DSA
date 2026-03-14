// js/brickManager.js
class BrickManager {
    constructor(container) {
        this.container = container;
        this.bricks = [];
    }

    generate(level, hue) {
        this.bricks = [];
        this.container.innerHTML = '';

        const rows = 3 + level;
        const cols = 9;
        const brickW = (700 / cols) - 5;
        const brickH = 20;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const gift = Math.random() < 0.15;
                const color = gift ? 'var(--gift)' : `hsl(${hue}, 70%, ${60 - r*5}%)`;
                const x = c * (brickW + 5) + 2;
                const y = r * 25 + 50;

                const brick = new Brick(x, y, brickW, brickH, gift, color);
                this.bricks.push(brick);
                this.container.appendChild(brick.dom);
            }
        }
    }

    checkCollision(ball) {
        for (const b of this.bricks) {
            if (!b.active) continue;
            if (ball.x + ball.w > b.x &&
                ball.x < b.x + b.w &&
                ball.y + ball.h > b.y &&
                ball.y < b.y + b.h) {
                b.destroy();
                ball.dy *= -1;
                return { hit: true, gift: b.gift };
            }
        }
        return { hit: false, gift: false };
    }

    isCleared() {
        return this.bricks.every(b => !b.active);
    }
}