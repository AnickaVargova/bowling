let totalScore = 0;
let frameNumber = 1;
let turnNumber = 1;
let isSpare = false;
let isTenth = false;
let gameOver = false;
let scoreTable = [];

function newGame() {
  scoreTable = [];
  frameNumber = 1;
  turnNumber = 1;
  totalScore = 0;
  isSpare = false;
  isTenth = false;
  gameOver = false;
}

function getCurrentState() {
  return scoreTable;
}

function getTotalScore() {
  totalScore = scoreTable.reduce(
    (total, current) => total + current.frameScore,
    0
  );
  return totalScore;
}

function isGameFinished() {
  return gameOver;
}

function throwBowl(count) {
  let current = scoreTable.length && scoreTable[scoreTable.length - 1];
  let beforeCurrent =
    scoreTable.length > 1 && scoreTable[scoreTable.length - 2];
  if (turnNumber === 1) {
    let frame = {
      frameId: frameNumber,
      rolledPins: [count],
      frameScore: count,
    };
    if (count === 10) {
      frame.isStrike = true;
      frame.addingCounter = 0;
      frameNumber++;
    }
    if (isSpare) {
      current.frameScore += count;
    }
    if (current.isStrike) {
      current.frameScore += count;
      current.addingCounter++;
    }
    if (
      beforeCurrent &&
      beforeCurrent.isStrike &&
      beforeCurrent.addingCounter < 2
    ) {
      beforeCurrent.frameScore += count;
      beforeCurrent.addingCounter++;
    }
    scoreTable.push(frame);
    if (scoreTable.length === 10) {
      isTenth = true;
    }
    if (!frame.isStrike || (frame.isStrike && isTenth)) {
      turnNumber++;
    }
    isSpare = false;
  } else if (turnNumber === 2) {
    current.rolledPins = [...current.rolledPins, count];
    if (beforeCurrent.isStrike) {
      beforeCurrent.frameScore += count;
      beforeCurrent.addingCounter++;
    }
    current.frameScore = current.frameScore + count;
    isSpare = current.frameScore === 10 ? true : false;
    frameNumber++;
    isTenth && (isSpare || current.isStrike) ? turnNumber++ : (turnNumber = 1);
    gameOver = isTenth && !isSpare && !current.isStrike ? true : false;
  } else if (turnNumber === 3) {
    current.rolledPins = [...current.rolledPins, count];
    current.frameScore += count;
    gameOver = true;
  }
}

module.exports = {
  newGame,
  getCurrentState,
  getTotalScore,
  isGameFinished,
  throwBowl,
  scoreTable,
};
