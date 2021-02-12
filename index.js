"use strict";
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

//Usage example: run 'node index' in your terminal.
newGame(true);
throwBowl(1);
throwBowl(3);
throwBowl(5);
throwBowl(10);

console.log(getCurrentState());
console.log(isGameFinished(true));
console.log(getScore(true));
