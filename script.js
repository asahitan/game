const boardSize = 10;
const mineCount = 10;
let board = [];
let mines = [];
let gameOver = false;

const gameBoard = document.getElementById("game-board");
const restartBtn = document.getElementById("restart-btn");

function initializeGame() {
  gameBoard.innerHTML = '';
  board = [];
  mines = [];
  gameOver = false;

  createBoard();
  placeMines();
  addEventListeners();
}

function createBoard() {
  for (let i = 0; i < boardSize; i++) {
    const row = [];
    for (let j = 0; j < boardSize; j++) {
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

function placeMines() {
  let placedMines = 0;
  while (placedMines < mineCount) {
    const row = Math.floor(Math.random() * boardSize);
    const col = Math.floor(Math.random() * boardSize);

    if (!mines.some(mine => mine.row === row && mine.col === col)) {
      mines.push({ row, col });
      placedMines++;
    }
  }
}

function addEventListeners() {
  board.forEach(row => {
    row.forEach(cell => {
      cell.addEventListener("click", () => handleClick(cell));
    });
  });

  restartBtn.addEventListener("click", initializeGame);
}

function handleClick(cell) {
  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  if (gameOver || cell.classList.contains("revealed")) return;

  if (isMine(row, col)) {
    cell.style.backgroundColor = "red";
    alert("Game Over! You clicked a mine.");
    gameOver = true;
  } else {
    cell.classList.add("revealed");
    const mineCount = countMines(row, col);
    if (mineCount > 0) {
      cell.textContent = mineCount;
    }
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
      if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
        if (isMine(newRow, newCol)) {
          count++;
        }
      }
    }
  }
  return count;
}

// Initialize the game on page load
initializeGame();
