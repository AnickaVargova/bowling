let totalScore = 0;
let frameNumber = 1;
let gameOver = false;
let scoreTable = [];

function newGame() {
  console.log("Game started.");
  scoreTable = [];
  frameNumber = 1;
  totalScore = 0;
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
  gameOver
    ? console.log("Game is finished.")
    : console.log("Game is not finished yet.");
  return gameOver;
}

function getPrevious() {
  return scoreTable.length > 1 && scoreTable[scoreTable.length - 2];
}

function getBeforePrevious() {
  return scoreTable.length > 2 && scoreTable[scoreTable.length - 3];
}

function throwBowl(count) {
  let currentFrame =
    scoreTable.length && scoreTable[scoreTable.length && scoreTable.length - 1];
  let isTenth = Boolean(scoreTable.length === 10);

  if (!gameOver) {
    if (
      (!isTenth &&
        currentFrame &&
        currentFrame.rolledPins.length < 2 &&
        !currentFrame.isStrike) ||
      isTenth
    ) {
      currentFrame.rolledPins.push(count);
      currentFrame.frameScore += count;
      if (currentFrame.frameScore === 10) {
        currentFrame.isSpare = true;
      }

      if (frameNumber < 10) {
        frameNumber++;
      } else {
        if (!currentFrame.isSpare && !currentFrame.isStrike) {
          gameOver = true;
        } else {
          if (currentFrame.rolledPins.length === 3) {
            gameOver = true;
          }
        }
      }
    } else {
      let frame = {
        frameId: frameNumber,
        rolledPins: [count],
        frameScore: count,
      };
      if (count === 10) {
        frame.isStrike = true;
        frameNumber++;
      }
      scoreTable.push(frame);

      if (getPrevious().isSpare) {
        getPrevious().frameScore += count;
      }

      if (getPrevious().isStrike && getBeforePrevious().isStrike) {
        getBeforePrevious().frameScore += count;
      }
    }

    if (getPrevious().isStrike && currentFrame.rolledPins.length <= 2) {
      getPrevious().frameScore += count;
    }
  } else {
    newGame();
    console.log("Your sequence is too long. Start new game.");
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
