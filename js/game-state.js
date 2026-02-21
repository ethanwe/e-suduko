import { CELL_COUNT } from "./config.js";

function createEmptyNotes() {
  return Array.from({ length: CELL_COUNT }, () => new Set());
}

export function createGameState(level, puzzlesByDifficulty) {
  const puzzle = pickPuzzle(level, puzzlesByDifficulty);

  return {
    puzzle: puzzle.puzzle,
    solution: puzzle.solution,
    values: [...puzzle.puzzle],
    centerNotes: createEmptyNotes(),
    cornerNotes: createEmptyNotes()
  };
}

export function isFixedCell(state, index) {
  return state.puzzle[index] !== "0";
}

export function isSolved(state) {
  return state.values.join("") === state.solution;
}

export function checkWrongCells(state) {
  const wrongIndices = [];

  state.values.forEach((value, index) => {
    if (value !== "0" && value !== state.solution[index]) {
      wrongIndices.push(index);
    }
  });

  return wrongIndices;
}

export function randomEmptyIndex(state) {
  const empties = [];

  state.values.forEach((value, index) => {
    if (value === "0") {
      empties.push(index);
    }
  });

  if (!empties.length) {
    return null;
  }

  return empties[Math.floor(Math.random() * empties.length)];
}

function pickPuzzle(level, puzzlesByDifficulty) {
  const available = puzzlesByDifficulty[level] ?? puzzlesByDifficulty.medium;
  return available[Math.floor(Math.random() * available.length)];
}
