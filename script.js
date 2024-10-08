const difficulties = {
  easy: { size: 8, mines: 10 },
  medium: { size: 16, mines: 40 },
  hard: { size: 24, mines: 99 },
};

let board = [];
let mines = [];
let flagged = [];
let gameOver = false;

const gameBoard = document.getElementById("game-board");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");

function initializeGame() {
  const difficulty = difficultySelect.value;
  const { size, mines: mineCount } = difficulties[difficulty];
  
  gameBoard.innerHTML = '';
  board = [];
  mines = [];
  flagged = [];
  gameOver = false;

  gameBoard.style.gridTemplateColumns = `repeat(${size}, 40px)`;
  createBoard(size);
  placeMines(size, mineCount);
  addEventListeners(size);
}

function createBoard(size) {
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.classList.add("cell");
      cell.dataset.row = i;
      cell.dataset.col = j;
      gameBoard.appendChild(cell);
      row.push(cell);
    }
    board.push(row);
  }
}

function placeMines(size, mineCount) {
  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * size);
    const col = Math.floor(Math.random() * size);

    if (!mines.some(mine => mine.row === row && mine.col === col)) {
      mines.push({ row, col });
      placedMines++;
    }
  }
}

function addEventListeners(size) {
  board.forEach(row => {
    row.forEach(cell => {
      cell.addEventListener("click", () => handleClick(cell));
      cell.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        handleRightClick(cell);
      });
    });
  });

  restartBtn.addEventListener("click", initializeGame);
}

function handleClick(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (gameOver || cell.classList.contains("revealed") || cell.classList.contains("flagged")) return;

  if (isMine(row, col)) {
    revealAllMines();
    cell.style.backgroundColor = "red";
    alert("Game Over! You hit a mine.");
    gameOver = true;
  } else {
    revealCell(cell, row, col);
  }

  checkWin();
}

function handleRightClick(cell) {
  if (gameOver || cell.classList.contains("revealed")) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (cell.classList.contains("flagged")) {
    cell.classList.remove("flagged");
    cell.innerHTML = '';
    flagged = flagged.filter(f => f.row !== row || f.col !== col);
  } else {
    cell.classList.add("flagged");
    const flag = document.createElement("div");
    flag.classList.add("flag");
    cell.appendChild(flag);
    flagged.push({ row, col });
  }

  checkWin();
}

function revealCell(cell, row, col) {
  cell.classList.add("revealed");
  const mineCount = countMines(row, col);
  if (mineCount > 0) {
    cell.textContent = mineCount;
  } else {
    // Recursive reveal of neighboring cells
    revealNeighbors(row, col);
  }
}

function isMine(row, col) {
  return mines.some(mine => mine.row === row && mine.col === col);
}

function countMines(row, col) {
  let count = 0;
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board.length) {
        if (isMine(newRow, newCol)) {
          count++;
        }
      }
    }
  }
  return count;
}

function revealNeighbors(row, col) {
  for (let i = -1; i <= 1; i++) {
    for (let j = -1; j <= 1; j++) {
      const newRow = row + i;
      const newCol = col + j;
      if (newRow >= 0 && newRow < board.length && newCol >= 0 && newCol < board.length) {
        const neighbor = board[newRow][newCol];
        if (!neighbor.classList.contains("revealed")) {
          revealCell(neighbor, newRow, newCol);
        }
      }
    }
  }
}

function revealAllMines() {
  mines.forEach(mine => {
    const mineCell = board[mine.row][mine.col];
    mineCell.classList.add("revealed");
    mineCell.style.backgroundColor = "red";
  });
}

function checkWin() {
  if (flagged.length === mines.length && flagged.every(f => isMine(f.row, f.col))) {
    alert("Congratulations! You've flagged all the mines and won.");
    gameOver = true;
  }
}

// Initialize game on page load
initializeGame();

difficultySelect.addEventListener("change", initializeGame);
