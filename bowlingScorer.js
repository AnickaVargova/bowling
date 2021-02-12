let score = 0;
let frameNumber = 1;
let gameOver = false;
let scoreTable = [];

function newGame() {
  console.log("Game started.");
  scoreTable = [];
  frameNumber = 1;
  score = 0;
  gameOver = false;
}

function getCurrentState() {
  console.log(scoreTable);
  return scoreTable;
}

function getScore() {
  score = scoreTable.reduce((total, current) => total + current.frameScore, 0);
  if (!gameOver) {
    console.log(
      `Your current score is ${score}. It may not reflect spare and strike bonuses for the last two rounds.`
    );
  } else {
    console.log(`Your total score is ${score}.`);
  }

  return score;
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

  if (gameOver) {
    throw new Error("Game is over.");
  } else {
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
  }
}
module.exports = {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
};
