const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const resultMessage = document.getElementById("result-message");
const modeButtons = document.querySelectorAll(".mode-btn");
const mode60sButton = document.getElementById("60s-mode");
const mode10sButton = document.getElementById("10s-mode");

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

    if (gameMode === "60s") {
        timeLeft = 60;
    } else if (gameMode === "10s") {
        timeLeft = 10;
    }
    timeDisplay.textContent = timeLeft;
    
    nextWord();

    gameInterval = setInterval(() => {
        if (timeLeft > 0 && isPlaying) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;
            updateTPS();
        } else {
            clearInterval(gameInterval);
            endGame();
        }
    }, 1000);
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
    } else if (gameMode === "10s") {
        tps = totalWordsTyped / (10 - timeLeft + totalWordsTyped * 10); // Adjust TPS calculation for 10-second mode
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
        }
        
        nextWord();
    }
});

startButton.addEventListener("click", startGame);

modeButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        modeButtons.forEach(btn => btn.classList.remove("active"));
        e.target.classList.add("active");

        gameMode = e.target.id === "60s-mode" ? "60s" : "10s";

        if (isPlaying) {
            clearInterval(gameInterval);
            endGame(); // Stop current game if switching modes
        }

        if (gameMode === "60s") {
            timeDisplay.textContent = 60;
        } else if (gameMode === "10s") {
            timeDisplay.textContent = 10;
        }
    });
});
