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
const customTimeInput = document.getElementById("custom-time");
const currentModeDisplay = document.getElementById("current-mode-display");

let words = ["javascript", "developer", "framework", "performance", "syntax", "debugging", "algorithm", "data"];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let isPlaying = false;
let gameInterval;
let lives = 3;

function updateModeDisplayAndTimer() {
    timeLeft = gameMode === "custom" ? parseInt(customTimeInput.value) || 60 : parseInt(gameMode.split('-')[0]);
    timeDisplay.textContent = timeLeft;
    livesContainer.style.display = gameMode.includes("lives") ? "block" : "none";
}

function startGame() {
    isPlaying = true;
    score = 0;
    totalWordsTyped = 0;
    wordInput.value = "";
    resultMessage.textContent = "";
    wordInput.disabled = false;
    startButton.disabled = true;
    restartButton.disabled = false;
    lives = 3;
    livesDisplay.textContent = lives;
    updateModeDisplayAndTimer();
    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
        } else {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
}

function restartGame() {
    clearInterval(gameInterval);
    startGame();
}

function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startButton.disabled = false;
    resultMessage.textContent = `Game Over! Score: ${score}`;
}

function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        scoreDisplay.textContent = score;
        wordInput.value = "";
        nextWord();
    }
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
