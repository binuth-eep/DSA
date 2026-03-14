// js/brick.js
class Brick {
    constructor(x, y, w, h, gift, color) {
        this.x = x; this.y = y; this.w = w; this.h = h;
        this.gift = gift; this.active = true;

        this.dom = document.createElement('div');
        this.dom.className = `brick ${gift ? 'brick-gift' : ''}`;
        this.dom.style.backgroundColor = color;
        this.dom.style.left   = x + 'px';
        this.dom.style.top    = y + 'px';
        this.dom.style.width  = w + 'px';
    }

    destroy() {
        this.active = false;
        this.dom.classList.add('hidden');
    }
}