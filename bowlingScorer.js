let score = 0;
let frameNumber = 1;
let gameOver = false;
let scoreTable = [];

function newGame(verbose = false) {
  if (verbose) {
    console.log("Game started.");
  }
  scoreTable = [];
  frameNumber = 1;
  score = 0;
  gameOver = false;
}

function getCurrentState() {
  return scoreTable;
}

function getScore(verbose = false) {
  score = scoreTable.reduce((total, current) => total + current.frameScore, 0);
  let scoreWithoutCurrentFrameBonus = Boolean(
    getCurrent().isSpare || (getCurrent().isStrike && !getPrevious().isStrike)
  );
  let scoreWithoutTwoFrameBonuses = Boolean(
    getCurrent().isStrike && getPrevious().isStrike
  );
  let scoreWithoutPreviousFrameBonus = Boolean(
    getCurrent().rolledPins.length === 1 && getPrevious().isStrike
  );

  if (verbose) {
    if (!gameOver) {
      if (scoreWithoutCurrentFrameBonus) {
        return `Your current score is ${score}. It doesn't include the bonus for the last frame.`;
      } else if (scoreWithoutTwoFrameBonuses) {
        return `Your current score is ${score}. The strike bonus for the last two frames is not complete.`;
      } else if (scoreWithoutPreviousFrameBonus) {
        return `Your current score is ${score}. The strike bonus for the previous frame is not complete.`;
      }
    } else {
      return `Your total score is ${score}.`;
    }
  } else {
    return score;
  }
}

function isGameFinished(verbose = false) {
  if (verbose) {
    return gameOver ? "Game is finished." : "Game is not finished.";
  } else {
    return gameOver;
  }
}

function getCurrent() {
  return (
    scoreTable.length && scoreTable[scoreTable.length && scoreTable.length - 1]
  );
}

function getPrevious() {
  return scoreTable.length > 1 && scoreTable[scoreTable.length - 2];
}

function getBeforePrevious() {
  return scoreTable.length > 2 && scoreTable[scoreTable.length - 3];
}

function throwBowl(count) {
  let currentFrame = getCurrent();
  let isTenth = Boolean(scoreTable.length === 10);

  if (gameOver) {
    throw "Game is over.";
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
      } else if (
        (!currentFrame.isSpare && !currentFrame.isStrike) ||
        currentFrame.rolledPins.length === 3
      ) {
        gameOver = true;
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

    // if (
    //   (!isTenth && currentFrame.frameScore > 10) ||
    //   (isTenth && currentFrame.frameScore > 30)
    // ) {
    //   console.log(`${currentFrame.frameId} exceeded limit`);
    // }
  }
}
module.exports = {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
};
