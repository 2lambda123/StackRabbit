const { AI_MODE } = require("./params");

const utils = require("./utils");
const SquareState = utils.SquareState;
const NUM_ROW = utils.NUM_ROW;
const NUM_COLUMN = utils.NUM_COLUMN;

function getAiMode(board, lines, level, aiParams) {
  if (level >= 29) {
    return AI_MODE.KILLSCREEN;
  }
  if (lines >= 220) {
    return AI_MODE.NEAR_KILLSCREEN;
  }
  if (shouldUseDigMode(board, aiParams)) {
    return AI_MODE.DIG;
  }
  return AI_MODE.STANDARD;
}

/** The logic here is quite complex, it's a shame it has to be manually coded instead of trained.
 * Current logic:
 *  - If you have a high-up hole that is blocking the well, go dig it out immediately
 *  - If the hole is in the tetris zone, go dig it
 *  - If the hole doesn't have many filled lines above it, go dig it
 *  - Otherwise, play on and plan to play a few rows off the bottom
 */
function shouldUseDigMode(board, aiParams) {
  // Calculate where the next Tetris will be built
  let row = 0;
  while (row < NUM_ROW && board[row][9] == SquareState.EMPTY) {
    row++;
  }
  const tetrisZoneStart = row - 4;
  const tetrisZoneEnd = row - 1;

  function holeWarrantsDigging(row, firstFullRow) {
    const blockingWell = board[row][NUM_COLUMN - 1] === SquareState.FULL;
    return (
      (blockingWell && NUM_ROW - row > aiParams.MAX_DIRTY_TETRIS_HEIGHT) ||
      (row >= tetrisZoneStart && row < tetrisZoneEnd) ||
      row - firstFullRow < 4
    );
  }

  // Check for holes that are either in the Tetris zone or have <= 3 full lines above them (are reasonably accessible with burns)
  for (let col = 0; col < NUM_COLUMN - 1; col++) {
    // Navigate past the empty space above each column
    let row = 0;
    while (row < NUM_ROW && board[row][col] === SquareState.EMPTY) {
      row++;
    }
    const firstFullRow = row;

    // Now that we're in the stack, if there are empty cells, they're holes
    while (row < NUM_ROW - 1) {
      row++;
      if (board[row][col] === SquareState.EMPTY) {
        // Found hole
        if (holeWarrantsDigging(row, firstFullRow)) {
          return true;
        }
      }
    }
  }
  return false;
}

module.exports = {
  getAiMode,
};