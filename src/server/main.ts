const evaluator = require("./evaluator");
const aiModeManager = require("./ai_mode_manager");
const BoardHelper = require("./board_helper");
const { NUM_TO_CONSIDER, modifyParamsForAiMode } = require("./params");
import * as utils from "./utils";

/**
 * Iterates over the list of possiblities and return the one with the highest value.
 * @param {Array<possibility obj>} possibilityList
 */
function pickBestNMoves(
  possibilityList,
  nextPieceId,
  level,
  lines,
  aiMode,
  numMovesToConsider,
  aiParams
) {
  for (const possibility of possibilityList) {
    const [value, explanation] = evaluator.getValueOfPossibility(
      possibility,
      nextPieceId,
      level,
      lines,
      aiMode,
      /* shouldLog= */ false,
      aiParams
    );
    possibility.evalScore = value as number;
    possibility.evalExplanation = explanation as string;
  }
  // Sort by value
  possibilityList.sort((a, b) => b.evalScore - a.evalScore);

  return possibilityList.slice(0, numMovesToConsider);
}

/**
 * Finds the N highest valued moves, without doing any search into placements of the next piece.
 * Can be called with or without a next piece, and will function accordingly.
 */
function getMostPromisingMoves(
  startingBoard,
  currentPieceId,
  nextPieceId,
  level,
  lines,
  existingXOffset,
  existingYOffset,
  firstShiftDelay,
  existingRotation,
  shouldLog,
  aiParams,
  paramMods
) {
  // Get the possible moves
  const possibilityList = BoardHelper.getPossibleMoves(
    startingBoard,
    currentPieceId,
    level,
    existingXOffset,
    existingYOffset,
    aiParams.TAP_ARR,
    firstShiftDelay,
    existingRotation,
    /* shouldLog= */ false && shouldLog
  );

  // Get the AI mode (e.g. digging, scoring)
  const aiMode = aiModeManager.getAiMode(startingBoard, lines, level, aiParams);
  aiParams = modifyParamsForAiMode(aiParams, aiMode, paramMods);

  // Get the top contenders, sorted best -> worst
  const topN = pickBestNMoves(
    possibilityList,
    nextPieceId,
    level,
    lines,
    aiMode,
    NUM_TO_CONSIDER,
    aiParams
  );
  return { topN, aiMode, aiParams };
}

function getBestMoveNoSearch(
  startingBoard,
  currentPieceId,
  nextPieceId,
  level,
  lines,
  existingXOffset,
  existingYOffset,
  firstShiftDelay,
  existingRotation,
  shouldLog,
  initialAiParams,
  paramMods
) {
  let { topN } = getMostPromisingMoves(
    startingBoard,
    currentPieceId,
    nextPieceId,
    level,
    lines,
    existingXOffset,
    existingYOffset,
    firstShiftDelay,
    existingRotation,
    shouldLog,
    initialAiParams,
    paramMods
  );
  if (shouldLog) {
    topN.forEach((x) => {
      console.log(`${x.placement} : surface ${x.surfaceArray}, holes ${x.numHoles}, score ${x.evalScore}`);
      console.log(x.explanation);
    });
  }
  return topN ? topN[0] : null;
}

function getBestMoveWithSearch(
  startingBoard,
  currentPieceId,
  nextPieceId,
  level,
  lines,
  existingXOffset,
  existingYOffset,
  firstShiftDelay,
  existingRotation,
  shouldLog,
  initialAiParams,
  paramMods
) {
  const startTime = Date.now();

  const { topN, aiMode, aiParams } = getMostPromisingMoves(
    startingBoard,
    currentPieceId,
    nextPieceId,
    level,
    lines,
    existingXOffset,
    existingYOffset,
    firstShiftDelay,
    existingRotation,
    shouldLog,
    initialAiParams,
    paramMods
  );

  const time2 = Date.now();
  if (shouldLog) {
    console.log("\tElapsed to get N most promising moves:", time2 - startTime);
    console.log("Num promising moves:", topN.length);
    console.log(
      "Promising moves",
      topN.map((x) => x.placement)
    );
    console.log("\n\n---------");
  }

  // For each contender, place the next piece and maximize the resulting value
  let bestPossibilityAfterNextPiece = null;
  let bestValueAfterNextPiece = Number.MIN_SAFE_INTEGER;
  let bestIndex = 0; // The rank of the best placement (in terms of the original 'promising-ness' sort)
  let i = 0;

  const chainPossibilityList = [];
  for (const outerPossibility of topN) {
    i++;
    // Place the next piece in each possibility
    const levelAfter = utils.getLevelAfterLineClears(level, lines, outerPossibility.numLinesCleared);
    const innerPossibilityList = BoardHelper.getPossibleMoves(
      outerPossibility.boardAfter,
      nextPieceId,
      levelAfter,
      /* existingXOffset= */ 0,
      /* existingYOffset= */ 0,
      aiParams.TAP_ARR,
      aiParams.FIRST_TAP_DELAY,
      /* existingRotation= */ 0,
      /* shouldLog= */ false && shouldLog
    );
    const innerTopN = pickBestNMoves(
      innerPossibilityList,
      null,
      levelAfter,
      lines + outerPossibility.numLinesCleared,
      aiMode,
      1,
      aiParams
    );
    if (innerTopN.length == 0) {
      continue;
    }

    // Get a total score for this possibility (including line clears from the outer placement)
    const innerBestMove = innerTopN[0];
    const originalMovePartialValue = evaluator.getLineClearValue(
      outerPossibility.numLinesCleared,
      aiParams
    );
    const totalValue = innerBestMove.evalScore + originalMovePartialValue;

    // If new best, update local vars
    if (totalValue > bestValueAfterNextPiece) {
      bestValueAfterNextPiece = totalValue;
      bestPossibilityAfterNextPiece = outerPossibility;
      bestIndex = i;
    }

    // Log details about the top-level possibility
    if (shouldLog) {
      console.log(
        `\nCurrent move: ${outerPossibility.placement}. Next move: ${innerBestMove.placement}.`
      );
      console.log("Final state eval:", innerBestMove.evalExplanation, "mode:", aiMode); // Log inner explanation
      console.log(
        `\nSurface: ${innerBestMove.surfaceArray}, inner value: ${innerBestMove.evalScore}, original partial value: ${originalMovePartialValue}, \nFINAL TOTAL: ${totalValue}`
      );
      console.log("---------------------------------------------");
    }
  }

  if (shouldLog) {
    // Log performance info
    const msElapsedMoves = Date.now() - time2;
    console.log("\tElapsed per possibility:", msElapsedMoves / topN.length);
    console.log("\tElapsed on all moves:", msElapsedMoves);
  }

  if (shouldLog && bestPossibilityAfterNextPiece) {
    console.log(
      `\nSelected: ${bestPossibilityAfterNextPiece.placement}`
    );
    console.log("# Candidates:", topN.length, "Selected rank:", bestIndex);
  }

  // Send back the highest value move after the next piece is placed
  return bestPossibilityAfterNextPiece;
}

module.exports = { getBestMoveWithSearch, getBestMoveNoSearch };
