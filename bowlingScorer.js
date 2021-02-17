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
    isSpare(getCurrent()) ||
      (isStrike(getCurrent()) && !isStrike(getPrevious()))
  );
  let scoreWithoutTwoFrameBonuses = Boolean(
    isStrike(getCurrent()) && isStrike(getPrevious())
  );
  let scoreWithoutPreviousFrameBonus = Boolean(
    getCurrent().rolledPins.length === 1 && isStrike(getPrevious())
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
    ((!isSpare(getCurrent()) &&
      !isStrike(getCurrent()) &&
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

function isSpare(frame) {
  if (
    frame.rolledPins &&
    frame.rolledPins.length === 2 &&
    frame.frameScore === 10
  ) {
    return true;
  }
  return false;
}

function isStrike(frame) {
  if (frame.rolledPins && frame.rolledPins[0] === 10) {
    return true;
  }
  return false;
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
      !isStrike(currentFrame))
  ) {
    currentFrame.rolledPins.push(count);
    currentFrame.frameScore += count;
  } else {
    let frame = {
      frameId: getFrameNumber(),
      rolledPins: [count],
      frameScore: count,
    };

    scoreTable.push(frame);

    if (isSpare(getPrevious())) {
      getPrevious().spareBonus = count;
    }

    if (isStrike(getPrevious()) && isStrike(getBeforePrevious())) {
      getBeforePrevious().strikeBonus += count;
    }
  }

  if (isStrike(getPrevious()) && currentFrame.rolledPins.length <= 2) {
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
