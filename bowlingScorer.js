let scoreTable = [];
const VERBOSE = false;

function newGame(_verbose) {
  _verbose = VERBOSE;
  if (_verbose) {
    console.log("Game started.");
  }
  scoreTable = [];
}

function getCurrentState() {
  return scoreTable;
}

function getScore(_verbose) {
  let score = 0;
  _verbose = VERBOSE;
  if (scoreTable.length === 0) {
    return score;
  }

  score = scoreTable
    .map(
      (current) =>
        current.frameScore +
        (current.spareBonus || 0) +
        (current.strikeBonus || 0)
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
    getCurrent()?.rolledPins.length === 1 && isStrike(getPrevious())
  );

  if (_verbose) {
    if (!isGameFinished()) {
      if (scoreWithoutCurrentFrameBonus) {
        console.log(
          `Your current score is ${score}. It doesn't include the bonus for the last frame.`
        );
      } else if (scoreWithoutTwoFrameBonuses) {
        console.log(
          `Your current score is ${score}. The strike bonus for the last two frames is not complete.`
        );
      } else if (scoreWithoutPreviousFrameBonus) {
        console.log(
          `Your current score is ${score}. The strike bonus for the previous frame is not complete.`
        );
      } else console.log(`Your current score is ${score}.`);
    } else {
      console.log(`Your total score is ${score}.`);
    }
  }
  return score;
}

function isGameFinished() {
  return (
    scoreTable.length === 10 &&
    ((!isSpare(getCurrent()) &&
      !isStrike(getCurrent()) &&
      getCurrent().rolledPins.length === 2) ||
      getCurrent().rolledPins.length === 3)
  );
}

function getCurrent() {
  return scoreTable.length ? scoreTable[scoreTable.length - 1] : null;
}

function getPrevious() {
  return scoreTable.length > 1 ? scoreTable[scoreTable.length - 2] : null;
}

function getBeforePrevious() {
  return scoreTable.length > 2 ? scoreTable[scoreTable.length - 3] : null;
}

function setFrameNumber() {
  return scoreTable.length + 1;
}

function isSpare(frame) {
  return frame?.rolledPins.length === 2 && frame.frameScore === 10;
}

function isStrike(frame) {
  return frame?.rolledPins && frame.rolledPins[0] === 10;
}

function throwBowl(count) {
  let isTenth = Boolean(scoreTable.length === 10);

  if (isGameFinished()) {
    throw new Error("Game is over.");
  }
  if (
    isTenth ||
    (getCurrent()?.rolledPins.length < 2 && !isStrike(getCurrent()))
  ) {
    getCurrent().rolledPins.push(count);
    getCurrent().frameScore += count;
  } else {
    let frame = {
      frameId: setFrameNumber(),
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

  if (isStrike(getPrevious()) && getCurrent()?.rolledPins.length <= 2) {
    getPrevious().strikeBonus
      ? (getPrevious().strikeBonus += count)
      : (getPrevious().strikeBonus = count);
  }

  if (
    (getCurrent()?.rolledPins.length === 1 && getCurrent()?.frameScore > 10) ||
    (getCurrent()?.rolledPins.length === 2 &&
      ((!(isTenth && isStrike(getCurrent())) &&
        getCurrent()?.frameScore > 10) ||
        (isStrike(getCurrent()) && getCurrent()?.frameScore > 20))) ||
    (isTenth &&
      ((isStrike(getCurrent()) && getCurrent()?.frameScore > 30) ||
        (getCurrent().rolledPins[0] + getCurrent().rolledPins[1] === 10 &&
          getCurrent()?.frameScore > 20)))
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
  VERBOSE,
};
