const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
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
        case "3s-lives":
        case "7s-lives":
        case "2s-lives":
            livesContainer.style.display = "block";
            timeLeft = parseInt(gameMode[0]);
            lives = 3;
            livesDisplay.textContent = lives;
            break;
        case "custom":
            timeLeft = customTime;
            break;
    }
    
    // Update display to reflect the changes in mode
    timeDisplay.textContent = timeLeft;
    scoreDisplay.textContent = score;
    tpsDisplay.textContent = tps.toFixed(2);
}

function generateRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
    isPlaying = true;
    score = 0;
    totalWordsTyped = 0;
    tps = 0;
    timeDisplay.textContent = timeLeft;
    scoreDisplay.textContent = score;
    tpsDisplay.textContent = tps.toFixed(2);
    resultMessage.textContent = "Playing...";  // Change text to Playing...
    wordInput.value = "";
    wordInput.focus();
    wordDisplay.textContent = generateRandomWord();
    
    startButton.disabled = true;  // Disable start button while playing
    
    gameInterval = setInterval(countdown, 1000);
}

function countdown() {
    if (timeLeft > 0) {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
    } else {
        endGame();
    }
}

function endGame() {
    clearInterval(gameInterval);
    isPlaying = false;
    wordDisplay.textContent = "";
    tps = totalWordsTyped / (timeLeft === 0 ? 60 : (60 - timeLeft));  // Calculate final TPS
    resultMessage.textContent = `Game Over! Final Score: ${score} | Typing Speed: ${tps.toFixed(2)} TPS`;
    startButton.disabled = false;
}

function checkInput() {
    if (wordInput.value.toLowerCase() === wordDisplay.textContent.toLowerCase()) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        tps = totalWordsTyped / (60 - timeLeft);
        tpsDisplay.textContent = tps.toFixed(2);
        wordInput.value = "";
        wordDisplay.textContent = generateRandomWord();
    } else if (gameMode.includes("-lives")) {
        lives--;
        livesDisplay.textContent = lives;
        if (lives === 0) {
            endGame();
        }
    }
}

function toggleSideMenu() {
    sideMenu.style.width = sideMenu.style.width === "250px" ? "0" : "250px";
}

function setDarkMode() {
    document.body.classList.toggle("dark-mode", darkModeToggle.checked);
}

function handleModeChange() {
    gameMode = modeSelect.value;
    livesContainer.style.display = gameMode.includes("-lives") ? "block" : "none";
    customTimeLabel.style.display = gameMode === "custom" ? "block" : "none";
    customTimeInput.style.display = gameMode === "custom" ? "block" : "none";
    updateModeDisplayAndTimer();
}

menuToggle.addEventListener("click", toggleSideMenu);
closeMenuButton.addEventListener("click", toggleSideMenu);
startButton.addEventListener("click", startGame);
wordInput.addEventListener("input", checkInput);
darkModeToggle.addEventListener("change", setDarkMode);
modeSelect.addEventListener("change", handleModeChange);
customTimeInput.addEventListener("input", () => {
    customTime = parseInt(customTimeInput.value) || 60;
    updateModeDisplayAndTimer();
});
