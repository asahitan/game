const wordDisplay = document.getElementById("word-display");
const wordInput = document.getElementById("word-input");
const scoreDisplay = document.getElementById("score-value");
const tpsDisplay = document.getElementById("tps-value");
const timeDisplay = document.getElementById("time-left");
const startButton = document.getElementById("start-btn");
const resultMessage = document.getElementById("result-message");

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

function getRandomWord() {
    return words[Math.floor(Math.random() * words.length)];
}

function startGame() {
    score = 0;
    timeLeft = 60;
    totalWordsTyped = 0;
    tps = 0;
    isPlaying = true;
    wordInput.value = "";
    resultMessage.textContent = "";
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = true;
    startButton.textContent = "Playing...";
    nextWord();
    const gameInterval = setInterval(() => {
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
    tps = totalWordsTyped / (60 - timeLeft);
    tpsDisplay.textContent = tps.toFixed(2);
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        wordInput.value = "";
        nextWord();
    }
});

startButton.addEventListener("click", startGame);
