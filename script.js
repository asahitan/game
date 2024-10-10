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
let isPlaying = false;
let tps = 0;
let gameMode = "60s";
let gameInterval;
let lives = 3;
let customTime = 60;

const modeDescriptions = {
    "60s": "60-Second Mode",
    "10s": "10-Second Challenge Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives",
    "custom": "Custom Mode"
};

function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    
    switch (gameMode) {
        case "60s":
            timeLeft = 60;
            break;
        case "10s":
            timeLeft = 10;
            break;
        case "5s-lives":
        case "7s-lives":
        case "3s-lives":
        case "2s-lives":
            timeLeft = parseInt(gameMode.split('-')[0]);
            livesContainer.style.display = "block";
            lives = 3;
            livesDisplay.textContent = lives;
            break;
        case "custom":
            timeLeft = customTime;
            break;
    }
    timeDisplay.textContent = timeLeft;
}

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
    isPlaying = true;
    score = 0;
    totalWordsTyped = 0;
    resultMessage.textContent = "";
    wordInput.value = "";
    wordInput.focus();
    startButton.disabled = true;
    restartButton.disabled = false;
    updateModeDisplayAndTimer();
    setWord();
    gameInterval = setInterval(updateGame, 1000);
}

function updateGame() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;

    if (timeLeft <= 0 || lives <= 0) {
        endGame();
    }
}

function setWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
}

function checkWord() {
    if (wordInput.value === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        setWord();
        wordInput.value = "";

        tps = totalWordsTyped / (60 - timeLeft);
        tpsDisplay.textContent = tps.toFixed(2);
    }
}

function endGame() {
    clearInterval(gameInterval);
    isPlaying = false;
    resultMessage.textContent = `Game Over! Your score: ${score}`;
    startButton.disabled = false;
    restartButton.disabled = true;
}

function restartGame() {
    clearInterval(gameInterval);
    timeLeft = 60;
    score = 0;
    totalWordsTyped = 0;
    tps = 0;
    resultMessage.textContent = "";
    wordInput.value = "";
    scoreDisplay.textContent = score;
    tpsDisplay.textContent = tps.toFixed(2);
    timeDisplay.textContent = timeLeft;
    startButton.disabled = false;
    restartButton.disabled = true;
    livesContainer.style.display = "none";
}

startButton.addEventListener("click", startGame);
restartButton.addEventListener("click", restartGame);
wordInput.addEventListener("input", checkWord);
modeSelect.addEventListener("change", function() {
    gameMode = this.value;
    updateModeDisplayAndTimer();
    if (gameMode === "custom") {
        customTimeInput.style.display = "block";
        customTimeLabel.style.display = "block";
    } else {
        customTimeInput.style.display = "none";
        customTimeLabel.style.display = "none";
    }
});

menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});

closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});

darkModeToggle.addEventListener("change", function() {
    document.body.classList.toggle("dark-mode", this.checked);
});

customTimeInput.addEventListener("input", function() {
    customTime = parseInt(this.value) || 60;
});
