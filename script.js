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
const currentModeDisplay = document.getElementById("current-mode-display");
const multiplierDisplay = document.getElementById("multiplier");

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
let multiplier = 1; // Multiplier starts at 1

// Mode descriptions
const modeDescriptions = {
    "60s": "60-Second Mode",
    "10s": "10-Second Challenge Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives",
    "hard": "Hard Mode (3 words per second)",
    "extreme": "Extreme Mode (1 second to type one word)",
    "zen": "Zen Mode (No time limit)",
    "sudden-death": "Sudden Death Mode (1 life, 5 seconds)"
};

function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    switch (gameMode) {
        case "60s":
            timeLeft = 60;
            livesContainer.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            livesContainer.style.display = "none";
            break;
        case "5s-lives":
            timeLeft = 5;
            livesContainer.style.display = "block";
            livesDisplay.textContent = lives;
            break;
        case "3s-lives":
            timeLeft = 3;
            livesContainer.style.display = "block";
            livesDisplay.textContent = lives;
            break;
        case "7s-lives":
            timeLeft = 7;
            livesContainer.style.display = "block";
            livesDisplay.textContent = lives;
            break;
        case "2s-lives":
            timeLeft = 2;
            livesContainer.style.display = "block";
            livesDisplay.textContent = lives;
            break;
        case "hard":
            timeLeft = 20; // 20 seconds
            livesContainer.style.display = "none"; // No lives
            break;
        case "extreme":
            timeLeft = 1; // 1 second
            livesContainer.style.display = "none"; // No lives
            break;
        case "zen":
            timeLeft = 99999; // No limit
            livesContainer.style.display = "none"; // No lives
            break;
        case "sudden-death":
            timeLeft = 5; // 5 seconds
            lives = 1; // Only 1 life
            livesContainer.style.display = "block";
            livesDisplay.textContent = lives;
            break;
    }
    timeDisplay.textContent = timeLeft;
}

function startGame() {
    score = 0;
    totalWordsTyped = 0;
    tps = 0;
    isPlaying = true;
    wordInput.value = "";
    resultMessage.textContent = "";
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = true;
    startButton.textContent = "Playing...";
    lives = (gameMode.includes("lives") || gameMode === "sudden-death") ? 3 : 0; // Reset lives for applicable modes
    livesDisplay.textContent = lives;

    multiplier = 1; // Reset multiplier
    multiplierDisplay.textContent = `Multiplier: x${multiplier}`;

    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();
    
    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0 && isPlaying) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            updateTPS();

            if (gameMode.includes("lives") && timeLeft === 0) {
                handleLifeLoss();
            } else if (gameMode === "sudden-death" && timeLeft === 0) {
                clearInterval(gameInterval);
                endGame();
            }
        } else if (timeLeft === 0) {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
}

function handleLifeLoss() {
    lives--;
    livesDisplay.textContent = lives;

    if (lives === 0) {
        clearInterval(gameInterval);
        endGame();
    } else {
        timeLeft = parseInt(gameMode.split('-')[0].slice(0, 1));
        nextWord();
    }
}

function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startButton.disabled = false;
    startButton.textContent = "Start Game";
    resultMessage.textContent = `Game Over! Final Score: ${score} | TPS: ${tps.toFixed(2)}`;
}

function nextWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
}

function updateTPS() {
    tps = totalWordsTyped / (60 - timeLeft);
    tpsDisplay.textContent = tps.toFixed(2);
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        totalWordsTyped++;
        score += multiplier; // Apply multiplier to the score
        scoreDisplay.textContent = score;

        multiplier++; // Increment multiplier for every correct word
        multiplierDisplay.textContent = `Multiplier: x${multiplier}`;

        wordInput.value = "";
        timeLeft = (gameMode.includes("lives") || gameMode === "sudden-death") ? parseInt(gameMode.split('-')[0].slice(0, 1)) : timeLeft; // Reset time in challenge modes
        nextWord();
        updateTPS();
    }
});

startButton.addEventListener("click", startGame);

// Change mode event listener
modeSelect.addEventListener("change", () => {
    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();
});

// Toggle Side Menu
menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});
closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});

// Toggle Dark Mode
darkModeToggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-mode", e.target.checked);
});

// Disable copy-paste to prevent cheating
wordInput.addEventListener('paste', (e) => e.preventDefault());
wordInput.addEventListener('copy', (e) => e.preventDefault());
wordInput.addEventListener('contextmenu', (e) => e.preventDefault());
