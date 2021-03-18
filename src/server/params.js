const AI_MODE = Object.freeze({
  STANDARD: "standard",
  DIG: "dig",
  NEAR_KILLSCREEN: "near_killscreen",
});

const DIG_MODIFICATIONS = {
  BURN_PENALTY: 0,
  COL_10_PENALTY: 0,
  HOLE_WEIGHT_PENALTY: -3,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: 0,
  SURFACE_MULTIPLIER: 0.2,
};

const NEAR_KILLSCREEN_MODIFICATIONS = {
  BURN_PENALTY: -20,
};

// Parameters to tweak
const DEFAULT_PARAMS = {
  SURFACE_MULTIPLIER: 0.4,
  HOLE_PENALTY: -20,
  HOLE_WEIGHT_PENALTY: 0,
  TETRIS_BONUS: 20,
  TETRIS_READY_BONUS: 6,
  TETRIS_READY_BONUS_BAR_NEXT: 16,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -10,
  BURN_PENALTY: -2.5,
  SCARE_HEIGHT_18: 8,
  SCARE_HEIGHT_19: 5,
  SCARE_HEIGHT_29: 0,
  MAX_HEIGHT_MULTIPLIER: -1,
  MAX_HEIGHT_EXPONENT: 1.4,
  AVG_HEIGHT_MULTIPLIER: -8,
  AVG_HEIGHT_EXPONENT: 1.5,
  COL_10_PENALTY: -5,
  HIGH_LEFT_MULTIPLIER: 3,
  SLOPE_PENALTY_MULTIPLIER: -0.3,
  EXTREME_GAP_PENALTY: -2,
};

const AGGRO_PARAMS = {
  AVG_HEIGHT_EXPONENT: 1.1556000000000004,
  AVG_HEIGHT_MULTIPLIER: -10.50624,
  BURN_PENALTY: -5.2,
  COL_10_PENALTY: -10.319999999999999,
  EXTREME_GAP_PENALTY: -1.6416000000000004,
  HIGH_LEFT_MULTIPLIER: 1.7280000000000004,
  HOLE_PENALTY: -19.8,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.0415999999999999,
  MAX_HEIGHT_MULTIPLIER: -1.1556000000000002,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -20.054400000000001,
  SCARE_HEIGHT_18: 11,
  SCARE_HEIGHT_19: 6,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.24974400000000005,
  SURFACE_MULTIPLIER: 0.2739200000000001,
  TETRIS_BONUS: 28.248,
  TETRIS_READY_BONUS: 7.909760000000001,
  TETRIS_READY_BONUS_BAR_NEXT: 15.36,
};

