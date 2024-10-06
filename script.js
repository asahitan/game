const boardSize = 10;
const mineCount = 10;
let flagCount = 40;
let gameOver = false;
let timer = 0;
let interval;
let longPressTimer;

const board = [];
const gameBoard = document.getElementById('game-board');
const flagsDisplay = document.getElementById('flags');
const timerDisplay = document.getElementById('timer');

// Initialize the game
function initGame() {
    gameBoard.innerHTML = '';
    board.length = 0;
    flagCount = 40;
    flagsDisplay.textContent = `Flags: ${flagCount}`;
    clearInterval(interval);
    timer = 0;
    timerDisplay.textContent = `Time: ${timer}`;
    interval = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}`;
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

    // Place mines
    let placedMines = 0;
    while (placedMines < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            placedMines++;
        }
    }

    // Calculate adjacent mines
    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (!board[i][j].isMine) {
                board[i][j].adjacentMines = countAdjacentMines(i, j);
            }
        }
    }

    renderBoard();
}

// Count adjacent mines for each cell
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

// Render the game board
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

            // Event listeners for click and long press
            cellElement.addEventListener('click', () => revealCell(i, j));
            cellElement.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(i, j);
            });
            
            // Long press support for mobile
            cellElement.addEventListener('touchstart', (e) => {
                longPressTimer = setTimeout(() => {
                    flagCell(i, j);
                }, 500); // 500ms long press
            });

            cellElement.addEventListener('touchend', (e) => {
                clearTimeout(longPressTimer);
            });

            gameBoard.appendChild(cellElement);
        }
    }
}

// Reveal a cell
function revealCell(row, col) {
    if (board[row][col].revealed || board[row][col].flagged || gameOver) return;

    board[row][col].revealed = true;
    if (board[row][col].isMine) {
        gameOver = true;
        clearInterval(interval);
        alert('Game Over! You hit a mine.');
    } else if (board[row][col].adjacentMines === 0) {
        revealAdjacentCells(row, col);
    }
    renderBoard();
}

// Reveal adjacent cells recursively
function revealAdjacentCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (!board[newRow][newCol].revealed && !board[newRow][newCol].isMine) {
                    revealCell(newRow, newCol);
                }
            }
        }
    }
}

// Flag a cell
function flagCell(row, col) {
    if (board[row][col].revealed || gameOver) return;

    board[row][col].flagged = !board[row][col].flagged;
    flagCount += board[row][col].flagged ? -1 : 1;
    flagsDisplay.textContent = `Flags: ${flagCount}`;

    renderBoard();
}

// Start the game
initGame();
