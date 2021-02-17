"use strict";
const {
  newGame,
  getCurrentState,
  getScore,
  isGameFinished,
  throwBowl,
} = require("./bowlingScorer");

const testSet1 = [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10];
//300
newGame();
for (let item of testSet1) {
  throwBowl(item);
}
//Usage example: run 'node index' in your terminal.

// throwBowl(1);
// throwBowl(3);
// throwBowl(5);
// throwBowl(5);
// throwBowl(3);

console.log(getCurrentState());
console.log(isGameFinished());
console.log(getScore(true));
