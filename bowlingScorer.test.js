const { describe, test } = require("@jest/globals");
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

const testSada0 = [
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
  5,
];
//150
const testSada1 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
//300
const testSada2 = [9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0];
//90
const testSada3 = [9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9, 0, 9];

const testSada4 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
const testSada5 = [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5];
const testSada6 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];

function testSequence(sequence) {
  newGame();
  for (let item of sequence) {
    throwBowl(item);
  }
  return getScore();
}

function testGameFinished(sequence) {
  newGame();
  for (let item of sequence) {
    throwBowl(item);
  }
  return isGameFinished();
}

function testCurrentState(arr) {
  newGame();
  for (let item of arr) {
    throwBowl(item);
  }
  return getCurrentState();
}

describe("testScore", () => {
  test("10 pairs with spare and a final", () => {
    expect(testSequence(testSada0)).toBe(150);
  });
  test("maximum sequence", () => {
    expect(testSequence(testSada1)).toBe(300);
  });
  test("ordinary sequence", () => {
    expect(testSequence(testSada2)).toBe(90);
  });
});

describe("gameFinished", () => {
  test("10 pairs with spare and a final", () => {
    expect(testGameFinished(testSada0)).toBe(true);
  });
  test("maximum sequence", () => {
    expect(testGameFinished(testSada1)).toBe(true);
  });
  test("ordinary sequence ", () => {
    expect(testGameFinished(testSada2)).toBe(true);
  });
  test("incomplete ordinary sequence", () => {
    expect(testGameFinished(testSada3)).toBe(false);
  });
  test("incomplete maximum sequence", () => {
    expect(testGameFinished(testSada4)).toBe(false);
  });
  test("10 pairs with a spare without a final", () => {
    expect(testGameFinished(testSada5)).toBe(false);
  });
});

describe("currentState", () => {
  test("simple sequence", () => {
    expect(testCurrentState([2, 3, 4, 5])).toEqual([
      { frameId: 1, rolledPins: [2, 3], frameScore: 5 },
      { frameId: 2, rolledPins: [4, 5], frameScore: 9 },
    ]);
  });
  test("sequence with a spare", () => {
    expect(testCurrentState([5, 5, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [5, 5],
        frameScore: 10,
        isSpare: true,
        spareBonus: 3,
      },
      { frameId: 2, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence with a strike", () => {
    expect(testCurrentState([10, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [10],
        frameScore: 10,
        isStrike: true,
        strikeBonus: 9,
      },
      { frameId: 2, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence with two subsequent strikes", () => {
    expect(testCurrentState([10, 10, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [10],
        frameScore: 10,
        isStrike: true,
        strikeBonus: 13,
      },
      {
        frameId: 2,
        rolledPins: [10],
        frameScore: 10,
        isStrike: true,
        strikeBonus: 9,
      },
      { frameId: 3, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence exceeding maximum length", () => {
    expect(() => testCurrentState(testSada6)).toThrow("Game is over.");
  });
});
