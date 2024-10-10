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
const popup = document.getElementById("restart-popup");

let words = ["javascript", "html", "css", "react", "node", "express", "mongodb", "typescript", "bootstrap"];
let score = 0;
let totalWordsTyped = 0;
let tps = 0;
let lives = 3;
let timeLeft = 60;
let isPlaying = false;
let gameInterval;
let customTime;

// Display random word to type
function displayRandomWord() {
    const randomIndex = Math.floor(Math.random() * words.length);
    wordDisplay.textContent = words[randomIndex];
}

// Start the game
startButton.addEventListener("click", () => {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    totalWordsTyped = 0;
    timeLeft = customTime || 60;
    lives = modeSelect.value.includes("lives") ? 3 : null;
    wordInput.disabled = false;
    wordInput.value = "";
    wordDisplay.textContent = "";
    scoreDisplay.textContent = "0";
    tpsDisplay.textContent = "0.00";
    livesDisplay.textContent = lives ? lives : "N/A";
    livesContainer.style.display = lives ? "block" : "none";
    timeDisplay.textContent = timeLeft;
    startButton.disabled = true;
    restartButton.disabled = false;

    displayRandomWord();
    gameInterval = setInterval(() => {
        if (timeLeft > 0) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
        } else {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
});

// Event listener for word input
wordInput.addEventListener("input", () => {
    const typedWord = wordInput.value.trim();
    if (typedWord === wordDisplay.textContent) {
        score++;
        totalWordsTyped++;
        tps = (score / totalWordsTyped) * 60; // Calculate TPS
        scoreDisplay.textContent = score;
        tpsDisplay.textContent = tps.toFixed(2);
        displayRandomWord();
        wordInput.value = "";
    }
});

// End the game
function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    resultMessage.textContent = `Game Over! Your score: ${score}. Press Start Game to play again.`;
    startButton.disabled = false;
    restartButton.disabled = true;
    clearInterval(gameInterval);
}

// Restart game function
function restartGame() {
    clearInterval(gameInterval); // Clear the existing interval
    score = 0;
    totalWordsTyped = 0;
    tps = 0;
    lives = 3;
    isPlaying = false;
    wordInput.disabled = true;
    wordInput.value = "";
    wordDisplay.textContent = "";
    scoreDisplay.textContent = "0";
    tpsDisplay.textContent = "0.00";
    livesDisplay.textContent = "3";
    timeLeft = customTime || 60;
    timeDisplay.textContent = timeLeft;
    startButton.disabled = false; // Enable the start button
    restartButton.disabled = true; // Disable restart until the game starts again
    resultMessage.textContent = "Game restarted. Press Start Game to play.";
}

// Event listener for showing the popup when clicking restart
restartButton.addEventListener("click", () => {
    popup.classList.add("show");
});

// Event listener for confirming restart
document.getElementById("confirm-restart").addEventListener("click", () => {
    popup.classList.remove("show");
    restartGame();
});

// Event listener for canceling restart
document.getElementById("cancel-restart").addEventListener("click", () => {
    popup.classList.remove("show");
});

// Dark Mode Toggle
darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

// Mode Select Change
modeSelect.addEventListener("change", () => {
    const selectedMode = modeSelect.value;
    if (selectedMode === "custom") {
        customTimeLabel.style.display = "block";
        customTimeInput.style.display = "block";
        customTimeInput.value = "";
    } else {
        customTimeLabel.style.display = "none";
        customTimeInput.style.display = "none";
        customTime = selectedMode.includes("s") ? parseInt(selectedMode) : null; // Get the time in seconds
        currentModeDisplay.textContent = `Mode: ${selectedMode}`;
    }
});

// Custom Time Input Change
customTimeInput.addEventListener("input", () => {
    customTime = parseInt(customTimeInput.value);
});
