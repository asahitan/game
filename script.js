const gameBoard = document.getElementById('gameBoard');
const difficultySelector = document.getElementById('difficulty');
const timerDisplay = document.getElementById('timer');
const minesDisplay = document.getElementById('mines');
const flagsDisplay = document.getElementById('flags');
const restartButton = document.getElementById('restart');

let gridSize, mineCount;
let tileArray = [];
let minesLeft, flagsPlaced;
let timer, timeElapsed;

difficultySelector.addEventListener('change', startGame);
restartButton.addEventListener('click', startGame);

function startGame() {
    clearInterval(timer);
    timeElapsed = 0;
    timerDisplay.textContent = `Time: 0s`;
    flagsPlaced = 0;
    flagsDisplay.textContent = `Flags: 0`;

    const difficulty = difficultySelector.value;
    if (difficulty === 'easy') {
        gridSize = 8;
        mineCount = 10;
    } else if (difficulty === 'medium') {
        gridSize = 12;
        mineCount = 20;
    } else if (difficulty === 'hard') {
        gridSize = 16;
        mineCount = 40;
    }

    minesLeft = mineCount;
    minesDisplay.textContent = `Mines Left: ${mineCount}`;

    generateBoard();
    startTimer();
}

function generateBoard() {
    gameBoard.innerHTML = '';  // Clear the board
    gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

    tileArray = [];
    const minePositions = generateMinePositions();

    for (let row = 0; row < gridSize; row++) {
        const rowArray = [];
        for (let col = 0; col < gridSize; col++) {
            const tile = document.createElement('div');
            tile.classList.add('tile', 'hidden');
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.addEventListener('click', handleTileClick);
            tile.addEventListener('contextmenu', handleRightClick);
            tile.addEventListener('touchstart', handleTouchFlag, { passive: false });  // Support for mobile
            gameBoard.appendChild(tile);
            rowArray.push({ tile, isMine: minePositions.includes(`${row}-${col}`), isFlagged: false, revealed: false });
        }
        tileArray.push(rowArray);
    }
}

function generateMinePositions() {
    const positions = [];
    while (positions.length < mineCount) {
        const row = Math.floor(Math.random() * gridSize);
        const col = Math.floor(Math.random() * gridSize);
        const pos = `${row}-${col}`;
        if (!positions.includes(pos)) {
            positions.push(pos);
        }
    }
    return positions;
}

function handleTileClick(e) {
    const tile = e.target;
    const row = tile.dataset.row;
    const col = tile.dataset.col;
    revealTile(row, col);
}

function handleRightClick(e) {
    e.preventDefault();
    const tile = e.target;
    const row = tile.dataset.row;
    const col = tile.dataset.col;
    toggleFlag(row, col);
}

function handleTouchFlag(e) {
    e.preventDefault();
    const tile = e.target;
    const row = tile.dataset.row;
    const col = tile.dataset.col;
    toggleFlag(row, col);
}

function toggleFlag(row, col) {
    const tileData = tileArray[row][col];
    if (tileData.revealed) return;
    
    if (!tileData.isFlagged && flagsPlaced < mineCount) {
        tileData.tile.classList.add('flagged');
        tileData.isFlagged = true;
        flagsPlaced++;
    } else if (tileData.isFlagged) {
        tileData.tile.classList.remove('flagged');
        tileData.isFlagged = false;
        flagsPlaced--;
    }
    
    flagsDisplay.textContent = `Flags: ${flagsPlaced}`;
}

function revealTile(row, col) {
    const tileData = tileArray[row][col];
    if (tileData.revealed || tileData.isFlagged) return;

    tileData.revealed = true;
    tileData.tile.classList.remove('hidden');

    if (tileData.isMine) {
        tileData.tile.classList.add('mine');
        endGame(false);  // Lose game
    } else {
        const minesAround = countMinesAround(row, col);
        if (minesAround > 0) {
            tileData.tile.textContent = minesAround;
        } else {
            // Reveal surrounding tiles if no mines around
            revealSurroundingTiles(row, col);
        }
    }

    checkWinCondition();
}

function countMinesAround(row, col) {
    const directions = [-1, 0, 1];
    let count = 0;

    directions.forEach(dRow => {
        directions.forEach(dCol => {
            if (dRow === 0 && dCol === 0) return;
            const newRow = parseInt(row) + dRow;
            const newCol = parseInt(col) + dCol;
            if (isValidTile(newRow, newCol) && tileArray[newRow][newCol].isMine) {
                count++;
            }
        });
    });

    return count;
}

function revealSurroundingTiles(row, col) {
    const directions = [-1, 0, 1];
    
    directions.forEach(dRow => {
        directions.forEach(dCol => {
            const newRow = parseInt(row) + dRow;
            const newCol = parseInt(col) + dCol;
            if (isValidTile(newRow, newCol)) {
                revealTile(newRow, newCol);
            }
        });
    });
}

function isValidTile(row, col) {
    return row >= 0 && row < gridSize && col >= 0 && col < gridSize;
}

function checkWinCondition() {
    let revealedCount = 0;
    tileArray.forEach(row => row.forEach(tile => {
        if (tile.revealed) revealedCount++;
    }));

    if (revealedCount + mineCount === gridSize * gridSize) {
        endGame(true);  // Win game
    }
}

function endGame(won) {
    clearInterval(timer);
    if (won) {
        alert('You win!');
    } else {
        alert('You hit a mine! Game over!');
        revealAllMines();
    }
}

function revealAllMines() {
    tileArray.forEach(row => row.forEach(tile => {
        if (tile.isMine) {
            tile.tile.classList.add('mine');
            tile.tile.classList.remove('hidden');
        }
    }));
}

function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        timerDisplay.textContent = `Time: ${timeElapsed}s`;
    }, 1000);
}

startGame();  // Initialize game on page load