const v1_resultParams = {
  AVG_HEIGHT_EXPONENT: 1.2000000000000002,
  AVG_HEIGHT_MULTIPLIER: -9.6,
  BURN_PENALTY: -2.5,
  COL_10_PENALTY: -4.5,
  EXTREME_GAP_PENALTY: -1.6,
  HIGH_LEFT_MULTIPLIER: 2.4000000000000004,
  HOLE_PENALTY: -18,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.4,
  MAX_HEIGHT_MULTIPLIER: -1.2,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -8,
  SCARE_HEIGHT_18: 8.8,
  SCARE_HEIGHT_19: 5,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.33,
  SURFACE_MULTIPLIER: 0.32000000000000006,
  TETRIS_BONUS: 22,
  TETRIS_READY_BONUS: 7.199999999999999,
  TETRIS_READY_BONUS_BAR_NEXT: 16,
};
const v2_resultParams = {
  AVG_HEIGHT_EXPONENT: 1.2000000000000002,
  AVG_HEIGHT_MULTIPLIER: -11.52,
  BURN_PENALTY: -2.75,
  COL_10_PENALTY: -5.3999999999999995,
  EXTREME_GAP_PENALTY: -1.6,
  HIGH_LEFT_MULTIPLIER: 1.9200000000000004,
  HOLE_PENALTY: -19.8,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.4,
  MAX_HEIGHT_MULTIPLIER: -1.2,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -8.8,
  SCARE_HEIGHT_18: 8.8,
  SCARE_HEIGHT_19: 5,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.264,
  SURFACE_MULTIPLIER: 0.32000000000000006,
  TETRIS_BONUS: 22,
  TETRIS_READY_BONUS: 5.76,
  TETRIS_READY_BONUS_BAR_NEXT: 12.8,
};
const v3_resultParams = {
  AVG_HEIGHT_EXPONENT: 1.0800000000000003,
  AVG_HEIGHT_MULTIPLIER: -9.216,
  BURN_PENALTY: -2.2,
  COL_10_PENALTY: -4.319999999999999,
  EXTREME_GAP_PENALTY: -1.4400000000000002,
  HIGH_LEFT_MULTIPLIER: 1.7280000000000004,
  HOLE_PENALTY: -19.8,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.1199999999999999,
  MAX_HEIGHT_MULTIPLIER: -1.08,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -7.040000000000001,
  SCARE_HEIGHT_18: 8.8,
  SCARE_HEIGHT_19: 6,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.29040000000000005,
  SURFACE_MULTIPLIER: 0.25600000000000006,
  TETRIS_BONUS: 26.4,
  TETRIS_READY_BONUS: 5.184,
  TETRIS_READY_BONUS_BAR_NEXT: 15.36,
};
const v4_resultParams = {
  AVG_HEIGHT_EXPONENT: 1.2960000000000003,
  AVG_HEIGHT_MULTIPLIER: -9.216,
  BURN_PENALTY: -2.4200000000000004,
  COL_10_PENALTY: -4.752,
  EXTREME_GAP_PENALTY: -1.5840000000000003,
  HIGH_LEFT_MULTIPLIER: 1.5552000000000004,
  HOLE_PENALTY: -21.78,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.1199999999999999,
  MAX_HEIGHT_MULTIPLIER: -0.8640000000000001,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -7.040000000000001,
  SCARE_HEIGHT_18: 7.920000000000001,
  SCARE_HEIGHT_19: 6.6000000000000005,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.26136000000000004,
  SURFACE_MULTIPLIER: 0.3072000000000001,
  TETRIS_BONUS: 29.04,
  TETRIS_READY_BONUS: 4.6656,
  TETRIS_READY_BONUS_BAR_NEXT: 12.288,
};
const v5_resultParams = {
  AVG_HEIGHT_EXPONENT: 1.1556000000000004,
  AVG_HEIGHT_MULTIPLIER: -10.50624,
  BURN_PENALTY: -2.2,
  COL_10_PENALTY: -4.319999999999999,
  EXTREME_GAP_PENALTY: -1.6416000000000004,
  HIGH_LEFT_MULTIPLIER: 1.7280000000000004,
  HOLE_PENALTY: -19.8,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.0415999999999999,
  MAX_HEIGHT_MULTIPLIER: -1.1556000000000002,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -6.054400000000001,
  SCARE_HEIGHT_18: 10.032000000000002,
  SCARE_HEIGHT_19: 5.58,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.24974400000000005,
  SURFACE_MULTIPLIER: 0.2739200000000001,
  TETRIS_BONUS: 28.248,
  TETRIS_READY_BONUS: 5.909760000000001,
  TETRIS_READY_BONUS_BAR_NEXT: 15.36,
};

const v5_aggro = {
  AVG_HEIGHT_EXPONENT: 1.1556000000000004,
  AVG_HEIGHT_MULTIPLIER: -10.50624,
  BURN_PENALTY: -15, // changed
  COL_10_PENALTY: -4.3, // changed
  EXTREME_GAP_PENALTY: -1.6416000000000004,
  HIGH_LEFT_MULTIPLIER: 1.7280000000000004,
  HOLE_PENALTY: -19.8,
  HOLE_WEIGHT_PENALTY: 0,
  MAX_HEIGHT_EXPONENT: 1.0415999999999999,
  MAX_HEIGHT_MULTIPLIER: -1.1556000000000002,
  NOT_BUILDING_TOWARD_TETRIS_PENALTY: -6.054400000000001,
  SCARE_HEIGHT_18: 10.032000000000002,
  SCARE_HEIGHT_19: 5.58,
  SCARE_HEIGHT_29: 0,
  SLOPE_PENALTY_MULTIPLIER: -0.24974400000000005,
  SURFACE_MULTIPLIER: 0.2739200000000001,
  TETRIS_BONUS: 28.248,
  TETRIS_READY_BONUS: 5.909760000000001, // changed
  TETRIS_READY_BONUS_BAR_NEXT: 15.36,
};

function getParams() {
  return v5_aggro;
}

module.exports = {
  getParams,
  DEFAULT_PARAMS,
  AI_MODE,
  DIG_MODIFICATIONS,
  NEAR_KILLSCREEN_MODIFICATIONS,
};
