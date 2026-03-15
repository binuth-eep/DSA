
class Ball {
    constructor() {
        this.dom = document.getElementById('ball');
        this.w = 16; this.h = 16;
        this.reset(300, 100);
    }

    reset(paddleX, paddleW) {
        this.x = paddleX + paddleW / 2 - this.w / 2;
        this.y = 454;
        this.dx = 4;
        this.dy = -4;
        this.attached = true;
    }

    launch() { this.attached = false; }

    update() {
        if (this.attached) return;
        this.x += this.dx;
        this.y += this.dy;
        if (this.x <= 0 || this.x >= 700 - this.w) this.dx *= -1;
        if (this.y <= 0) this.dy *= -1;
    }

    draw() {
        this.dom.style.left = this.x + 'px';
        this.dom.style.top  = this.y + 'px';
    }

    isLost() { return this.y > 500; }
}