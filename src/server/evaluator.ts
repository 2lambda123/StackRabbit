const rankLookup = require("./rank-lookup");
const killscreenRanks = require("../../docs/killscreen_ranks");
import * as boardHelper from "./board_helper";
import { getParams } from "./params";
import * as utils from "./utils";
const SquareState = utils.SquareState;
const NUM_ROW = utils.NUM_ROW;
const NUM_COLUMN = utils.NUM_COLUMN;

/** Adjust the surface to not penalize double wells as if they're long bar dependencies */
function correctSurfaceForDoubleWell(
  surfaceArray,
  maxSafeCol9Height
): Array<number> {
  // If col 9 is 2 or more lower than col 8, and it's high up on the board, pretend col 9 is exactly 1 lower than col 8
  if (
    surfaceArray[8] + 1 < surfaceArray[7] &&
    surfaceArray[7] > maxSafeCol9Height &&
    surfaceArray[6] > maxSafeCol9Height
  ) {
    surfaceArray[8] = surfaceArray[7] - 1;
  }
  return surfaceArray;
}

/** Get the rank of the left-3-column surface (killscreen-only) */
function getLeftSurfaceValue(board, aiParams, level) {
  const leftSurface = boardHelper.getLeftSurface(
    board,
    aiParams.MAX_4_TAP_LOOKUP[level] + 3
  );
  return killscreenRanks.RANKS_12HZ_5K[leftSurface] || 0;
}

/** If there is a spire in the middle of the board, return its height above the scare line. Otherwise, return 0. */
function getSpireHeight(surfaceArray, scareHeight) {
  let spireHeight = 0;
  // Col 1 and 9 are covered by left/right accessible factors
  const leftBound = 2;
  const rightBound = 8; // The rightmost column to look for spires
  for (let i = leftBound; i < rightBound; i++) {
    // Only consider columns who are higher than the one on their left, so that
    // nice sloping stacks don't count as spires
    if (surfaceArray[i] > surfaceArray[i - 1]) {
      spireHeight = Math.max(spireHeight, surfaceArray[i]);
    }
  }
  return Math.max(0, spireHeight - scareHeight);
}

/** Gets the average height of the columns (excluding col 10) */
function getAverageHeightAboveScareLine(surfaceArray, scareHeight) {
  let total = 0;
  for (const height of surfaceArray.slice(0, NUM_COLUMN - 1)) {
    total += height;
  }
  const averageHeight = total / 9;
  return Math.max(0, averageHeight - scareHeight);
}

/**
 * Calculates the number of un-filled cells there are below the column 9 height.
 * These cells indicate cells that would need to be filled in before burning is possible.
 * @param {Array<number>} surfaceArray
 */
function getUnableToBurnFactor(surfaceArray, scareHeight) {
  let totalBlocks = 0;
  const surfaceWithoutCol9 = surfaceArray.slice(0, 8);
  const col9Height = surfaceArray[8];
  for (const height of surfaceWithoutCol9) {
    if (height < col9Height) {
      totalBlocks += col9Height - height;
    }
  }
  // Scale the importance based on the height relative to scare height
  const heightMultiplier = surfaceArray[8] / Math.max(scareHeight, 2);
  return totalBlocks * heightMultiplier;
}

function countCol10Holes(board) {
  let count = 0;

  // Go down to the top of the stack in that column
  let row = 0;
  while (row < NUM_ROW && board[row][NUM_COLUMN - 1] == SquareState.EMPTY) {
    row++;
  }
  // Track the full rows we pass through
  while (row < NUM_ROW - 1) {
    row++;
    if (board[row][NUM_COLUMN - 1] === SquareState.EMPTY) {
      count++;
    }
  }
  return count;
}

/** Calculates the number of lines that need to be cleared for all the holes to be resolved. */
function getRowsNeedingToBurn(board, maxDirtyTetrisHeight, aiMode): Set<number> {
  const linesNeededToClear: Set<number> = new Set();
  const rightColBoundary = aiMode === AiMode.DIG ? NUM_COLUMN - 1 : NUM_COLUMN - 2;
  for (let col = 0; col < rightColBoundary; col++) {
    // Go down to the top of the stack in that column
    let row = 0;
    while (row < NUM_ROW && board[row][col] == SquareState.EMPTY) {
      row++;
    }
    // Track the full rows we pass through
    const rowsInStackPassedThrough: Set<number> = new Set();
    while (row < NUM_ROW - 1) {
      rowsInStackPassedThrough.add(row);
      row++;
      if (
        board[row][col] === SquareState.EMPTY &&
        NUM_ROW - row > maxDirtyTetrisHeight
      ) {
        // We found a hole. This row and all the full rows above it will need to be cleared
        linesNeededToClear.add(row);
        for (const line of rowsInStackPassedThrough) {
          linesNeededToClear.add(line);
        }
      }
    }
  }

  return linesNeededToClear;
}

