class GameTimer {
    constructor(timeLimit, callback) {
        this.timeLimit = timeLimit;
        this.timeLeft = timeLimit;
        this.callback = callback;
        this.element = null;
        this.interval = null;
    }

    start(element) {
        this.element = element;
        this.updateDisplay();
        this.interval = setInterval(() => {
            this.timeLeft--;
            this.updateDisplay();
            if (this.timeLeft <= 0) {
                clearInterval(this.interval);
                this.callback('timeup');
            }
        }, 1000);
    }

    updateDisplay() {
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.element.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        const color = this.timeLeft <= 10 ? '#ff4444' : '#D4A017';
        const parent = this.element.parentElement;
        if (parent) {
            parent.style.borderRightColor = color;
            parent.style.borderBottomColor = color;
            parent.style.borderLeftColor = color;
            parent.style.borderTopColor = 'transparent';
        }
    }

    stop() {
        if (this.interval) {
            clearInterval(this.interval);
            this.interval = null;
        }
    }

    reset(newTime) {
        this.stop();
        this.timeLeft = newTime || this.timeLimit;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = GameTimer;
}
