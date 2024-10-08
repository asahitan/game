const difficulties = {
  easy: { size: 8, mines: 10 },
  medium: { size: 16, mines: 40 },
  hard: { size: 24, mines: 99 },
};

let board = [];
let mines = [];
let flagged = [];
let gameOver = false;
let timeElapsed = 0;
let timerInterval = null;
let moveCount = 0;

const gameBoard = document.getElementById("game-board");
const restartBtn = document.getElementById("restart-btn");
const difficultySelect = document.getElementById("difficulty");
const timeDisplay = document.getElementById("time-display");
const scoreDisplay = document.getElementById("score-display");

function initializeGame() {
  const difficulty = difficultySelect.value;
  const { size, mines: mineCount } = difficulties[difficulty];

  gameBoard.innerHTML = '';
  board = [];
  mines = [];
  flagged = [];
  gameOver = false;
  timeElapsed = 0;
  moveCount = 0;
  timeDisplay.textContent = '0';
  scoreDisplay.textContent = '0';

  clearInterval(timerInterval);
  startTimer();

  gameBoard.style.gridTemplateColumns = `repeat(${size}, 40px)`;
  createBoard(size);
  placeMines(size, mineCount);
  addEventListeners(size);
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeElapsed++;
    timeDisplay.textContent = timeElapsed;
  }, 1000);
}

function stopTimer() {
  clearInterval(timerInterval);
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
  if (gameOver || cell.classList.contains("revealed") || cell.classList.contains("flagged")) return;

  const row = parseInt(cell.dataset.row);
  const col = parseInt(cell.dataset.col);

  moveCount++; // Increment move count on each left-click
  updateScore();

  if (isMine(row, col)) {
    revealAllMines();
    cell.style.backgroundColor = "red";
    alert("Game Over! You hit a mine.");
    stopTimer();
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
    stopTimer();
    updateScore(true); // Pass "true" to indicate a win
    gameOver = true;
  }
}

function updateScore(isWin = false) {
  let baseScore = isWin ? 1000 : 0; // Base score for winning
  let timePenalty = timeElapsed * 2; // Higher time results in lower score
  let movePenalty = moveCount * 5;   // More moves result in lower score

  let finalScore = baseScore - timePenalty - movePenalty;
  finalScore = Math.max(finalScore, 0); // Ensure score doesn't go negative

  scoreDisplay.textContent = finalScore;
}

// Initialize game on page load
initializeGame();

difficultySelect.addEventListener("change", initializeGame);
