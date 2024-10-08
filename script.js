let gridSize = 10;
let mineCount = 15;
let grid = [];
let revealedCount = 0;
let timer;
let timeElapsed = 0;
let score = 0;
let gameActive = true;

document.addEventListener('DOMContentLoaded', () => {
    createGrid();
    document.getElementById('restartBtn').addEventListener('click', restartGame);
    startTimer();
});

function createGrid() {
    let minesweeperGrid = document.getElementById('minesweeperGrid');
    minesweeperGrid.innerHTML = '';
    grid = [];
    revealedCount = 0;
    score = 0;
    gameActive = true;

    for (let i = 0; i < gridSize; i++) {
        let row = [];
        for (let j = 0; j < gridSize; j++) {
            let cell = document.createElement('div');
            cell.classList.add('cell');
            cell.setAttribute('data-row', i);
            cell.setAttribute('data-col', j);
            cell.addEventListener('click', () => revealCell(i, j));
            cell.addEventListener('contextmenu', (e) => {
                e.preventDefault();
                flagCell(i, j);
            });
            minesweeperGrid.appendChild(cell);
            row.push({
                mine: false,
                revealed: false,
                flagged: false,
                element: cell
            });
        }
        grid.push(row);
    }

    placeMines();
    updateScore();
}

function placeMines() {
    let minesPlaced = 0;
    while (minesPlaced < mineCount) {
        let row = Math.floor(Math.random() * gridSize);
        let col = Math.floor(Math.random() * gridSize);
        if (!grid[row][col].mine) {
            grid[row][col].mine = true;
            minesPlaced++;
        }
    }
}

function revealCell(row, col) {
    if (!gameActive || grid[row][col].revealed || grid[row][col].flagged) return;
    
    grid[row][col].revealed = true;
    revealedCount++;
    grid[row][col].element.classList.add('revealed');

    if (grid[row][col].mine) {
        gameOver(false);
        return;
    }

    let mineCount = countMinesAround(row, col);
    if (mineCount > 0) {
        grid[row][col].element.textContent = mineCount;
    } else {
        revealSurroundingCells(row, col);
    }

    if (revealedCount === gridSize * gridSize - mineCount) {
        gameOver(true);
    }
}

function revealSurroundingCells(row, col) {
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize) {
                revealCell(newRow, newCol);
            }
        }
    }
}

function countMinesAround(row, col) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let newRow = row + i;
            let newCol = col + j;
            if (newRow >= 0 && newRow < gridSize && newCol >= 0 && newCol < gridSize && grid[newRow][newCol].mine) {
                count++;
            }
        }
    }
    return count;
}

function flagCell(row, col) {
    if (!gameActive || grid[row][col].revealed) return;

    if (!grid[row][col].flagged) {
        grid[row][col].flagged = true;
        grid[row][col].element.classList.add('flagged');
    } else {
        grid[row][col].flagged = false;
        grid[row][col].element.classList.remove('flagged');
    }
}

function gameOver(won) {
    gameActive = false;
    clearInterval(timer);
    if (won) {
        alert('Congratulations, you won!');
    } else {
        alert('Game Over! You clicked on a mine.');
        revealAllMines();
    }
}

function revealAllMines() {
    for (let i = 0; i < gridSize; i++) {
        for (let j = 0; j < gridSize; j++) {
            if (grid[i][j].mine) {
                grid[i][j].element.textContent = '💣';
                grid[i][j].element.classList.add('revealed');
            }
        }
    }
}

function restartGame() {
    clearInterval(timer);
    timeElapsed = 0;
    document.getElementById('timer').textContent = 'Time: 0';
    createGrid();
    startTimer();
}

function startTimer() {
    timer = setInterval(() => {
        timeElapsed++;
        document.getElementById('timer').textContent = 'Time: ' + timeElapsed;
    }, 1000);
}

function updateScore() {
    document.getElementById('score').textContent = 'Score: ' + score;
}
