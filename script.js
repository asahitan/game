const grid = document.getElementById("minesweeper-grid");
const restartBtn = document.getElementById("restartBtn");
const timerDisplay = document.getElementById("timer");
const scoreDisplay = document.getElementById("score");
const difficultySelect = document.getElementById("difficulty");

let rows, cols, mineCount;
let tiles = [];
let mines = [];
let timer;
let time = 0;
let score = 0;
let gameActive = true;

const difficulties = {
    easy: { rows: 10, cols: 10, mines: 15 },
    medium: { rows: 15, cols: 15, mines: 40 },
    hard: { rows: 20, cols: 20, mines: 70 }
};

const initializeGame = () => {
    grid.innerHTML = "";
    tiles = [];
    mines = [];
    time = 0;
    score = 0;
    gameActive = true;
    timerDisplay.innerText = time;
    scoreDisplay.innerText = score;
    clearInterval(timer);

    // Get selected difficulty
    const difficulty = difficultySelect.value;
    rows = difficulties[difficulty].rows;
    cols = difficulties[difficulty].cols;
    mineCount = difficulties[difficulty].mines;

    // Adjust grid size class
    grid.className = `grid ${difficulty}`;

    // Generate grid
    for (let row = 0; row < rows; row++) {
        let rowArr = [];
        for (let col = 0; col < cols; col++) {
            const tile = document.createElement("div");
            tile.dataset.row = row;
            tile.dataset.col = col;
            tile.addEventListener("click", handleTileClick);
            tile.addEventListener("contextmenu", handleRightClick);
            grid.appendChild(tile);
            rowArr.push(tile);
        }
        tiles.push(rowArr);
    }

    // Place mines
    for (let i = 0; i < mineCount; i++) {
        let row, col;
        do {
            row = Math.floor(Math.random() * rows);
            col = Math.floor(Math.random() * cols);
        } while (mines.some(mine => mine.row === row && mine.col === col));
        mines.push({ row, col });
        tiles[row][col].dataset.mine = "true";
    }

    startTimer();
};

const startTimer = () => {
    timer = setInterval(() => {
        if (!gameActive) return;
        time++;
        timerDisplay.innerText = time;
    }, 1000);
};

const handleTileClick = (e) => {
    if (!gameActive) return;

    const tile = e.target;
    const row = parseInt(tile.dataset.row);
    const col = parseInt(tile.dataset.col);

    if (tile.classList.contains("revealed") || tile.classList.contains("flagged")) return;

    if (tile.dataset.mine) {
        // Game over
        tile.classList.add("mine");
        endGame(false);
    } else {
        revealTile(row, col);
        score += 10;
        scoreDisplay.innerText = score;
    }
};

const revealTile = (row, col) => {
    const tile = tiles[row][col];
    if (tile.classList.contains("revealed")) return;

    tile.classList.add("revealed");

    const minesAround = countMinesAround(row, col);
    if (minesAround > 0) {
        tile.innerText = minesAround;
    } else {
        revealSurroundingTiles(row, col);
    }
};

const countMinesAround = (row, col) => {
    let mineCount = 0;
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                if (tiles[r][c].dataset.mine) mineCount++;
            }
        }
    }
    return mineCount;
};

const revealSurroundingTiles = (row, col) => {
    for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
                revealTile(r, c);
            }
        }
    }
};

const handleRightClick = (e) => {
    e.preventDefault();
    if (!gameActive) return;

    const tile = e.target;
    if (tile.classList.contains("revealed")) return;

    tile.classList.toggle("flagged");
};

const endGame = (win) => {
    gameActive = false;
    clearInterval(timer);
    if (win) {
        alert("Congratulations! You won!");
    } else {
        alert("Game Over! You hit a mine.");
        revealAllMines();
    }
};

const revealAllMines = () => {
    mines.forEach(mine => {
        const mineTile = tiles[mine.row][mine.col];
        mineTile.classList.add("mine");
    });
};

restartBtn.addEventListener("click", initializeGame);
difficultySelect.addEventListener("change", initializeGame);

// Initialize the game when the page loads
window.onload = initializeGame;
