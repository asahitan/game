// Existing mode descriptions extended with new modes
const modeDescriptions = {
    "60s": "60-Second Mode",
    "30s": "30-Second Mode",  // New Mode
    "45s": "45-Second Mode",  // New Mode
    "90s": "90-Second Mode",  // New Mode
    "20s": "20-Second Challenge Mode",
    "15s": "15-Second Challenge Mode",
    "10s": "10-Second Challenge Mode",
    "5s-lives": "5-Second Challenge Mode with Lives",
    "3s-lives": "3-Second Challenge Mode with Lives",
    "7s-lives": "7-Second Challenge Mode with Lives",
    "8s-lives": "8-Second Challenge Mode with Lives",
    "2s-lives": "2-Second Challenge Mode with Lives",
    "60s-lives": "1-Minute with Lives",  // New Mode
};

// Update mode display and timer based on selected mode
function updateModeDisplayAndTimer() {
    currentModeDisplay.textContent = `Mode: ${modeDescriptions[gameMode]}`;
    
    switch (gameMode) {
        case "60s":
            timeLeft = 60;
            livesContainer.style.display = "none";
            break;
        case "30s":
            timeLeft = 30;
            livesContainer.style.display = "none";
            break;
        case "45s":
            timeLeft = 45;
            livesContainer.style.display = "none";
            break;
        case "90s":
            timeLeft = 90;
            livesContainer.style.display = "none";
            break;
        case "20s":
            timeLeft = 20;
            livesContainer.style.display = "none";
            break;
        case "15s":
            timeLeft = 15;
            livesContainer.style.display = "none";
            break;
        case "10s":
            timeLeft = 10;
            livesContainer.style.display = "none";
            break;
        case "5s-lives":
        case "3s-lives":
        case "7s-lives":
        case "8s-lives":
        case "2s-lives":
        case "60s-lives":  // New Mode: 1-minute with lives
            timeLeft = parseInt(gameMode.split('-')[0]); // Extract time from mode name
            livesContainer.style.display = "block";
            livesDisplay.textContent = 3; // Reset lives
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
    lives = 3;
    livesDisplay.textContent = lives;

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
        timeLeft = parseInt(gameMode.split('-')[0]); // Reset time for challenge modes with lives
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
    tps = totalWordsTyped / (60 - timeLeft); // Calculate typing speed per second
    tpsDisplay.textContent = tps.toFixed(2);
}

wordInput.addEventListener("input", () => {
    if (wordInput.value.trim() === currentWord) {
        score++;
        totalWordsTyped++;
        scoreDisplay.textContent = score;
        wordInput.value = "";

        if (gameMode.includes("lives")) {
            timeLeft = parseInt(gameMode.split('-')[0]); // Reset time for challenge modes with lives
        }

        nextWord();
        updateTPS();
    }
});

startButton.addEventListener("click", startGame);

modeSelect.addEventListener("change", () => {
    gameMode = modeSelect.value;
    updateModeDisplayAndTimer();
});

menuToggle.addEventListener("click", () => {
    sideMenu.style.width = "250px";
});

closeMenuButton.addEventListener("click", () => {
    sideMenu.style.width = "0";
});

darkModeToggle.addEventListener("change", (e) => {
    document.body.classList.toggle("dark-mode", e.target.checked);
});

wordInput.addEventListener('paste', (e) => e.preventDefault());
wordInput.addEventListener('copy', (e) => e.preventDefault());
wordInput.addEventListener('contextmenu', (e) => e.preventDefault());
