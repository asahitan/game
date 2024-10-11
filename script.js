const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const resultMessage = document.getElementById("result-message");
const modeSelect = document.getElementById("mode-select");
const livesDisplay = document.getElementById("lives-value");
const livesContainer = document.getElementById("lives");

let words = ["javascript", "developer", "framework", "performance", "syntax"];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let isPlaying = false;
let gameInterval;
let lives = 3;

function startGame() {
    score = 0;
    totalWordsTyped = 0;
    timeLeft = modeSelect.value === "custom" ? parseInt(document.getElementById("custom-time").value) || 60 : 60;
    wordInput.value = "";
    wordInput.disabled = false;
    isPlaying = true;
    startButton.disabled = true;
    restartButton.disabled = false;
    wordInput.focus();
    nextWord();
    updateTime();
    gameInterval = setInterval(updateTime, 1000);
}

function restartGame() {
    clearInterval(gameInterval); // Clear running intervals
    startGame(); // Restart the game by starting it fresh
}

function updateTime() {
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
    } else {
        endGame();
    }
}

function nextWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordDisplay.textContent = currentWord;
}

wordInput.addEventListener("input", () => {
    if (wordInput.value === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        nextWord();
        wordInput.value = "";
    }
});

function endGame() {
    clearInterval(gameInterval);
    wordInput.disabled = true;
    startButton.disabled = false;
    restartButton.disabled = true;
    resultMessage.textContent = `Game over! You scored ${score} points.`;
}

// Event listeners
startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
