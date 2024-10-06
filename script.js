const boardSize = 10;
const mineCount = 10;
let flagCount = 40;
let gameOver = false;
let timer = 0;
let interval;
let flagMode = false; // Used for the flag toggle mode on mobile

const board = [];
const gameBoard = document.getElementById('game-board');
const flagsDisplay = document.getElementById('flags');
const timerDisplay = document.getElementById('timer');
const restartModal = document.getElementById('restart-modal');
const restartBtn = document.getElementById('restart-btn');
const flagToggleBtn = document.getElementById('flag-toggle');

// Restart the game (after losing)
restartBtn.addEventListener('click', () => {
    restartModal.style.display = 'none';
    initGame();
});

flagToggleBtn.addEventListener('click', () => {
    flagMode = !flagMode;
    flagToggleBtn.style.backgroundColor = flagMode ? '#ff3d00' : '#ff5722';
});

function initGame() {
    gameBoard.innerHTML = '';
    board.length = 0;
    flagCount = 40;
    flagsDisplay.textContent = `Flags: ${flagCount}`;
    clearInterval(interval);
    timer = 0;
    timerDisplay.textContent = `Time: ${timer}`;
    interval = setInterval(() => {
        if (!gameOver) {
            timer++;
            timerDisplay.textContent = `Time: ${timer}`;
        }
    }, 1000);

    for (let i = 0; i < boardSize; i++) {
        const row = [];
        for (let j = 0; j < boardSize; j++) {
            const cell = {
                isMine: false,
                revealed: false,
                flagged: false,
                adjacentMines: 0
            };
            row.push(cell);
        }
        board.push(row);
    }

    placeMines();
    calculateAdjacentMines();
    renderBoard();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            placedMines++;
        }
    }
}

function calculateAdjacentMines() {
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j].isMine) {
                board[i][j].adjacentMines = countAdjacentMines(i, j);
            }
        }
    }
}

function countAdjacentMines(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (board[newRow][newCol].isMine) {
                    count++;
                }
            }
        }
    }
    return count;
}

function renderBoard() {
    gameBoard.innerHTML = '';
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (board[i][j].revealed) {
                cellElement.classList.add('revealed');
                if (board[i][j].isMine) {
                    cellElement.textContent = '💣';
                } else if (board[i][j].adjacentMines > 0) {
                    cellElement.textContent = board[i][j].adjacentMines;
                }
            } else if (board[i][j].flagged) {
                cellElement.classList.add('flagged');
                cellElement.textContent = '🚩';
            }

            cellElement.addEventListener('click', () => handleCellClick(i, j));
            gameBoard.appendChild(cellElement);
        }
    }
}

function handleCellClick(row, col) {
    if (gameOver || board[row][col].revealed) return;

    if (flagMode) {
        board[row][col].flagged = !board[row][col].flagged;
        flagCount += board[row][col].flagged ? -1 : 1;
        flagsDisplay.textContent = `Flags: ${flagCount}`;
    } else {
        revealCell(row, col);
    }

    renderBoard();
}

function revealCell(row, col) {
    if (board[row][col].isMine) {
        alert('Game over!');
        gameOver = true;
        clearInterval(interval);
        restartModal.style.display = 'block'; // Show restart modal when the game is lost
        return;
    }

    board[row][col].revealed = true;
    if (board[row][col].adjacentMines === 0) {
        // Reveal surrounding cells if no adjacent mines
        for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
                const newRow = row + i;
                const newCol = col + j;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    if (!board[newRow][newCol].revealed) {
                        revealCell(newRow, newCol);
                    }
                }
            }
        }
    }
}

// Start the game initially
initGame();
