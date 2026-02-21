import { GRID_SIZE } from "./config.js";

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

export function drawBoard(boardEl, state) {
  boardEl.innerHTML = "";

  state.values.forEach((_, index) => {
    const isFixed = state.puzzle[index] !== "0";
    const cell = document.createElement("button");

    cell.type = "button";
    cell.className = `cell ${isFixed ? "prefilled" : "editable"}`;
    cell.dataset.index = String(index);
    cell.dataset.row = String(rowOf(index));
    cell.dataset.col = String(colOf(index));

    renderCell(boardEl, state, index, cell);
    boardEl.appendChild(cell);
  });
}

export function renderCell(boardEl, state, index, cell = boardEl.children[index]) {
  const value = state.values[index];
  cell.innerHTML = "";

  if (value !== "0") {
    const valueEl = document.createElement("span");
    valueEl.className = "cell-value";
    valueEl.textContent = value;
    cell.appendChild(valueEl);
    return;
  }

  cell.appendChild(createNotesLayer(state.cornerNotes[index], "notes notes-corner"));
  cell.appendChild(createNotesLayer(state.centerNotes[index], "notes notes-center"));
}

export function paintSelection(boardEl, selectedIndex) {
  const cells = [...boardEl.children];

  cells.forEach((cell, index) => {
    cell.classList.remove("selected", "related");

    if (index === selectedIndex) {
      cell.classList.add("selected");
    }
  });

  if (selectedIndex === null) {
    return;
  }

  const selectedRow = rowOf(selectedIndex);
  const selectedCol = colOf(selectedIndex);

  cells.forEach((cell, index) => {
    if (rowOf(index) === selectedRow || colOf(index) === selectedCol) {
      cell.classList.add("related");
    }
  });

  cells[selectedIndex].classList.add("selected");
}

export function clearError(boardEl, index) {
  boardEl.children[index].classList.remove("error");
}

export function setError(boardEl, index, hasError) {
  boardEl.children[index].classList.toggle("error", hasError);
}

export function clearAllErrors(boardEl) {
  [...boardEl.children].forEach((cell) => {
    cell.classList.remove("error");
  });
}

function createNotesLayer(notesSet, className) {
  const layer = document.createElement("div");
  layer.className = className;

  DIGITS.forEach((digit) => {
    const noteEl = document.createElement("span");
    noteEl.textContent = notesSet.has(digit) ? digit : "";
    layer.appendChild(noteEl);
  });

  return layer;
}

function rowOf(index) {
  return Math.floor(index / GRID_SIZE);
}

function colOf(index) {
  return index % GRID_SIZE;
}
