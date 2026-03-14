// js/audioManager.js
class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.muted = false;
    }

    toggleMute() {
        this.muted = !this.muted;
        document.getElementById('sound-btn').innerText = `SOUND: ${this.muted ? 'OFF' : 'ON'}`;
    }

    play(type) {
        if (this.muted) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        switch (type) {
            case 'paddle':
                osc.type = 'square';
                osc.frequency.setValueAtTime(800, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.4, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.12);
                break;
            case 'brick':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.06);
                gain.gain.setValueAtTime(0.35, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.09);
                break;
            case 'gift':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(600, this.ctx.currentTime);
                osc.frequency.setValueAtTime(900, this.ctx.currentTime + 0.05);
                osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.25);
                break;
            case 'lose':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(180, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(60, this.ctx.currentTime + 0.4);
                gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.5);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.5);
                break;
            case 'levelup':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(400, this.ctx.currentTime);
                osc.frequency.setValueAtTime(800, this.ctx.currentTime + 0.08);
                osc.frequency.setValueAtTime(1200, this.ctx.currentTime + 0.16);
                gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.4);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.4);
                break;
        }
    }
}