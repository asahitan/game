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

// Additional words for harder modes
const hardWords = ["function", "variable", "conditional", "iteration", "data structure"];
const extremeWords = ["asynchronous", "encapsulation", "polymorphism", "inheritance", "recursion"];
const zenWords = words; // Use the base words in Zen mode
const suddenDeathWords = words; // Use the base words in Sudden Death mode

// Mode descriptions
const modeDescriptions = {
    "60s": "60-Second Mode",
    "10s": "10-Second Challenge Mode",
    "hard": "Hard Mode",
    "extreme": "Extreme Mode",
    "zen": "Zen Mode",
    "sudden-death": "Sudden Death Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives"
};

function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    
    switch(gameMode) {
        case "60s":
            timeLeft = 60;
            livesContainer.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            livesContainer.style.display = "none";
            break;
        case "hard":
            timeLeft = 30;
            livesContainer.style.display = "none";
            break;
        case "extreme":
            timeLeft = 15;
            livesContainer.style.display = "none";
            lives = 1; // Set lives to 1 for Extreme Mode
            livesDisplay.textContent = lives;
            break;
        case "zen":
            timeLeft = Infinity; // Unlimited time for Zen mode
            livesContainer.style.display = "none";
            break;
        case "sudden-death":
            timeLeft = Infinity; // Unlimited time for Sudden Death mode
            livesContainer.style.display = "none";
            break;
        case "5s-lives":
        case "3s-lives":
        case "7s-lives":
        case "2s-lives":
            timeLeft = parseInt(gameMode.split('-')[0].slice(0, 1)); // Extract the number for the time limit
            livesContainer.style.display = "block";
            livesDisplay.textContent = 3;
            break;
    }
    timeDisplay.textContent = timeLeft === Infinity ? "∞" : timeLeft; // Display ∞ for unlimited time
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
    startButton.disabled = false;
    startButton.textContent = "Playing...";
    lives = 3; // Reset lives for other modes
    livesDisplay.textContent = lives;

    multiplier = 1; // Reset multiplier
    multiplierDisplay.textContent = `Multiplier: x${multiplier}`;

    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();

    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0 && isPlaying) {
            if (gameMode !== "zen" && gameMode !== "sudden-death") {
                timeLeft--;
                timeDisplay.textContent = timeLeft === Infinity ? "∞" : timeLeft; // Display ∞ for unlimited time
                updateTPS();
            }

            if (gameMode.includes("lives") && timeLeft === 0) {
                handleLifeLoss();
            }

        } else if (timeLeft === 0 && gameMode !== "zen" && gameMode !== "sudden-death") {
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
        timeLeft = parseInt(gameMode.split('-')[0].slice(0, 1)); // Reset time
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
    switch (gameMode) {
        case "hard":
            currentWord = hardWords[Math.floor(Math.random() * hardWords.length)];
            break;
        case "extreme":
            currentWord = extremeWords[Math.floor(Math.random() * extremeWords.length)];
            break;
        case "sudden-death":
            currentWord = suddenDeathWords[Math.floor(Math.random() * suddenDeathWords.length)];
            break;
        default:
            currentWord = words[Math.floor(Math.random() * words.length)];
            break;
    }
    wordDisplay.textContent = currentWord;
}

function updateTPS() {
    if (timeLeft < 60) {
        tps = totalWordsTyped / (60 - timeLeft);
    } else {
        tps = totalWordsTyped / (60); // For 60 seconds mode
    }
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
        if (gameMode !== "sudden-death") {
            timeLeft = parseInt(gameMode.split('-')[0].slice(0, 1)); // Reset time in challenge modes
        }
        nextWord();
        updateTPS();
    } else if (gameMode === "sudden-death") {
        // End the game immediately on the first wrong word in Sudden Death mode
        clearInterval(gameInterval);
        endGame();
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
