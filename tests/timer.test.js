const GameTimer = require('../components/timer.js');

describe('GameTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    document.body.innerHTML = '<div id="wrap"><span id="t"></span></div>';
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test('counts down and calls timeup callback', () => {
    const callback = vi.fn();
    const timer = new GameTimer(2, callback);
    const el = document.getElementById('t');

    timer.start(el);
    expect(el.textContent).toBe('0:02');

    vi.advanceTimersByTime(1000);
    expect(el.textContent).toBe('0:01');
    expect(callback).not.toHaveBeenCalled();

    vi.advanceTimersByTime(1000);
    expect(el.textContent).toBe('0:00');
    expect(callback).toHaveBeenCalledWith('timeup');
  });

  test('stop prevents further countdown', () => {
    const callback = vi.fn();
    const timer = new GameTimer(5, callback);
    const el = document.getElementById('t');

    timer.start(el);
    vi.advanceTimersByTime(1000);
    timer.stop();
    vi.advanceTimersByTime(5000);

    expect(timer.timeLeft).toBe(4);
    expect(callback).not.toHaveBeenCalled();
  });
});
