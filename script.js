const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const restartButton = document.getElementById("restart-btn");
const resultMessage = document.getElementById("result-message");
const modeSelect = document.getElementById("mode-select");
const menuToggle = document.getElementById("menu-toggle");
const sideMenu = document.getElementById("side-menu");
const closeMenuButton = document.getElementById("close-menu");
const darkModeToggle = document.getElementById("dark-mode-toggle");
const livesDisplay = document.getElementById("lives-value");
const livesContainer = document.getElementById("lives");
const customTimeInput = document.getElementById("custom-time");
const customTimeLabel = document.getElementById("custom-time-label");
const currentModeDisplay = document.getElementById("current-mode-display");

let words = ["javascript", "developer", "framework", "performance", "syntax", "debugging", "algorithm", "data"];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let tps = 0;
let isPlaying = false;
let gameInterval;
let gameMode = "60s";
let lives = 3;
let customTime = 60;

// Handle mode switching
function updateModeDisplayAndTimer() {
    switch (gameMode) {
        case "60s":
            timeLeft = 60;
            livesContainer.style.display = "none";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            livesContainer.style.display = "none";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "5s-lives":
        case "3s-lives":
        case "7s-lives":
        case "2s-lives":
            timeLeft = parseInt(gameMode.split("s-")[0]);
            lives = 3;
            livesContainer.style.display = "inline";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "custom":
            customTimeInput.style.display = "block";
            customTimeLabel.style.display = "block";
            customTime = customTimeInput.value || 60;
            timeLeft = customTime;
            livesContainer.style.display = "none";
            break;
    }
}

function startGame() {
    isPlaying = true;
    score = 0;
    totalWordsTyped = 0;
    updateScoreAndTPS();
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = true;
    restartButton.disabled = false;
    startButton.textContent = "Game in Progress...";
    resultMessage.textContent = "";
    loadNextWord();
    gameInterval = setInterval(updateGameTimer, 1000);
}

function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    wordInput.disabled = true;
    startButton.disabled = false;
    restartButton.disabled = true;
    startButton.textContent = "Start Game";
    resultMessage.textContent = `Game Over! You scored ${score} points and had a TPS of ${tps.toFixed(2)}.`;
}

function updateScoreAndTPS() {
    scoreDisplay.textContent = score;
    tps = totalWordsTyped / (60 - timeLeft || 1);
    tpsDisplay.textContent = tps.toFixed(2);
}

function loadNextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
    wordInput.value = "";
}

function updateGameTimer() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

// Restart Game
function restartGame() {
    clearInterval(gameInterval);
    isPlaying = false;
    startGame();
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        totalWordsTyped++;
        loadNextWord();
        updateScoreAndTPS();
    }
});

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);

menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});

closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});

darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

modeSelect.addEventListener("change", (e) => {
    gameMode = e.target.value;
    updateModeDisplayAndTimer();
});

customTimeInput.addEventListener("input", (e) => {
    customTime = parseInt(e.target.value) || 60;
    timeLeft = customTime;
});
