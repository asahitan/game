let board = [];
let mineCount = 10;
let gameBoard = document.getElementById('game-board');
let score = 0;
let time = 0;
let highScore = localStorage.getItem('highScore') || 0;
let timerInterval;

// Initialize the game
function initGame() {
    board = createBoard(10, 10, mineCount);
    displayBoard(board);
    resetTimer();
    score = 0;
    document.getElementById('score').textContent = score;
    document.getElementById('highScore').textContent = highScore;
}

// Create the board with mines
function createBoard(rows, cols, mineCount) {
    let board = Array(rows).fill().map(() => Array(cols).fill(0));
    // Add mines
    for (let i = 0; i < mineCount; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * rows);
            col = Math.floor(Math.random() * cols);
        } while (board[row][col] === 'M');
        board[row][col] = 'M';
    }
    // Calculate numbers
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] === 'M') continue;
            board[r][c] = calculateMines(board, r, c);
        }
    }
    return board;
}

// Calculate the number of mines around a tile
function calculateMines(board, row, col) {
    let mines = 0;
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < board.length && c >= 0 && c < board[0].length && board[r][c] === 'M') {
                mines++;
            }
        }
    }
    return mines;
}

// Display the board on the screen
function displayBoard(board) {
    gameBoard.innerHTML = '';
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener('click', handleCellClick);
            gameBoard.appendChild(cell);
        }
    }
}

// Handle a click on a cell
function handleCellClick(event) {
    let row = parseInt(event.target.dataset.row);
    let col = parseInt(event.target.dataset.col);
    if (board[row][col] === 'M') {
        event.target.classList.add('mine');
        alert('Game Over!');
        clearInterval(timerInterval);
    } else {
        event.target.textContent = board[row][col];
        event.target.classList.add('open');
        score++;
        document.getElementById('score').textContent = score;
        checkWin();
    }
}

// Check if the player has won
function checkWin() {
    let openCells = document.querySelectorAll('.cell.open').length;
    if (openCells === (board.length * board[0].length) - mineCount) {
        alert('You win!');
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('highScore', highScore);
        }
        clearInterval(timerInterval);
    }
}

// Timer logic
function startTimer() {
    let startTime = Date.now();
    timerInterval = setInterval(() => {
        let elapsed = Date.now() - startTime;
        let minutes = Math.floor(elapsed / 60000);
        let seconds = Math.floor((elapsed % 60000) / 1000);
        document.getElementById('time').textContent = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    document.getElementById('time').textContent = '00:00';
    startTimer();
}

// Restart the game
document.getElementById('restartBtn').addEventListener('click', initGame);

// Initialize the game on page load
initGame();
