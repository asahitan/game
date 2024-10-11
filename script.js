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
let tps = 0;
let gameMode = "60s"; // Default mode
let gameInterval;
let lives = 3; // Default lives for challenge modes
let customTime = 60; // Default custom time

const modeDescriptions = {
    "60s": "60-Second Mode",
    "10s": "10-Second Challenge Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives",
    "custom": "Custom Mode"
};

// Listen for Start Game click
startButton.addEventListener("click", startGame);

// Listen for Restart Game click
restartButton.addEventListener("click", restartGame);

// Typing input listener
wordInput.addEventListener("input", checkInput);

// Restart game function
function restartGame() {
    clearInterval(gameInterval); // Clear any running intervals
    startGame(); // Start a new game
}

// Start game function
function startGame() {
    score = 0;
    totalWordsTyped = 0;
    timeLeft = gameMode === "custom" ? parseInt(customTimeInput.value) || 60 : getModeTime();
    lives = 3;
    livesContainer.style.display = gameMode.includes("lives") ? "block" : "none";
    wordInput.value = "";
    wordInput.disabled = false;
    isPlaying = true;
    resultMessage.textContent = "";
    startButton.disabled = true;
    restartButton.disabled = false; // Enable restart button
    wordInput.focus();
    displayNewWord();
    updateGameInfo();
    gameInterval = setInterval(updateTime, 1000);
}

// End game function
function endGame() {
    clearInterval(gameInterval);
    wordInput.disabled = true;
    startButton.disabled = false;
    restartButton.disabled = true; // Disable restart button after the game ends
    resultMessage.textContent = `Game over! You scored ${score} points.`;
}

// Check input
function checkInput() {
    if (wordInput.value === currentWord) {
        score++;
        totalWordsTyped++;
        displayNewWord();
        wordInput.value = "";
        updateGameInfo();
    }
}

// Display new word
function displayNewWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordDisplay.textContent = currentWord;
}

// Update time
function updateTime() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft === 0 || (lives === 0 && gameMode.includes("lives"))) {
        endGame();
    }

    if (gameMode.includes("lives") && timeLeft > 0) {
        updateLives();
    }
}

// Update game info
function updateGameInfo() {
    scoreDisplay.textContent = score;
    tps = totalWordsTyped / ((60 - timeLeft) || 1); // Prevent division by zero
    tpsDisplay.textContent = tps.toFixed(2);
}

// Update lives in challenge mode
function updateLives() {
    if (wordInput.value !== currentWord && wordInput.value.length >= currentWord.length) {
        lives--;
        livesDisplay.textContent = lives;
        wordInput.value = ""; // Reset input
        displayNewWord(); // Show a new word
    }
}

// Get mode time
function getModeTime() {
    switch (gameMode) {
        case "60s":
            return 60;
        case "10s":
            return 10;
        case "5s-lives":
            return 5;
        case "3s-lives":
            return 3;
        case "7s-lives":
            return 7;
        case "2s-lives":
            return 2;
        default:
            return 60;
    }
}
