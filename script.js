const board = document.getElementById('game-board');
const timerDisplay = document.getElementById('timer');
const scoreDisplay = document.getElementById('score');
const restartBtn = document.getElementById('restart-btn');
const difficultySelect = document.getElementById('difficulty');

let boardSize;
let mineCount;
let boardArray;
let timer;
let score;
let isGameActive;
let intervalId;

// Difficulty settings
const settings = {
    easy: { size: 8, mines: 10 },
    medium: { size: 12, mines: 20 },
    hard: { size: 16, mines: 40 },
};

// Initialize the game
function initGame() {
    clearInterval(intervalId);
    const difficulty = difficultySelect.value;
    boardSize = settings[difficulty].size;
    mineCount = settings[difficulty].mines;

    timer = 0;
    score = 0;
    isGameActive = true;
    boardArray = [];
    timerDisplay.textContent = `Time: 0`;
    scoreDisplay.textContent = `Score: 0`;

    generateBoard();
    placeMines();
    updateNumbers();
    startTimer();
}

// Generate the game board
function generateBoard() {
    board.innerHTML = '';
    board.style.gridTemplateColumns = `repeat(${boardSize}, 30px)`;
    board.style.gridTemplateRows = `repeat(${boardSize}, 30px)`;

    for (let i = 0; i < boardSize; i++) {
        boardArray[i] = [];
        for (let j = 0; j < boardSize; j++) {
            const tile = document.createElement('div');
            tile.classList.add('tile');
            tile.dataset.row = i;
            tile.dataset.col = j;
            tile.addEventListener('click', handleTileClick);
            board.appendChild(tile);
            boardArray[i][j] = {
                element: tile,
                isMine: false,
                isRevealed: false,
                isFlagged: false,
                number: 0,
            };
        }
    }
}

// Place mines randomly
function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);

        if (!boardArray[row][col].isMine) {
            boardArray[row][col].isMine = true;
            placedMines++;
        }
    }
}

// Calculate surrounding numbers
function updateNumbers() {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (boardArray[i][j].isMine) continue;

            let mineCount = 0;
            directions.forEach(([dx, dy]) => {
                const x = i + dx;
                const y = j + dy;

                if (x >= 0 && x < boardSize && y >= 0 && y < boardSize && boardArray[x][y].isMine) {
                    mineCount++;
                }
            });

            boardArray[i][j].number = mineCount;
        }
    }
}

// Handle tile click
function handleTileClick(event) {
    if (!isGameActive) return;

    const row = +event.target.dataset.row;
    const col = +event.target.dataset.col;
    const tile = boardArray[row][col];

    if (tile.isRevealed) return;

    tile.isRevealed = true;
    tile.element.classList.add('revealed');

    if (tile.isMine) {
        tile.element.textContent = '💣';
        gameOver(false);
    } else {
        if (tile.number > 0) {
            tile.element.textContent = tile.number;
        } else {
            revealAdjacentTiles(row, col);
        }

        score++;
        scoreDisplay.textContent = `Score: ${score}`;

        if (checkWin()) {
            gameOver(true);
        }
    }
}

// Reveal adjacent empty tiles recursively
function revealAdjacentTiles(row, col) {
    const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],         [0, 1],
        [1, -1], [1, 0], [1, 1],
    ];

    directions.forEach(([dx, dy]) => {
        const x = row + dx;
        const y = col + dy;

        if (x >= 0 && x < boardSize && y >= 0 && y < boardSize) {
            const tile = boardArray[x][y];

            if (!tile.isRevealed && !tile.isMine) {
                tile.isRevealed = true;
                tile.element.classList.add('revealed');

                if (tile.number > 0) {
                    tile.element.textContent = tile.number;
                } else {
                    revealAdjacentTiles(x, y);
                }
            }
        }
    });
}

// Start the timer
function startTimer() {
    intervalId = setInterval(() => {
        timer++;
        timerDisplay.textContent = `Time: ${timer}`;
    }, 1000);
}

// End the game
function gameOver(isWin) {
    isGameActive = false;
    clearInterval(intervalId);

    if (isWin) {
        alert('You won!');
    } else {
        alert('You hit a mine! Game over.');
    }
}

// Check if the player has won
function checkWin() {
    let revealedCount = 0;

    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            if (boardArray[i][j].isRevealed && !boardArray[i][j].isMine) {
                revealedCount++;
            }
        }
    }

    return revealedCount === (boardSize * boardSize - mineCount);
}

// Event listeners
restartBtn.addEventListener('click', initGame);
difficultySelect.addEventListener('change', initGame);

// Initialize the game on page load
initGame();
