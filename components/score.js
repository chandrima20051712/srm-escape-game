class GameScore {
    constructor() {
        this.score = 0;
        this.element = null;
    }

    init(element) {
        this.element = element;
        this.updateDisplay();
    }

    addPoints(points) {
        this.score += points;
        this.updateDisplay();
    }

    updateDisplay() {
        this.element.textContent = `Score: ${this.score}`;
    }

    getScore() {
        return this.score;
    }

    reset() {
        this.score = 0;
        this.updateDisplay();
    }
}
