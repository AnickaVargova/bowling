"use strict";
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

// Example usage: run 'node index' in terminal.
newGame();
throwBowl(1);
throwBowl(3);
throwBowl(10);
throwBowl(5);
throwBowl(3);
getCurrentState();
isGameFinished();
getScore();
