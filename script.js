const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

const words = ['javascript', 'coding', 'challenge', 'programming', 'fast', 'game', 'developer', 'function', 'variable', 'script'];

let time = 10;
let score = 0;
let currentWord = '';
let isPlaying = false;
let timerInterval;

// Start Game
startButton.addEventListener('click', startGame);

function startGame() {
    if (isPlaying) return;  // Prevents multiple game starts
    isPlaying = true;
    score = 0;
    time = 10;
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = true;
    startButton.textContent = 'Game in Progress...';
    showNewWord();
    timerInterval = setInterval(updateTime, 1000);
}

// Show a new random word
function showNewWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
    wordInput.value = '';
}

// Update time and check if game is over
function updateTime() {
    time--;
    timeDisplay.textContent = time;

    if (time === 0) {
        endGame();
    }
}

// End the game
function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    clearInterval(timerInterval);
    wordDisplay.textContent = `Game Over! Your final score is ${score}.`;
    startButton.disabled = false;
    startButton.textContent = 'Start Game';
}

// Check word input against the displayed word
wordInput.addEventListener('input', checkMatch);

function checkMatch() {
    if (wordInput.value === currentWord) {
        score++;
        scoreDisplay.textContent = score;
        showNewWord();
        time = 10;  // Reset time for each correct word
    }
}
