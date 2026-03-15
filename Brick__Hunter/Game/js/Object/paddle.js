// js/paddle.js
class Paddle {
    constructor() {
        this.dom = document.getElementById('paddle');
        this.x = 300; this.y = 470;
        this.w = 100; this.h = 15;
        this.speed = 10;
    }

    handleInput(keys) {
        let dir = 0;
        if (keys.ArrowLeft || keys.KeyA) dir--;
        if (keys.ArrowRight || keys.KeyD) dir++;
        this.x += dir * this.speed;
        this.x = Math.max(0, Math.min(700 - this.w, this.x));
    }

    draw() {
        this.dom.style.left  = this.x + 'px';
        this.dom.style.top   = this.y + 'px';
        this.dom.style.width = this.w + 'px';
    }

    getCenterX() { return this.x + this.w / 2; }
}