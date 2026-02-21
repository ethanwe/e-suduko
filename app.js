const PUZZLES = {
  easy: [
    {
      puzzle: "530070000600195000098000060800060003400803001700020006060000280000419005000080079",
      solution: "534678912672195348198342567859761423426853791713924856961537284287419635345286179"
    },
    {
      puzzle: "000260701680070090190004500820100040004602900050003028009300074040050036703018000",
      solution: "435269781682571493197834562826195347374682915951743628519326874248957136763418259"
    }
  ],
  medium: [
    {
      puzzle: "200080300060070084030500209000105408000000000402706000301007040720040060004010003",
      solution: "245981376169273584837564219976125438513498627482736951391657842728349165654812793"
    },
    {
      puzzle: "000000907000420180000705026100904000050000040000507009920108000034059000507000000",
      solution: "462831957795426183381795426173984265659312748248567319926178534834259671517643892"
    }
  ],
  hard: [
    {
      puzzle: "000900002050123400030000000908000030000040000020000706000000080001237090400008000",
      solution: "164985372859123467732764951948671235576342819321859746297516684681237594435498126"
    },
    {
      puzzle: "300000000005009000200504000020000700160000058704310600000890100000067080000005437",
      solution: "391672845845139276276584913523948761169723458784351692657894132432167589918265437"
    }
  ]
};

const boardEl = document.getElementById("board");
const statusEl = document.getElementById("status");
const difficultyEl = document.getElementById("difficulty");
const newGameEl = document.getElementById("new-game");
const checkEl = document.getElementById("check");
const hintEl = document.getElementById("hint");
const keypadEl = document.querySelector(".keypad");

let current = null;
let selectedIndex = null;

function pickPuzzle(level) {
  const list = PUZZLES[level] ?? PUZZLES.medium;
  return list[Math.floor(Math.random() * list.length)];
}

function initGame() {
  const pick = pickPuzzle(difficultyEl.value);
  current = {
    puzzle: pick.puzzle,
    solution: pick.solution,
    values: [...pick.puzzle]
  };
  selectedIndex = null;
  drawBoard();
  setStatus("New game started.");
}

function drawBoard() {
  boardEl.innerHTML = "";

  current.values.forEach((value, index) => {
    const row = Math.floor(index / 9);
    const col = index % 9;
    const fixed = current.puzzle[index] !== "0";

    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = `cell ${fixed ? "prefilled" : "editable"}`;
    cell.dataset.index = String(index);
    cell.dataset.row = String(row);
    cell.dataset.col = String(col);
    cell.textContent = value === "0" ? "" : value;
    if (!fixed) cell.addEventListener("click", () => selectCell(index));

    boardEl.appendChild(cell);
  });
}

function selectCell(index) {
  selectedIndex = index;
  paintSelection();
}

function paintSelection() {
  const cells = [...boardEl.children];
  cells.forEach((el, index) => {
    el.classList.remove("selected", "related");
    if (index === selectedIndex) el.classList.add("selected");
  });

  if (selectedIndex === null) return;
  const row = Math.floor(selectedIndex / 9);
  const col = selectedIndex % 9;

  cells.forEach((el, index) => {
    const r = Math.floor(index / 9);
    const c = index % 9;
    if (r === row || c === col) {
      el.classList.add("related");
    }
  });
  cells[selectedIndex].classList.add("selected");
}

function setValue(value) {
  if (selectedIndex === null) {
    setStatus("Tap a cell first.");
    return;
  }
  if (current.puzzle[selectedIndex] !== "0") {
    setStatus("That number is fixed.");
    return;
  }

  current.values[selectedIndex] = value;
  const cell = boardEl.children[selectedIndex];
  cell.textContent = value === "0" ? "" : value;
  cell.classList.remove("error");

  if (value !== "0" && current.solution[selectedIndex] !== value) {
    cell.classList.add("error");
  }

  if (current.values.join("") === current.solution) {
    setStatus("🎉 You solved it!");
  } else {
    setStatus("Keep going.");
  }
}

function checkBoard() {
  const wrong = [];
  current.values.forEach((value, index) => {
    const cell = boardEl.children[index];
    cell.classList.remove("error");
    if (value !== "0" && value !== current.solution[index]) {
      cell.classList.add("error");
      wrong.push(index);
    }
  });

  if (!wrong.length) {
    setStatus(current.values.includes("0") ? "So far so good." : "Perfect board!");
  } else {
    setStatus(`${wrong.length} cell(s) need fixing.`);
  }
}

function revealHint() {
  const empties = current.values
    .map((v, i) => (v === "0" ? i : -1))
    .filter((i) => i !== -1);

  if (!empties.length) {
    setStatus("No empty cells left.");
    return;
  }

  const index = empties[Math.floor(Math.random() * empties.length)];
  current.values[index] = current.solution[index];
  const cell = boardEl.children[index];
  cell.textContent = current.solution[index];
  cell.classList.remove("error");
  setStatus("Hint added.");
}

function setStatus(message) {
  statusEl.textContent = message;
}

newGameEl.addEventListener("click", initGame);
checkEl.addEventListener("click", checkBoard);
hintEl.addEventListener("click", revealHint);

keypadEl.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-num]");
  if (!button) return;
  const value = button.dataset.num === "clear" ? "0" : button.dataset.num;
  setValue(value);
});

boardEl.addEventListener("click", (event) => {
  const cell = event.target.closest(".cell");
  if (!cell) return;
  const index = Number(cell.dataset.index);
  if (current.puzzle[index] === "0") {
    selectCell(index);
  }
});

document.addEventListener("keydown", (event) => {
  if (!current) return;
  if (/^[1-9]$/.test(event.key)) setValue(event.key);
  if (event.key === "Backspace" || event.key === "Delete" || event.key === "0") setValue("0");
});

initGame();
