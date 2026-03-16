class GameLives {
    constructor(maxLives = 3) {
        this.maxLives = maxLives;
        this.lives = maxLives;
        this.element = null;
    }

    init(element) {
        this.element = element;
        this.render();
    }

    render() {
        this.element.innerHTML = '';
        for (let i = 0; i < this.maxLives; i++) {
            const heart = document.createElement('span');
            heart.className = 'heart';
            heart.textContent = this.lives > i ? '♥' : '♡';
            this.element.appendChild(heart);
        }
    }

    loseLife() {
        if (this.lives > 0) {
            this.lives--;
            this.render();
            return true;
        }
        return false;
    }

    isAlive() {
        return this.lives > 0;
    }

    reset() {
        this.lives = this.maxLives;
        this.render();
    }
}
