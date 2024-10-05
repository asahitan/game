const gameBoard = document.getElementById('game-board');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const startButton = document.getElementById('start-btn');
const restartButton = document.getElementById('restart-btn');
const boardSize = 10;
const numMines = 10;
let board = [];
let timer = 0;
let score = 0;
let timerInterval = null;
let gameStarted = false;

// Initialize the game
function init() {
    resetGame();
    renderBoard(board);
}

// Create the board with mines
function createBoard(size, mines) {
    const board = [];
    for (let i = 0; i < size; i++) {
        const row = [];
        for (let j = 0; j < size; j++) {
            row.push({
                isMine: false,
                revealed: false,
                neighborMines: 0
            });
        }
        board.push(row);
    }
    
    // Place mines randomly
    let placedMines = 0;
    while (placedMines < mines) {
        const row = Math.floor(Math.random() * size);
        const col = Math.floor(Math.random() * size);
        if (!board[row][col].isMine) {
            board[row][col].isMine = true;
            placedMines++;
        }
    }
    
    // Calculate neighboring mines
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            if (!board[row][col].isMine) {
                board[row][col].neighborMines = countNeighborMines(board, row, col);
            }
        }
    }
    
    return board;
}

// Count mines around a cell
function countNeighborMines(board, row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    let count = 0;
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            if (board[newRow][newCol].isMine) {
                count++;
            }
        }
    }
    return count;
}

// Render the board
function renderBoard(board) {
    gameBoard.innerHTML = '';
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

// Handle cell click
function handleCellClick(event) {
    if (!gameStarted) return;

    const row = parseInt(event.target.dataset.row);
    const col = parseInt(event.target.dataset.col);
    
    const cellData = board[row][col];
    if (cellData.revealed) return;

    cellData.revealed = true;
    event.target.classList.add('revealed');
    score += 10;  // Increase score by 10 for each revealed cell
    updateScore();
    
    if (cellData.isMine) {
        event.target.classList.add('mine');
        alert('Game Over!');
        stopTimer();
        return;
    }
    
    if (cellData.neighborMines > 0) {
        event.target.textContent = cellData.neighborMines;
    } else {
        revealAdjacentCells(row, col);
    }

    // Check if the player has won
    if (checkWin()) {
        alert('You Win!');
        stopTimer();
    }
}

// Reveal adjacent cells if no neighboring mines
function revealAdjacentCells(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1]
    ];
    for (const [dx, dy] of directions) {
        const newRow = row + dx;
        const newCol = col + dy;
        if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
            const cellData = board[newRow][newCol];
            const cellElement = document.querySelector(`[data-row="${newRow}"][data-col="${newCol}"]`);
            if (!cellData.revealed && !cellData.isMine) {
                cellData.revealed = true;
                cellElement.classList.add('revealed');
                score += 10;  // Increase score for each revealed adjacent cell
                updateScore();
                if (cellData.neighborMines > 0) {
                    cellElement.textContent = cellData.neighborMines;
                } else {
                    revealAdjacentCells(newRow, newCol);
                }
            }
        }
    }
}

// Check if the player has revealed all non-mine cells
function checkWin() {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = board[row][col];
            if (!cell.isMine && !cell.revealed) {
                return false;
            }
        }
    }
    return true;
}

// Timer Functions
function startTimer() {
    timerInterval = setInterval(() => {
        timer++;
        timerElement.textContent = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(timerInterval);
}

function resetTimer() {
    timer = 0;
    timerElement.textContent = timer;
}

// Score Functions
function resetScore() {
    score = 0;
    scoreElement.textContent = score;
}

function updateScore() {
    scoreElement.textContent = score;
}

// Start game function
function startGame() {
    gameStarted = true;
    startButton.disabled = true;
    restartButton.disabled = false;
    startTimer();
}

// Reset the game
function resetGame() {
    stopTimer();
    resetTimer();
    resetScore();
    board = createBoard(boardSize, numMines);
    renderBoard(board);
    gameStarted = false;
    startButton.disabled = false;
    restartButton.disabled = true;
}

// Event listeners for start/restart buttons
startButton.addEventListener('click
