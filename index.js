"use strict";
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

//Usage example: run 'node index' in your terminal.
newGame();
throwBowl(1);
throwBowl(3);
throwBowl(5);
throwBowl(5);
throwBowl(3);

console.log(getCurrentState());
console.log(isGameFinished());
console.log(getScore());
