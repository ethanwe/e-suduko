import { createSudokuController } from "./js/sudoku-controller.js";

const elements = {
  board: document.getElementById("board"),
  status: document.getElementById("status"),
  difficulty: document.getElementById("difficulty"),
  newGame: document.getElementById("new-game"),
  check: document.getElementById("check"),
  hint: document.getElementById("hint"),
  keypad: document.querySelector(".keypad"),
  modeValue: document.getElementById("mode-value"),
  modeCenter: document.getElementById("mode-center"),
  modeCorner: document.getElementById("mode-corner")
};

createSudokuController(elements).start();
