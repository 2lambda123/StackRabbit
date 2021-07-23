#ifndef TYPES
#define TYPES

struct Piece {
  char id;
  int index;
  int rowsByRotation[4][4];
  int topSurfaceByRotation[4][4];
  int bottomSurfaceByRotation[4][4];
  int maxYByRotation[4];
  int initialY;
};

/**
 * A representation of the overall state of the game, like a freeze frame before each piece spawns.
 */
struct GameState {
  int board[20];  // Each int represent a row, where the last 10 bits of the int represent the cells.
  int surfaceArray[10];
  int adjustedNumHoles; // A count of how many holes there are, with adjustments for the height of holes.
  int holeMap[20]; // Each int also a row, but with 0/1 bits corresponding to whether the cell is a hole.
};

/**
 * The internal state of a move search simulation
 * (looping through pretend frames and seeing how the piece can move). 
 */
struct SimState {
  int x;
  int y;
  int rotationIndex;
  int frameIndex;
  Piece piece;
};

/**
 * The relative weights of all the eval factors.
 */
struct FastEvalWeights {
  float avgHeightCoef;
  float burnCoef;
  float coveredWellCoef;
  float highCol9Coef;
  float holeCoef;
  float tetrisCoef;
  float spireHeightCoef;
  float surfaceCoef;
};

/**
 * Any meta-information that might affect how things are evaluated.
 * e.g. how fast the agent can tap
 */
struct EvalContext {
  float scareHeight;
  int wellColumn;
  int countWellHoles;
};

struct FastEvalResult {
  float evalScore;
  GameState resultingState;
};

struct Possibility {
  SimState lockPlacement;
  GameState resultingState;
};

#endif