function getColumn9Factor(
  aiParams: AiParams,
  surfaceArray: Array<number>,
  maxSafeCol9Height: number
) {
  if (aiParams.HIGH_COL_9_COEF === 0) {
    return 0;
  }
  const col9HeightAboveComfort = Math.max(
    0,
    surfaceArray[8] - maxSafeCol9Height
  );
  if (col9HeightAboveComfort === 0) {
    return 0;
  }
  return (
    aiParams.HIGH_COL_9_COEF &&
    Math.pow(col9HeightAboveComfort, aiParams.HIGH_COL_9_EXP) *
      aiParams.HIGH_COL_9_COEF
  );
}

/** Calculate a factor that penalizes filling column 10. Specifically, it counts the number of cells
 * in the other columns that would needed to be filled to clear away the block on column 10.
 * However, since holes *want* to have column 10 filled, count them oppositely.
 * Additionally, there's a penalty for the column 10 block being high up.
 */
function getColumn10Factor(
  board,
  scareHeight,
  aiParams,
  rowsNeedingToBurn: Set<number>
) {
  let sum = 0;
  for (let row = 0; row < NUM_ROW; row++) {
    // If column 10 filled, add to the sum
    if (board[row][NUM_COLUMN - 1] == SquareState.FULL) {
      for (let col = 0; col < NUM_COLUMN - 1; col++) {
        if (board[row][col] == SquareState.FULL) {
          continue;
        }

        if (!rowsNeedingToBurn.has(row)) {
          // How bad an exposed col 10 is scales exponentially with height
          const heightMultiplier =
            scareHeight < 2 ? 1 : (NUM_ROW - row) / scareHeight;
          sum += Math.pow(
            heightMultiplier,
            aiParams.COL_10_HEIGHT_MULTIPLIER_EXP
          );
        }
        if (board[row][col] == SquareState.EMPTY) {
        }
      }
    }
  }
  return sum;
}

/** Count the number of blocks in column 10 */
function countBlocksInColumn10(board) {
  let sum = 0;
  for (let row = 0; row < NUM_ROW; row++) {
    // If column 10 filled, add to the sum
    if (board[row][NUM_COLUMN - 1] == SquareState.FULL) {
      sum += 1;
    }
  }
  return sum;
}

function isTetrisReadyRightWell(board) {
  // Move the imaginary long bar down column 10
  let row = 0;
  while (row < NUM_ROW && board[row][9] == SquareState.EMPTY) {
    row++;
  }

  // Check if the 4 rows above the stopping point of the long bar are filled
  for (let checkRow = row - 4; checkRow <= row - 1; checkRow++) {
    for (let checkCol = 0; checkCol < 9; checkCol++) {
      if (checkRow < 0 || checkRow >= NUM_ROW) {
        return false;
      }
      if (board[checkRow][checkCol] == SquareState.EMPTY) {
        return false;
      }
    }
  }

  return true;
}

function getSurfaceValue(surfaceArray: Array<number>, nextPieceId: PieceId) {
  let rawValue = rankLookup.getValueOfBoardSurface(surfaceArray, nextPieceId);
  const A = 150;
  const B = A / 30;
  // console.log(surfaceArray, nextPieceId, rawValue);
  return rawValue + B - A / Math.max(1, rawValue);
}

export function getLineClearValue(numLinesCleared, aiParams) {
  return numLinesCleared == 4
    ? aiParams.TETRIS_BONUS
    : numLinesCleared > 0
    ? aiParams.BURN_COEF * numLinesCleared
    : 0;
}

function getBuiltOutLeftFactor(boardAfter, surfaceArray, scareHeight) {
  if (
    boardHelper.hasHoleInColumn(boardAfter, 0) ||
    boardHelper.hasHoleInColumn(boardAfter, 1)
  ) {
    return 0;
  }
  const col1Height = surfaceArray[0];
  return Math.max(0, col1Height - scareHeight);
}

function getBuiltOutRightFactor(boardAfter, scareHeight) {
  if (
    boardHelper.hasHoleInColumn(boardAfter, NUM_COLUMN - 1) ||
    boardHelper.hasHoleInColumn(boardAfter, NUM_COLUMN - 2)
  ) {
    return 0;
  }
  const col10Height = boardHelper.getBoardHeightAtColumn(
    boardAfter,
    NUM_COLUMN - 1
  );
  return Math.max(0, col10Height - scareHeight);
}

