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

function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    timeLeft = gameMode === "custom" ? customTime : getGameModeTime();
    timeDisplay.textContent = timeLeft;
}

function getGameModeTime() {
    switch (gameMode) {
        case "60s": return 60;
        case "10s": return 10;
        case "5s-lives": return 5;
        case "3s-lives": return 3;
        case "7s-lives": return 7;
        case "2s-lives": return 2;
        default: return 60;
    }
}

wordInput.addEventListener("input", matchWords);
startButton.addEventListener("click", startGame);
menuToggle.addEventListener("click", openSideMenu);
closeMenuButton.addEventListener("click", closeSideMenu);
darkModeToggle.addEventListener("change", toggleDarkMode);
customTimeInput.addEventListener("input", updateCustomTime);

function updateCustomTime() {
    customTime = customTimeInput.value;
    timeDisplay.textContent = customTime;
}

function startGame() {
    if (!isPlaying) {
        isPlaying = true;
        score = 0;
        totalWordsTyped = 0;
        wordInput.value = "";
        wordInput.disabled = false;
        resultMessage.textContent = "";
        lives = 3;
        updateModeDisplayAndTimer();
        livesContainer.style.display = gameMode.includes("lives") ? "block" : "none";
        livesDisplay.textContent = lives;
        startButton.disabled = true;
        wordInput.focus();
        nextWord();
        gameInterval = setInterval(countdown, 1000);
        
        // Disable mode change and menu toggle during the game
        modeSelect.disabled = true;
        menuToggle.style.pointerEvents = "none"; // Disable the menu button
    }
}

function countdown() {
    timeLeft--;
    timeDisplay.textContent = timeLeft;
    if (timeLeft === 0 || (gameMode.includes("lives") && lives <= 0)) {
        endGame();
    }
}

function nextWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    currentWord = words[randomIndex];
    wordDisplay.textContent = currentWord;
}

function matchWords() {
    if (wordInput.value.toLowerCase() === currentWord.toLowerCase()) {
        wordInput.value = "";
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        nextWord();
    }
}

function endGame() {
    clearInterval(gameInterval);
    isPlaying = false;
    startButton.disabled = false;
    wordInput.disabled = true;
    tps = totalWordsTyped / getGameModeTime();
    tpsDisplay.textContent = tps.toFixed(2);
    resultMessage.textContent = `Game Over! Your score is ${score}.`;
    
    // Re-enable mode change and menu toggle after the game ends
    modeSelect.disabled = false;
    menuToggle.style.pointerEvents = "auto"; // Re-enable the menu button
}

function openSideMenu() {
    sideMenu.style.width = "250px";
}

function closeSideMenu() {
    sideMenu.style.width = "0";
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
}
