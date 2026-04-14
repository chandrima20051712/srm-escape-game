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
        this.hintButtonEl = null;
        this.hintBoxEl = null;
        this.hintUsed = false;
    }

    init() {
        this.buildingId = new URLSearchParams(window.location.search).get('building');
        if (!this.buildingId || !PUZZLES_DATA.buildings[this.buildingId]) {
            window.location.href = 'map.html';
            return;
        }

        this.buildingData = PUZZLES_DATA.buildings[this.buildingId];
        if (window.SRM_USE_BACKEND === true) {
            this.initializeQuiz();
            return;
        }

        this.initializeQuizSync();
    }

    initializeQuizSync() {
        this.puzzles = this.buildingData.puzzles;
        this.dotStates = new Array(this.puzzles.length).fill('pending');
        this.hintUsed = false;

        document.getElementById('building-title').textContent =
            this.buildingData.emoji + ' ' + this.buildingData.name;
        document.getElementById('building-theme').textContent = this.buildingData.theme;

        this.lives = new GameLives(3);
        this.lives.init(document.getElementById('lives'));

        this.score = new GameScore();
        this.score.init(document.getElementById('score-display'));

        this.mcq = new MCQ(document.getElementById('quiz-area'));
        this.mcq.onAnswer = (index) => this.handleAnswer(index);

        this.flashEl = document.getElementById('feedback-flash');
        this.setupHintSystem();

        this.renderDots();
        this.showQuestion();
    }

    async initializeQuiz() {
        await this.loadPuzzles();
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
        this.setupHintSystem();

        // Render progress dots
        this.renderDots();

        // Show first question
        this.showQuestion();
    }

    async loadPuzzles() {
        if (window.SRM_USE_BACKEND === true) {
            try {
                const response = await fetch('http://localhost:5000/api/puzzles/building/' + this.buildingId);
                const puzzles = await response.json();
                if (response.ok && Array.isArray(puzzles) && puzzles.length > 0) {
                    this.puzzles = puzzles.map((puzzle, index) => ({
                        id: puzzle.id,
                        title: puzzle.puzzle_order ? String(puzzle.puzzle_order) : 'Puzzle ' + (index + 1),
                        question: puzzle.question,
                        options: Array.isArray(puzzle.options) ? puzzle.options : JSON.parse(puzzle.options),
                        correct: puzzle.correct_answer,
                        points: 100,
                        timeLimit: puzzle.time_limit || 60,
                        explanation: puzzle.explanation || '',
                        hint: puzzle.hint || ''
                    }));
                    return;
                }
            } catch (err) {
                // Fall back to static content below.
            }
        }

        this.puzzles = this.buildingData.puzzles;
    }

    setupHintSystem() {
        this.hintButtonEl = document.getElementById('hint-btn');
        this.hintBoxEl = document.getElementById('hint-box');

        if (this.hintButtonEl) {
            this.hintButtonEl.addEventListener('click', () => this.showHint());
        }
    }

    deriveHint(puzzle) {
        const theme = this.buildingData ? this.buildingData.theme : 'the topic';
        return 'Focus on ' + theme + ' and eliminate the options that do not match the core concept.';
    }

    getHintText(puzzle) {
        return puzzle.hint && puzzle.hint.trim() ? puzzle.hint : this.deriveHint(puzzle);
    }

    showHint() {
        const puzzle = this.puzzles[this.currentIndex];
        if (!puzzle || !this.hintBoxEl) return;

        this.hintUsed = true;
        this.hintBoxEl.textContent = this.getHintText(puzzle);
        this.hintBoxEl.style.display = 'block';

        if (this.hintButtonEl) {
            this.hintButtonEl.disabled = true;
            this.hintButtonEl.textContent = 'Hint Shown';
        }
    }

    resetHintState() {
        this.hintUsed = false;
        if (this.hintBoxEl) {
            this.hintBoxEl.textContent = '';
            this.hintBoxEl.style.display = 'none';
        }
        if (this.hintButtonEl) {
            this.hintButtonEl.disabled = false;
            this.hintButtonEl.textContent = 'Show Hint';
        }
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
        this.resetHintState();

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
        var order = PUZZLES_DATA.buildingOrder || [];
        var isLastBuilding = order.indexOf(this.buildingId) === order.length - 1;

        if (typeof Storage !== 'undefined' && Storage.complete) {
            Storage.complete(this.buildingId, finalScore);
        }

        if (isLastBuilding) {
            (async function syncFinalScore() {
                try {
                    var current = JSON.parse(localStorage.getItem('srmAuth_current') || '{}');
                    if (!current.token) return;

                    await fetch('http://localhost:5000/api/scores/submit', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: 'Bearer ' + current.token
                        },
                        body: JSON.stringify({
                            buildingId: this.buildingId,
                            score: finalScore,
                            livesRemaining: 0,
                            timeTaken: 0
                        })
                    });
                } catch (err) {
                    // Final score sync is optional; local progress remains available.
                }
            }).call(this);

            window.location.replace('graduation.html');
            return;
        }

        window.location.href = 'complete.html?building=' + this.buildingId + '&score=' + finalScore;
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = QuizEngine;
} else {
    document.addEventListener('DOMContentLoaded', function() {
        new QuizEngine().init();
    });
}
