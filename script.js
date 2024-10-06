const board = document.getElementById('board');
const timerElement = document.getElementById('timer');
const scoreElement = document.getElementById('score');
const popup = document.getElementById('popup');
const restartButton = document.getElementById('restart-button');

let gridSize = 10;
let bombCount = 10;
let tiles = [];
let timer = 0;
let interval = null;
let score = 0;
let gameEnded = false;

function startTimer() {
    interval = setInterval(() => {
        timer++;
        timerElement.innerText = timer;
    }, 1000);
}

function stopTimer() {
    clearInterval(interval);
}

function createBoard() {
    board.innerHTML = '';
    tiles = [];
    score = 0;
    timer = 0;
    gameEnded = false;
    timerElement.innerText = timer;
    scoreElement.innerText = score;
    popup.classList.add('hidden');
    stopTimer();
    
    // Generate random bombs
    let bombPositions = new Set();
    while (bombPositions.size < bombCount) {
        bombPositions.add(Math.floor(Math.random() * gridSize * gridSize));
    }

    // Create tiles
    for (let i = 0; i < gridSize * gridSize; i++) {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        tile.dataset.index = i;
        if (bombPositions.has(i)) {
            tile.dataset.bomb = 'true';
        }
        tile.addEventListener('click', () => revealTile(tile));
        tiles.push(tile);
        board.appendChild(tile);
    }
}

function revealTile(tile) {
    if (gameEnded || tile.classList.contains('revealed')) return;

    if (!interval) {
        startTimer();
    }

    tile.classList.add('revealed');

    if (tile.dataset.bomb === 'true') {
        tile.classList.add('bomb');
        endGame(false);
    } else {
        score++;
        scoreElement.innerText = score;

        if (score === gridSize * gridSize - bombCount) {
            endGame(true);
        }
    }
}

function endGame(won) {
    gameEnded = true;
    stopTimer();
    
    if (!won) {
        tiles.forEach(tile => {
            if (tile.dataset.bomb === 'true') {
                tile.classList.add('bomb');
            }
        });
        popup.classList.remove('hidden');
    } else {
        alert('Congratulations! You won!');
        createBoard();
    }
}

restartButton.addEventListener('click', createBoard);

createBoard();
