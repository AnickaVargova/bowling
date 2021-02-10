const { describe, test } = require("@jest/globals");
const {
  newGame,
  getCurrentState,
  getTotalScore,
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
//90

function testSequence(sequence) {
  newGame();
  for (let item of sequence) {
    throwBowl(item);
  }
  return getTotalScore();
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
  test("getTotalScore0", () => {
    expect(testSequence(testSada0)).toBe(150);
  });
  test("getTotalScore1", () => {
    expect(testSequence(testSada1)).toBe(300);
  });
  test("getTotalScore2", () => {
    expect(testSequence(testSada2)).toBe(90);
  });
});

describe("gameFinished", () => {
  test("testGameFinished0", () => {
    expect(testGameFinished(testSada0)).toBe(true);
  });
  test("testGameFinished1", () => {
    expect(testGameFinished(testSada1)).toBe(true);
  });
  test("testGameFinished2", () => {
    expect(testGameFinished(testSada2)).toBe(true);
  });
  test("testGameFinished3", () => {
    expect(testGameFinished(testSada3)).toBe(false);
  });
});

describe("currentState", () => {
  test("simpleSequence", () => {
    expect(testCurrentState([2, 3, 4, 5])).toEqual([
      { frameId: 1, rolledPins: [2, 3], frameScore: 5 },
      { frameId: 2, rolledPins: [4, 5], frameScore: 9 },
    ]);
  });
  test("sequence with spare", () => {
    expect(testCurrentState([5, 5, 3, 6])).toEqual([
      { frameId: 1, rolledPins: [5, 5], frameScore: 13 },
      { frameId: 2, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence with strike", () => {
    expect(testCurrentState([10, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [10],
        frameScore: 19,
        isStrike: true,
        addingCounter: 2,
      },
      { frameId: 2, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
  test("sequence with two subsequent strikes", () => {
    expect(testCurrentState([10, 10, 3, 6])).toEqual([
      {
        frameId: 1,
        rolledPins: [10],
        frameScore: 23,
        isStrike: true,
        addingCounter: 2,
      },
      {
        frameId: 2,
        rolledPins: [10],
        frameScore: 19,
        isStrike: true,
        addingCounter: 2,
      },
      { frameId: 3, rolledPins: [3, 6], frameScore: 9 },
    ]);
  });
});
