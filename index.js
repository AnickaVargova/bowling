"use strict";
const {
  newGame,
  getCurrentState,
  getTotalScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

// Exemple usage: run 'node index' in node console.
newGame();
throwBowl(1);
throwBowl(3);
throwBowl(10);
throwBowl(5);
throwBowl(3);
console.log(getCurrentState());
isGameFinished();
console.log(getTotalScore());
