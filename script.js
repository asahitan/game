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

let words = [];
let score = 0;
let totalWordsTyped = 0;
let tps = 0;
let timeLeft = 60;
let lives = 3;
let isPlaying = false;
let gameInterval;
let customTime = null;

// Function to start the game
startButton.addEventListener("click", startGame);

function startGame() {
    score = 0;
    totalWordsTyped = 0;
    timeLeft = customTime || 60; // use custom time or default 60 seconds
    isPlaying = true;
    wordInput.disabled = false;
    wordInput.value = "";
    wordInput.focus();
    generateWords();
    startButton.disabled = true; // Disable start button
    restartButton.disabled = false; // Enable restart button
    resultMessage.textContent = "";

    gameInterval = setInterval(() => {
        timeLeft--;
        timeDisplay.textContent = timeLeft;
        if (timeLeft <= 0) {
            endGame();
        }
    }, 1000);
}

// Function to generate random words
function generateWords() {
    const wordList = ["apple", "banana", "orange", "grape", "watermelon", "strawberry", "blueberry"];
    words = [];
    for (let i = 0; i < 10; i++) {
        words.push(wordList[Math.floor(Math.random() * wordList.length)]);
    }
    wordDisplay.textContent = words.join(" ");
}

// Function to handle input
wordInput.addEventListener("input", () => {
    if (!isPlaying) return;
    const inputText = wordInput.value;
    const currentWord = words[totalWordsTyped];
    if (inputText === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        tps = (score / (60 - timeLeft)) || 0; // Calculate TPS
        tpsDisplay.textContent = tps.toFixed(2);
        wordInput.value = "";
        if (totalWordsTyped === words.length) {
            generateWords();
        }
    }
});

// Function to end the game
function endGame() {
    isPlaying = false;
    clearInterval(gameInterval);
    wordInput.disabled = true; // Disable input after game ends
    resultMessage.textContent = `Game Over! Your Score: ${score}`;
    startButton.disabled = false; // Enable start button for next round
    restartButton.disabled = true; // Disable restart until the game starts again
}

// Event listeners for mode changes
modeSelect.addEventListener("change", () => {
    const selectedMode = modeSelect.value;
    switch (selectedMode) {
        case "60s":
            timeLeft = 60;
            currentModeDisplay.textContent = "Mode: 60-Second Mode";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            currentModeDisplay.textContent = "Mode: 10-Second Challenge Mode";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "5s-lives":
            timeLeft = 5;
            currentModeDisplay.textContent = "Mode: 5-Second Challenge Mode with Lives";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "3s-lives":
            timeLeft = 3;
            currentModeDisplay.textContent = "Mode: 3-Second Challenge Mode with Lives";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "7s-lives":
            timeLeft = 7;
            currentModeDisplay.textContent = "Mode: 7-Second Challenge Mode with Lives";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "2s-lives":
            timeLeft = 2;
            currentModeDisplay.textContent = "Mode: 2-Second Challenge Mode with Lives";
            customTimeInput.style.display = "none";
            customTimeLabel.style.display = "none";
            break;
        case "custom":
            currentModeDisplay.textContent = "Mode: Custom Mode";
            customTimeInput.style.display = "block";
            customTimeLabel.style.display = "block";
            break;
        default:
            timeLeft = 60;
            currentModeDisplay.textContent = "Mode: 60-Second Mode";
    }
    timeDisplay.textContent = timeLeft;
});

// Hamburger menu functionality
menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});

closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});

// Dark mode toggle
darkModeToggle.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
});

// Create popup for restart confirmation
const popup = document.querySelector('.popup');

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
