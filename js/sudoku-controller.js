import { ENTRY_MODE } from "./config.js";
import { PUZZLES } from "./puzzles.js";
import { createGameState, isFixedCell, isSolved, checkWrongCells, randomEmptyIndex } from "./game-state.js";
import { drawBoard, renderCell, paintSelection, clearError, setError, clearAllErrors } from "./board-view.js";

export function createSudokuController(elements) {
  const app = {
    state: null,
    selectedIndex: null,
    entryMode: ENTRY_MODE.VALUE
  };

  function start() {
    bindEvents();
    initGame();
  }

  function initGame() {
    app.state = createGameState(elements.difficulty.value, PUZZLES);
    app.selectedIndex = null;
    setEntryMode(ENTRY_MODE.VALUE);

    drawBoard(elements.board, app.state);
    paintSelection(elements.board, app.selectedIndex);
    setStatus("New game started.");
  }

  function selectCell(index) {
    app.selectedIndex = index;
    paintSelection(elements.board, app.selectedIndex);
  }

  function setEntryMode(mode) {
    app.entryMode = mode;

    const modes = [
      [elements.modeValue, ENTRY_MODE.VALUE],
      [elements.modeCenter, ENTRY_MODE.CENTER],
      [elements.modeCorner, ENTRY_MODE.CORNER]
    ];

    modes.forEach(([button, buttonMode]) => {
      const isActive = mode === buttonMode;
      button.classList.toggle("active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });
  }

  function setValue(value) {
    if (app.selectedIndex === null) {
      setStatus("Tap a cell first.");
      return;
    }

    if (isFixedCell(app.state, app.selectedIndex)) {
      setStatus("That number is fixed.");
      return;
    }

    clearError(elements.board, app.selectedIndex);

    if (app.entryMode === ENTRY_MODE.VALUE) {
      setDigitValue(value);
      return;
    }

    setNoteValue(value);
  }

  function setDigitValue(value) {
    app.state.values[app.selectedIndex] = value;

    if (value !== "0") {
      app.state.centerNotes[app.selectedIndex].clear();
      app.state.cornerNotes[app.selectedIndex].clear();
    }

    renderCell(elements.board, app.state, app.selectedIndex);

    if (value !== "0") {
      setError(elements.board, app.selectedIndex, app.state.solution[app.selectedIndex] !== value);
    }

    setStatus(isSolved(app.state) ? "🎉 You solved it!" : "Keep going.");
  }

  function setNoteValue(value) {
    if (value === "0") {
      app.state.values[app.selectedIndex] = "0";
      app.state.centerNotes[app.selectedIndex].clear();
      app.state.cornerNotes[app.selectedIndex].clear();
      renderCell(elements.board, app.state, app.selectedIndex);
      setStatus("Notes cleared.");
      return;
    }

    if (app.state.values[app.selectedIndex] !== "0") {
      setStatus("Clear the value before adding notes.");
      return;
    }

    const notes = app.entryMode === ENTRY_MODE.CENTER
      ? app.state.centerNotes[app.selectedIndex]
      : app.state.cornerNotes[app.selectedIndex];

    if (notes.has(value)) {
      notes.delete(value);
      setStatus("Note removed.");
    } else {
      notes.add(value);
      setStatus("Note added.");
    }

    renderCell(elements.board, app.state, app.selectedIndex);
  }

  function checkBoard() {
    clearAllErrors(elements.board);
    const wrongCells = checkWrongCells(app.state);

    wrongCells.forEach((index) => {
      setError(elements.board, index, true);
    });

    if (!wrongCells.length) {
      setStatus(app.state.values.includes("0") ? "So far so good." : "Perfect board!");
      return;
    }

    setStatus(`${wrongCells.length} cell(s) need fixing.`);
  }

  function revealHint() {
    const index = randomEmptyIndex(app.state);

    if (index === null) {
      setStatus("No empty cells left.");
      return;
    }

    app.state.values[index] = app.state.solution[index];
    app.state.centerNotes[index].clear();
    app.state.cornerNotes[index].clear();

    renderCell(elements.board, app.state, index);
    setError(elements.board, index, false);
    setStatus("Hint added.");
  }

  function setStatus(message) {
    elements.status.textContent = message;
  }

  function bindEvents() {
    elements.newGame.addEventListener("click", initGame);
    elements.check.addEventListener("click", checkBoard);
    elements.hint.addEventListener("click", revealHint);

    elements.modeValue.addEventListener("click", () => setEntryMode(ENTRY_MODE.VALUE));
    elements.modeCenter.addEventListener("click", () => setEntryMode(ENTRY_MODE.CENTER));
    elements.modeCorner.addEventListener("click", () => setEntryMode(ENTRY_MODE.CORNER));

    elements.keypad.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-num]");
      if (!button) {
        return;
      }

      setValue(button.dataset.num === "clear" ? "0" : button.dataset.num);
    });

    elements.board.addEventListener("click", (event) => {
      if (!app.state) {
        return;
      }

      const cell = event.target.closest(".cell");
      if (!cell) {
        return;
      }

      const index = Number(cell.dataset.index);
      if (!isFixedCell(app.state, index)) {
        selectCell(index);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!app.state) {
        return;
      }

      if (/^[1-9]$/.test(event.key)) {
        setValue(event.key);
      }

      if (["Backspace", "Delete", "0"].includes(event.key)) {
        setValue("0");
      }
    });
  }

  return {
    start,
    initGame
  };
}
