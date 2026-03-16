class QuizEngine {
    constructor() {
        this.buildingId = null;
        this.buildingData = null;
        this.puzzles = [];
        this.currentIndex = 0;
        this.mcq = null;
        this.timer = null;
        this.lives = null;
        this.score = null;
        this.dotStates = [];
        this.flashEl = null;
    }

    init() {
        this.buildingId = new URLSearchParams(window.location.search).get('building');
        if (!this.buildingId || !PUZZLES_DATA.buildings[this.buildingId]) {
            window.location.href = 'map.html';
            return;
        }

        this.buildingData = PUZZLES_DATA.buildings[this.buildingId];
        this.puzzles = this.buildingData.puzzles;
        this.dotStates = new Array(this.puzzles.length).fill('pending');

        // Set building title
        document.getElementById('building-title').textContent =
            this.buildingData.emoji + ' ' + this.buildingData.name;
        document.getElementById('building-theme').textContent = this.buildingData.theme;

        // Init components
        this.lives = new GameLives(3);
        this.lives.init(document.getElementById('lives'));

        this.score = new GameScore();
        this.score.init(document.getElementById('score-display'));

        this.mcq = new MCQ(document.getElementById('quiz-area'));
        this.mcq.onAnswer = (index) => this.handleAnswer(index);

        // Create flash overlay
        this.flashEl = document.getElementById('feedback-flash');

        // Render progress dots
        this.renderDots();

        // Show first question
        this.showQuestion();
    }

    renderDots() {
        const dotsEl = document.getElementById('progress-dots');
        dotsEl.innerHTML = '';
        this.dotStates.forEach((state, i) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (i === this.currentIndex) dot.classList.add('current');
            if (state === 'correct') dot.classList.add('completed');
            if (state === 'wrong') dot.classList.add('wrong');
            dotsEl.appendChild(dot);
        });
    }

    showQuestion() {
        const puzzle = this.puzzles[this.currentIndex];

        // Update counter
        document.getElementById('question-counter').textContent =
            'Question ' + (this.currentIndex + 1) + ' of ' + this.puzzles.length;

        // Update dots
        this.renderDots();

        // Render MCQ
        this.mcq.render(puzzle);

        // Start timer
        if (this.timer) this.timer.stop();
        this.timer = new GameTimer(puzzle.timeLimit, (event) => {
            if (event === 'timeup') this.handleAnswer(-1);
        });
        this.timer.start(document.getElementById('timer-text'));
    }

    handleAnswer(selectedIndex) {
        this.timer.stop();
        const puzzle = this.puzzles[this.currentIndex];
        const isCorrect = selectedIndex === puzzle.correct;

        // Show visual result on MCQ
        this.mcq.showResult(puzzle.correct, puzzle.explanation);

        // Flash feedback
        this.showFlash(isCorrect);

        if (isCorrect) {
            this.dotStates[this.currentIndex] = 'correct';
            var timeBonus = Math.floor(this.timer.timeLeft * 2);
            var totalPoints = puzzle.points + timeBonus;
            this.score.addPoints(totalPoints);
            this.showPointsPopup('+' + totalPoints);
        } else {
            this.dotStates[this.currentIndex] = 'wrong';
            this.lives.loseLife();
        }

        this.renderDots();

        // Check game over
        if (!this.lives.isAlive()) {
            setTimeout(() => this.showGameOver(), 2000);
            return;
        }

        // Advance
        var delay = isCorrect ? 1500 : 2500;
        setTimeout(() => {
            this.currentIndex++;
            if (this.currentIndex >= this.puzzles.length) {
                this.completeBuilding();
            } else {
                this.showQuestion();
            }
        }, delay);
    }

    showFlash(correct) {
        this.flashEl.className = 'feedback-flash ' + (correct ? 'correct' : 'wrong');
        setTimeout(() => {
            this.flashEl.className = 'feedback-flash';
        }, 500);
    }

    showPointsPopup(text) {
        var popup = document.createElement('div');
        popup.className = 'points-popup';
        popup.textContent = text;
        document.body.appendChild(popup);
        setTimeout(() => popup.remove(), 1200);
    }

    showGameOver() {
        var overlay = document.getElementById('game-over');
        overlay.style.display = 'flex';
        document.getElementById('game-over-score').textContent =
            'Score: ' + this.score.getScore();
    }

    completeBuilding() {
        var finalScore = this.score.getScore();
        window.location.href = 'complete.html?building=' + this.buildingId + '&score=' + finalScore;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    new QuizEngine().init();
});
