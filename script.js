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
const livesContainer = document.getElementById("lives"); // Lives container for showing/hiding

let words = [
    "javascript", "advanced", "developer", "keyboard", "function", "variable",
    "typing", "speed", "test", "framework", "browser", "performance", "syntax", 
    "debugging", "algorithm", "data", "structure", "application", "interface"
];
let currentWord = "";
let score = 0;
let timeLeft = 60;
let totalWordsTyped = 0;
let isPlaying = false;
let tps = 0;
let gameMode = "60s"; // Default mode is 60-second mode
let gameInterval;
let lives = 3; // Lives for 5-Second mode with lives

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
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
    lives = 3; // Reset lives to 3
    livesDisplay.textContent = lives; // Update lives display

    gameMode = modeSelect.value;
    if (gameMode === "60s") {
        timeLeft = 60;
        livesContainer.classList.add("hidden"); // Hide lives for 60-second mode
    } else if (gameMode === "10s") {
        timeLeft = 10;
        livesContainer.classList.add("hidden"); // Hide lives for 10-second mode
    } else if (gameMode === "5s") {
        timeLeft = 5;
        livesContainer.classList.add("hidden"); // Hide lives for 5-second challenge mode
    } else if (gameMode === "5s-lives") {
        timeLeft = 5;
        livesContainer.classList.remove("hidden"); // Show lives for 5-second mode with lives
    }
    timeDisplay.textContent = timeLeft;
    
    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0 && isPlaying) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            updateTPS();

            if (gameMode === "5s-lives" && timeLeft === 0) {
                handleLifeLoss(); // Handle life loss in 5-second challenge mode with lives
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
        timeLeft = 5; // Reset time for next word in 5-second mode with lives
        nextWord();
    }
}

function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    startButton.disabled = false;
    startButton.textContent = "Start Game";
    resultMessage.textContent = `Game Over! Final Score: ${score} | Typing Speed: ${tps.toFixed(2)} TPS`;
}

function nextWord() {
    currentWord = getRandomWord();
    wordDisplay.textContent = currentWord;
}

function updateTPS() {
    if (gameMode === "60s") {
        tps = totalWordsTyped / (60 - timeLeft);
    } else if (gameMode === "10s" || gameMode === "5s" || gameMode === "5s-lives") {
        tps = totalWordsTyped / ((10 - timeLeft) + totalWordsTyped * (gameMode === "10s" ? 10 : 5));
    }
    tpsDisplay.textContent = tps.toFixed(2);
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        wordInput.value = "";

        if (gameMode === "10s") {
            timeLeft = 10; // Reset time for 10-second mode
        } else if (gameMode === "5s") {
            timeLeft = 5; // Reset time for 5-second mode (no lives)
        } else if (gameMode === "5s-lives") {
            timeLeft = 5; // Reset time for 5-second mode with lives
        }

        nextWord();
    }
});

startButton.addEventListener("click", startGame);

modeSelect.addEventListener("change", (e) => {
    gameMode = e.target.value;

    if (isPlaying) {
        clearInterval(gameInterval);
        endGame(); // Stop current game if switching modes
    }

    if (gameMode === "60s") {
        timeDisplay.textContent = 60;
        livesContainer.classList.add("hidden"); // Hide lives for 60-second mode
    } else if (gameMode === "10s") {
        timeDisplay.textContent = 10;
        livesContainer.classList.add("hidden"); // Hide lives for 10-second mode
    } else if (gameMode === "5s") {
        timeDisplay.textContent = 5;
        livesContainer.classList.add("hidden"); // Hide lives for 5-second mode (no lives)
    } else if (gameMode === "5s-lives") {
        timeDisplay.textContent = 5;
        livesContainer.classList.remove("hidden"); // Show lives for 5-second mode with lives
        livesDisplay.textContent = 3; // Reset lives to 3
    }
});

// Toggle dark mode
darkModeToggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-mode", e.target.checked);
});

// Disable copy-paste on word input to prevent cheating
wordInput.addEventListener('paste', (e) => e.preventDefault());
wordInput.addEventListener('copy', (e) => e.preventDefault());

// Disable long-press menu for copy-paste on mobile devices
wordInput.addEventListener('contextmenu', (e) => e.preventDefault());
