const MCQ = require('../components/mcq.js');

function createQuizDom() {
  document.body.innerHTML = `
    <div id="quiz-area">
      <div id="question-text"></div>
      <div id="options-container"></div>
      <div id="explanation" style="display:none;"></div>
    </div>
  `;
  return document.getElementById('quiz-area');
}

describe('MCQ', () => {
  test('render shows question and options', () => {
    const container = createQuizDom();
    const mcq = new MCQ(container);

    mcq.render({
      question: 'Q1',
      options: ['A', 'B', 'C'],
      correct: 1,
      explanation: 'Because'
    });

    expect(container.querySelector('#question-text').textContent).toBe('Q1');
    expect(container.querySelectorAll('.option-btn').length).toBe(3);
  });

  test('click selects once and locks further answers', () => {
    const container = createQuizDom();
    const mcq = new MCQ(container);
    mcq.onAnswer = vi.fn();

    mcq.render({
      question: 'Q1',
      options: ['A', 'B'],
      correct: 0,
      explanation: 'Because'
    });

    const buttons = container.querySelectorAll('.option-btn');
    buttons[1].click();
    buttons[0].click();

    expect(mcq.onAnswer).toHaveBeenCalledTimes(1);
    expect(mcq.onAnswer).toHaveBeenCalledWith(1);
  });

  test('showResult marks correct/wrong and displays explanation', () => {
    const container = createQuizDom();
    const mcq = new MCQ(container);

    mcq.render({
      question: 'Q1',
      options: ['A', 'B'],
      correct: 0,
      explanation: 'Because'
    });

    const buttons = container.querySelectorAll('.option-btn');
    buttons[1].click();
    mcq.showResult(0, 'Because');

    expect(buttons[0].classList.contains('correct-answer')).toBe(true);
    expect(buttons[1].classList.contains('wrong-answer')).toBe(true);

    const explanation = container.querySelector('#explanation');
    expect(explanation.style.display).toBe('block');
    expect(explanation.textContent).toBe('Because');
  });
});
