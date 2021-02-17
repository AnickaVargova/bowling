let scoreTable = [];

function newGame(verbose = false) {
  if (verbose) {
    console.log("Game started.");
  }
  scoreTable = [];
}

function getCurrentState() {
  return scoreTable;
}

function getScore(verbose = false) {
  let score = scoreTable
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
    if (!isGameFinished()) {
      if (scoreWithoutCurrentFrameBonus) {
        return `Your current score is ${score}. It doesn't include the bonus for the last frame.`;
      } else if (scoreWithoutTwoFrameBonuses) {
        return `Your current score is ${score}. The strike bonus for the last two frames is not complete.`;
      } else if (scoreWithoutPreviousFrameBonus) {
        return `Your current score is ${score}. The strike bonus for the previous frame is not complete.`;
      } else return `Your current score is ${score}.`;
    } else {
      return `Your total score is ${score}.`;
    }
  } else {
    return score;
  }
}

function isGameFinished() {
  if (
    scoreTable.length === 10 &&
    ((!getCurrent().isSpare &&
      !getCurrent().isStrike &&
      getCurrent().rolledPins.length === 2) ||
      getCurrent().rolledPins.length === 3)
  ) {
    return true;
  } else {
    return false;
  }
}

function getCurrent() {
  return scoreTable.length && scoreTable[scoreTable.length - 1];
}

function getPrevious() {
  return scoreTable.length > 1 && scoreTable[scoreTable.length - 2];
}

function getBeforePrevious() {
  return scoreTable.length > 2 && scoreTable[scoreTable.length - 3];
}

function getFrameNumber() {
  return scoreTable.length + 1;
}

function throwBowl(count) {
  let currentFrame = getCurrent();
  let isTenth = Boolean(scoreTable.length === 10);

  if (isGameFinished()) {
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
  } else {
    let frame = {
      frameId: getFrameNumber(),
      rolledPins: [count],
      frameScore: count,
    };
    if (count === 10) {
      frame.isStrike = true;
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
