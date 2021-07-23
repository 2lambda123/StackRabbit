#include "../include/move_result.h"

int getNewSurfaceAndNumNewHoles(int surfaceArray[10],
                                SimState lockPlacement,
                                EvalContext evalContext,
                                OUT int newSurface[10]) {
  for (int i = 0; i < 10; i++) {
    newSurface[i] = surfaceArray[i];
  }
  // Check for new holes by comparing the bottom surface of the piece to the surface of the stack
  int numNewHoles = 0;
  int *bottomSurface = lockPlacement.piece.bottomSurfaceByRotation[lockPlacement.rotationIndex];
  for (int i = 0; i < 4; i++) {
    if (bottomSurface[i] == -1){
      continue;
    }
    // Maybe skip well holes
    if (!evalContext.countWellHoles && lockPlacement.x + i == evalContext.wellColumn){
      continue;
    }
    // Add a hole for each cell of difference between the bottom of the piece and the stack
    int diff = (20 - bottomSurface[i] - lockPlacement.y) - surfaceArray[lockPlacement.x + i];
    numNewHoles += diff;
  }
  // Calculate the new overall surface by superimposing the piece's top surface on the existing surface
  int *topSurface = lockPlacement.piece.topSurfaceByRotation[lockPlacement.rotationIndex];
  for (int i = 0; i < 4; i++) {
    if (topSurface[i] != -1) {
      newSurface[lockPlacement.x + i] = 20 - topSurface[i] - lockPlacement.y;
    }
  }
  return numNewHoles;
}

void updateSurfaceAfterLineClears(int surfaceArray[10], int board[20], int numLinesCleared) {
  for (int c = 0; c < 10; c++) {
    int mask = 1 << (9 - c);
    int r = 20 - surfaceArray[c];
    while (r < 20 && !(board[r] & mask)) {
      r++;
    }
    surfaceArray[c] = 20 - r;
  }
}

/**
 * Calculates the resulting board after placing a piece in a specified spot.
 * @returns the number of lines cleared
 */
int getNewBoardAndLinesCleared(int board[20], SimState lockPlacement, OUT int newBoard[20]) {
  int numLinesCleared = 0;
  // The rows below the piece are always the same
  for (int r = lockPlacement.y + 4; r < 20; r++) {
    newBoard[r] = board[r];
  }
  // Check the piece rows, bottom to top
  int *pieceRows = lockPlacement.piece.rowsByRotation[lockPlacement.rotationIndex];
  for (int i = 3; i >= 0; i--) {
    // printf("Piece row %d = %d\n", i, SHIFTBY(pieceRows[i], lockPlacement.x));
    if (pieceRows[i] == 0) {
      newBoard[lockPlacement.y + i + numLinesCleared] = board[lockPlacement.y + i];
      continue;
    }
    int newRow = board[lockPlacement.y + i] | (SHIFTBY(pieceRows[i], lockPlacement.x));
    // printf("New row %d\n", newRow);
    if (newRow == FULL_ROW) {
      numLinesCleared++;
      continue;
    }
    // printf("Saving row %d as %d", lockPlacement.y + i + numLinesCleared, newRow);
    newBoard[lockPlacement.y + i + numLinesCleared] = newRow;
  }
  // Copy the rest of the rows
  for (int r = 0; r < lockPlacement.y; r++) {
    // printf("Saving row %d as %d", r + numLinesCleared, board[r]);
    newBoard[r + numLinesCleared] = board[r];
  }
  // Add empty lines at the top of the board if needed
  for (int i = 0; i < numLinesCleared; i++) {
    newBoard[i] = 0;
  }
  return numLinesCleared;
}

/** Gets the game state after completing a given move */
GameState advanceGameState(GameState gameState, SimState lockPlacement, EvalContext evalContext) {
  GameState nextState = {{}, {}, gameState.adjustedNumHoles, {}};

  int numLinesCleared = getNewBoardAndLinesCleared(gameState.board, lockPlacement, nextState.board);
  int numNewHoles =
        getNewSurfaceAndNumNewHoles(gameState.surfaceArray, lockPlacement, evalContext, nextState.surfaceArray);
  if (numLinesCleared > 0){
    updateSurfaceAfterLineClears(nextState.surfaceArray, nextState.board, numLinesCleared);
  }
  
  nextState.adjustedNumHoles += numNewHoles;
  return nextState;
}