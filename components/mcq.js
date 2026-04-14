class MCQ {
    constructor(container) {
        this.container = container;
        this.questionEl = container.querySelector('#question-text');
        this.optionsEl = container.querySelector('#options-container');
        this.explanationEl = container.querySelector('#explanation');
        this.selectedIndex = null;
        this.locked = false;
        this.onAnswer = null;
    }

    render(puzzle) {
        this.selectedIndex = null;
        this.locked = false;
        this.explanationEl.style.display = 'none';
        this.explanationEl.className = 'explanation-box';

        this.questionEl.textContent = puzzle.question;

        this.optionsEl.innerHTML = '';
        puzzle.options.forEach((text, i) => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = text;
            btn.addEventListener('click', () => this.selectOption(i));
            this.optionsEl.appendChild(btn);
        });
    }

    selectOption(index) {
        if (this.locked) return;
        this.locked = true;
        this.selectedIndex = index;
        if (this.onAnswer) this.onAnswer(index);
    }

    showResult(correctIndex, explanation) {
        const buttons = this.optionsEl.querySelectorAll('.option-btn');
        buttons.forEach((btn, i) => {
            btn.style.pointerEvents = 'none';
            if (i === correctIndex) {
                btn.classList.add('correct-answer');
            } else if (i === this.selectedIndex && i !== correctIndex) {
                btn.classList.add('wrong-answer');
            }
        });

        if (explanation) {
            this.explanationEl.textContent = explanation;
            this.explanationEl.style.display = 'block';
            this.explanationEl.className = 'explanation-box ' +
                (this.selectedIndex === correctIndex ? 'correct' : 'wrong');
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MCQ;
}
