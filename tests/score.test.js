const GameScore = require('../components/score.js');

describe('GameScore', () => {
  test('addPoints updates score and UI text', () => {
    document.body.innerHTML = '<div id="score"></div>';
    const el = document.getElementById('score');

    const score = new GameScore();
    score.init(el);
    score.addPoints(25);

    expect(score.getScore()).toBe(25);
    expect(el.textContent).toBe('Score: 25');
  });

  test('reset zeroes score and display', () => {
    document.body.innerHTML = '<div id="score"></div>';
    const el = document.getElementById('score');

    const score = new GameScore();
    score.init(el);
    score.addPoints(50);
    score.reset();

    expect(score.getScore()).toBe(0);
    expect(el.textContent).toBe('Score: 0');
  });
});