export function rateSurface(surfaceArray): string {
  // Correct the inputs for certain conditions
  const aiParams = getParams();
  let [correctedSurface, _] = utils.correctSurfaceForExtremeGaps(
    surfaceArray.slice(0, 9)
  );
  let surfaceFactorNoNextBox = rankLookup.getValueOfBoardSurface(
    correctedSurface,
    null
  );
  let result = "No next box: " + surfaceFactorNoNextBox.toFixed(2);
  for (const pieceId of utils.POSSIBLE_NEXT_PIECES) {
    result +=
      "\n" +
      pieceId +
      ": " +
      rankLookup.getValueOfBoardSurface(correctedSurface, pieceId).toFixed(2);
  }
  return result;
}

/** An evaluation function that only includes the factors that are super fast to calculate */
export function fastEval(
  possibility: Possibility,
  nextPieceId: PieceId,
  level: number,
  lines: number,
  aiMode: AiMode,
  aiParams: AiParams
) {
  const { surfaceArray, numHoles, numLinesCleared, boardAfter } = possibility;

  if (!aiParams) {
    throw new Error("No AI Params provided: " + aiParams);
  }

  // Preliminary calculations
  const [
    correctedSurface,
    totalHeightCorrected,
  ] = utils.correctSurfaceForExtremeGaps(surfaceArray);
  const adjustedNumHoles =
    numHoles +
    (aiMode === AiMode.KILLSCREEN && countCol10Holes(boardAfter) * 0.7);
  const levelAfterPlacement = utils.getLevelAfterLineClears(
    level,
    lines,
    numLinesCleared
  );
  const scareHeight = utils.getScareHeight(levelAfterPlacement, aiParams);
  const spireHeight = getSpireHeight(surfaceArray, scareHeight);
  const avgHeightAboveScareLine = getAverageHeightAboveScareLine(
    surfaceArray,
    scareHeight
  );

  let extremeGapFactor = totalHeightCorrected * aiParams.EXTREME_GAP_COEF;
  let surfaceFactor =
    aiParams.SURFACE_COEF * getSurfaceValue(correctedSurface, nextPieceId);
  let killscreenSurfaceLeftFactor =
    aiParams.LEFT_SURFACE_COEF *
    getLeftSurfaceValue(boardAfter, aiParams, level);
  const holeFactor = adjustedNumHoles * aiParams.HOLE_COEF;
  const estimatedHoleWeightBurnFactor =
    adjustedNumHoles * (aiParams.BURN_COEF * 3);
  const lineClearFactor = getLineClearValue(numLinesCleared, aiParams);
  const spireHeightFactor =
    aiParams.SPIRE_HEIGHT_COEF *
    Math.pow(spireHeight, aiParams.SPIRE_HEIGHT_EXPONENT);
  const avgHeightFactor =
    aiParams.AVG_HEIGHT_COEF *
    Math.pow(avgHeightAboveScareLine, aiParams.AVG_HEIGHT_EXPONENT);
  const col10BurnFactor =
    countBlocksInColumn10(boardAfter) * aiParams.BURN_COEF; // Any blocks on col 10 will result in a burn

  const factors = {
    surfaceFactor,
    killscreenSurfaceLeftFactor,
    extremeGapFactor,
    holeFactor,
    estimatedHoleWeightBurnFactor,
    lineClearFactor,
    spireHeightFactor,
    avgHeightFactor,
    col10BurnFactor,
  };

  // Sum without explanation for speed purposes.
  let total = 0;
  for (const key in factors) {
    total += factors[key];
  }
  return [total, ""];
}

/**
 * Evaluates a given possibility based on a number of factors.
 * NB: @param nextPieceId CAN be null if you want the NNB value of a possiblity.
 */
