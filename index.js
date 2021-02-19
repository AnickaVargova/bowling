"use strict";
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
  VERBOSE,
} = require("./bowlingScorer");

newGame(VERBOSE);

//Usage example: run 'node index' in your terminal.

throwBowl(1);
throwBowl(3);
throwBowl(5);
throwBowl(5);
throwBowl(3);

console.log(getCurrentState());
console.log(isGameFinished());
console.log(getScore(VERBOSE));
