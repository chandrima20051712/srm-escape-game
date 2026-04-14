const Storage = require('../js/storage.js');

describe('Storage', () => {
  test('load returns defaults when nothing is saved', () => {
    expect(Storage.load()).toEqual({
      completed: [],
      scores: {},
      totalScore: 0
    });
  });

  test('complete tracks attempts and best score', () => {
    Storage.complete('lib', 80);
    const afterSecond = Storage.complete('lib', 60);

    expect(afterSecond.completed).toContain('lib');
    expect(afterSecond.scores.lib).toEqual({
      best: 80,
      last: 60,
      attempts: 2
    });
    expect(afterSecond.totalScore).toBe(80);
  });

  test('isUnlocked depends on previous building completion', () => {
    const order = ['a', 'b', 'c'];
    expect(Storage.isUnlocked('a', order)).toBe(true);
    expect(Storage.isUnlocked('b', order)).toBe(false);

    Storage.complete('a', 10);
    expect(Storage.isUnlocked('b', order)).toBe(true);
  });
});