export function getValueOfPossibility(
  possibility: Possibility,
  nextPieceId: PieceId,
  level,
  lines,
  aiMode,
  shouldLog,
  aiParams
) {
  const { surfaceArray, numHoles, numLinesCleared, boardAfter } = possibility;

  if (!aiParams) {
    throw new Error("No AI Params provided: " + aiParams);
  }

  // Correct the inputs for certain conditions
  let [
    correctedSurface,
    totalHeightCorrected,
  ] = utils.correctSurfaceForExtremeGaps(surfaceArray);
  const levelAfterPlacement = utils.getLevelAfterLineClears(
    level,
    lines,
    numLinesCleared
  );
  const maxSafeCol9Height = Math.max(
    4,
    aiParams.MAX_4_TAP_LOOKUP[levelAfterPlacement] - 5
  );
  correctedSurface = correctSurfaceForDoubleWell(
    correctedSurface,
    maxSafeCol9Height
  );
  const adjustedNumHoles =
    numHoles +
    (aiMode === AiMode.KILLSCREEN && countCol10Holes(boardAfter) * 0.7);

  // Precompute values needed in calculating the factors
  const scareHeight = utils.getScareHeight(levelAfterPlacement, aiParams);
  const spireHeight = getSpireHeight(surfaceArray, scareHeight);
  const avgHeightAboveScareLine = getAverageHeightAboveScareLine(
    surfaceArray,
    scareHeight
  );
  const tetrisReady = isTetrisReadyRightWell(boardAfter);
  const rowsNeedingToBurn = getRowsNeedingToBurn(
    boardAfter,
    aiParams.MAX_DIRTY_TETRIS_HEIGHT * scareHeight,
    aiMode
  );

  const leftIsInaccessible = boardHelper.boardHasInaccessibileLeft(
    boardAfter,
    levelAfterPlacement,
    aiParams,
    aiMode
  );
  const rightIsInaccessible = boardHelper.boardHasInaccessibileRight(
    boardAfter,
    levelAfterPlacement,
    aiParams
  );

  let extremeGapFactor = totalHeightCorrected * aiParams.EXTREME_GAP_COEF;
  let surfaceFactor =
    aiParams.SURFACE_COEF * getSurfaceValue(correctedSurface, nextPieceId);
  let killscreenSurfaceLeftFactor =
    aiParams.LEFT_SURFACE_COEF *
    getLeftSurfaceValue(boardAfter, aiParams, level);
  const tetrisReadyFactor = tetrisReady ? aiParams.TETRIS_READY_BONUS : 0;
  const holeFactor = adjustedNumHoles * aiParams.HOLE_COEF;
  const holeWeightFactor = rowsNeedingToBurn.size * aiParams.HOLE_WEIGHT_COEF;
  const holeWeightBurnFactor = rowsNeedingToBurn.size * aiParams.BURN_COEF;
  const lineClearFactor = getLineClearValue(numLinesCleared, aiParams);
  const spireHeightFactor =
    aiParams.SPIRE_HEIGHT_COEF *
    Math.pow(spireHeight, aiParams.SPIRE_HEIGHT_EXPONENT);
  const avgHeightFactor =
    aiParams.AVG_HEIGHT_COEF *
    Math.pow(avgHeightAboveScareLine, aiParams.AVG_HEIGHT_EXPONENT);
  const col10Factor =
    getColumn10Factor(boardAfter, scareHeight, aiParams, rowsNeedingToBurn) *
    aiParams.COL_10_COEF;
  const col10BurnFactor =
    countBlocksInColumn10(boardAfter) * aiParams.BURN_COEF; // Any blocks on col 10 will result in a burn
  const col9Factor = getColumn9Factor(
    aiParams,
    surfaceArray,
    maxSafeCol9Height
  );
  const unableToBurnFactor =
    aiParams.UNABLE_TO_BURN_COEF *
    getUnableToBurnFactor(surfaceArray, scareHeight);
  const builtOutLeftFactor =
    aiParams.BUILT_OUT_LEFT_COEF *
    getBuiltOutLeftFactor(boardAfter, surfaceArray, scareHeight);
  const builtOutRightFactor =
    aiParams.BUILT_OUT_RIGHT_COEF *
    getBuiltOutRightFactor(boardAfter, scareHeight);
  const inaccessibleLeftFactor = leftIsInaccessible
    ? aiParams.INACCESSIBLE_LEFT_COEF
    : 0;
  const inaccessibleRightFactor = rightIsInaccessible
    ? aiParams.INACCESSIBLE_RIGHT_COEF
    : 0;

  const factors = {
    surfaceFactor,
    killscreenSurfaceLeftFactor,
    extremeGapFactor,
    holeFactor,
    holeWeightFactor,
    holeWeightBurnFactor,
    lineClearFactor,
    spireHeightFactor,
    avgHeightFactor,
    col10Factor,
    col10BurnFactor,
    unableToBurnFactor,
    col9Factor,
    tetrisReadyFactor,
    builtOutLeftFactor,
    builtOutRightFactor,
    inaccessibleLeftFactor,
    inaccessibleRightFactor,
  };

  const [totalValue, explanation] = compileFactors(factors, aiMode);

  if (shouldLog) {
    console.log(
      `---- Evaluated possiblity: ${possibility.placement}, mode: ${aiMode}\n`,
      explanation
    );
  }

  return [totalValue, explanation];
}

function compileFactors(factors: Object, aiMode: AiMode): [number, string] {
  let totalValue = 0;
  let explanation = "";
  for (const key in factors) {
    const val = factors[key];

    // Crash instantly if any of the factors are NaN (it's better than still running and making bad placements)
    if (isNaN(val)) {
      throw new Error(`NaN detected for factor: ${key}`);
    }

    totalValue += val;
    const shortKeyName = key.substr(0, key.length - 6);
    explanation += `${shortKeyName}: ${val.toFixed(2)}, `;
  }
  explanation += `SUBTOTAL: ${totalValue}, `;
  explanation += `Mode: ${aiMode}`;

  return [totalValue, explanation];
}
