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
  score = scoreTable
    .map(
      (current) =>
        current.frameScore +
        (current.spareBonus ?? 0) +
        (current.strikeBonus ?? 0)
    )
    .reduce((total, current) => total + current, 0);

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
      } else return "";
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
    throw new Error("Game is over.");
  }
  if (
    isTenth ||
    (currentFrame &&
      currentFrame.rolledPins.length < 2 &&
      !currentFrame.isStrike)
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
      getPrevious().spareBonus = count;
    }

    if (getPrevious().isStrike && getBeforePrevious().isStrike) {
      getBeforePrevious().strikeBonus += count;
    }
  }

  if (getPrevious().isStrike && currentFrame.rolledPins.length <= 2) {
    getPrevious().strikeBonus
      ? (getPrevious().strikeBonus += count)
      : (getPrevious().strikeBonus = count);
  }

  if (
    (!isTenth && currentFrame.frameScore > 10) ||
    (isTenth && currentFrame.frameScore > 30)
  ) {
    throw new Error("Maximum number of pins is exceeded.");
  }
}

module.exports = {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
};
