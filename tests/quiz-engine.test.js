const QuizEngine = require('../js/quiz-engine.js');

function buildQuizDom() {
  document.body.innerHTML = `
    <h2 id="building-title"></h2>
    <p id="building-theme"></p>
    <div id="lives"></div>
    <div id="score-display"></div>
    <div id="quiz-area"></div>
    <div id="feedback-flash" class="feedback-flash"></div>
    <div id="progress-dots"></div>
    <div id="question-counter"></div>
    <span id="timer-text"></span>
    <div id="game-over" style="display:none;"></div>
    <div id="game-over-score"></div>
  `;
}

describe('QuizEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    buildQuizDom();

    Object.defineProperty(window, 'location', {
      value: {
        search: '?building=test-building',
        href: 'quiz.html',
        pathname: '/screens/quiz.html'
      },
      writable: true,
      configurable: true
    });

    global.PUZZLES_DATA = {
      buildings: {
        'test-building': {
          emoji: 'X',
          name: 'Test Building',
          theme: 'Testing',
          puzzles: [
            {
              question: 'Q1',
              options: ['A', 'B'],
              correct: 1,
              explanation: 'exp',
              points: 10,
              timeLimit: 30
            },
            {
              question: 'Q2',
              options: ['C', 'D'],
              correct: 0,
              explanation: 'exp2',
              points: 20,
              timeLimit: 45
            }
          ]
        }
      }
    };

    global.GameLives = class {
      constructor() {
        this.alive = true;
      }
      init() {}
      loseLife() {
        this.alive = false;
      }
      isAlive() {
        return this.alive;
      }
    };

    global.GameScore = class {
      constructor() {
        this.value = 0;
      }
      init() {}
      addPoints(points) {
        this.value += points;
      }
      getScore() {
        return this.value;
      }
    };

    global.MCQ = class {
      constructor() {
        this.onAnswer = null;
        this.render = vi.fn();
        this.showResult = vi.fn();
      }
    };

    global.GameTimer = class {
      constructor(_timeLimit, cb) {
        this.timeLeft = 10;
        this.callback = cb;
      }
      start() {}
      stop() {}
    };
  });

  afterEach(() => {
    vi.useRealTimers();
    delete global.PUZZLES_DATA;
    delete global.GameLives;
    delete global.GameScore;
    delete global.MCQ;
    delete global.GameTimer;
  });

  test('init loads building and renders first puzzle', () => {
    const engine = new QuizEngine();
    engine.init();

    expect(engine.buildingId).toBe('test-building');
    expect(engine.puzzles.length).toBe(2);
    expect(engine.mcq.render).toHaveBeenCalledWith(engine.puzzles[0]);
    expect(document.getElementById('question-counter').textContent).toBe('Question 1 of 2');
  });

  test('correct answer awards score and advances to next puzzle', () => {
    const engine = new QuizEngine();
    engine.init();

    engine.handleAnswer(1);
    vi.advanceTimersByTime(1500);

    expect(engine.score.getScore()).toBe(30);
    expect(engine.currentIndex).toBe(1);
    expect(engine.dotStates[0]).toBe('correct');
    expect(engine.mcq.render).toHaveBeenLastCalledWith(engine.puzzles[1]);
  });

  test('wrong answer with no lives triggers game over overlay', () => {
    const engine = new QuizEngine();
    engine.init();

    engine.lives.alive = false;
    engine.handleAnswer(0);
    vi.advanceTimersByTime(2000);

    expect(document.getElementById('game-over').style.display).toBe('flex');
    expect(document.getElementById('game-over-score').textContent).toBe('Score: 0');
  });
});
