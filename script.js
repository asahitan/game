document.addEventListener("DOMContentLoaded", function() {
    let currentWord = "";
    let score = 0;
    let timeLeft = 60;
    let tps = 0;
    let lives = 3;
    let gameActive = false;
    let timer;
    const words = ["test", "game", "speed", "typing", "javascript", "html", "css"];
    const wordDisplay = document.getElementById("word-display");
    const wordInput = document.getElementById("word-input");
    const startBtn = document.getElementById("start-btn");
    const scoreValue = document.getElementById("score-value");
    const timeLeftDisplay = document.getElementById("time-left");
    const tpsValue = document.getElementById("tps-value");
    const livesDisplay = document.getElementById("lives");
    const livesValue = document.getElementById("lives-value");
    const resultMessage = document.getElementById("result-message");
    const currentModeDisplay = document.getElementById("current-mode-display");
    const modeSelect = document.getElementById("mode-select");

    // Initialize mode settings
    let selectedMode = "60s";

    // Handle mode selection change
    modeSelect.addEventListener("change", function() {
        selectedMode = modeSelect.value;
        resetGame();
        updateModeDisplay();
    });

    // Function to update the mode display
    function updateModeDisplay() {
        let modeText = "";
        switch (selectedMode) {
            case "60s":
                modeText = "60-Second Mode";
                timeLeft = 60;
                livesDisplay.style.display = "none";
                break;
            case "10s":
                modeText = "10-Second Challenge Mode";
                timeLeft = 10;
                livesDisplay.style.display = "none";
                break;
            case "5s-lives":
                modeText = "5-Second Challenge Mode with Lives";
                timeLeft = 5;
                lives = 3;
                livesDisplay.style.display = "block";
                break;
            case "3s-lives":
                modeText = "3-Second Challenge Mode with Lives";
                timeLeft = 3;
                lives = 3;
                livesDisplay.style.display = "block";
                break;
            case "7s-lives":
                modeText = "7-Second Challenge Mode with Lives";
                timeLeft = 7;
                lives = 3;
                livesDisplay.style.display = "block";
                break;
            case "2s-lives":
                modeText = "2-Second Challenge Mode with Lives";
                timeLeft = 2;
                lives = 3;
                livesDisplay.style.display = "block";
                break;
        }
        currentModeDisplay.textContent = "Mode: " + modeText;
        timeLeftDisplay.textContent = timeLeft;
        livesValue.textContent = lives;
    }

    // Start Game logic
    startBtn.addEventListener("click", startGame);

    function startGame() {
        if (gameActive) return;
        gameActive = true;
        wordInput.value = "";
        score = 0;
        tps = 0;
        scoreValue.textContent = score;
        tpsValue.textContent = tps.toFixed(2);
        startTimer();
        generateWord();
        wordInput.focus();
    }

    function startTimer() {
        timer = setInterval(function() {
            timeLeft--;
            timeLeftDisplay.textContent = timeLeft;
            if (timeLeft <= 0) {
                if (selectedMode.includes("lives")) {
                    lives--;
                    livesValue.textContent = lives;
                    if (lives <= 0) {
                        endGame("Game Over! You ran out of lives.");
                        return;
                    } else {
                        resetTime();
                    }
                } else {
                    endGame("Time's up!");
                }
            }
        }, 1000);
    }

    function resetTime() {
        switch (selectedMode) {
            case "5s-lives":
                timeLeft = 5;
                break;
            case "3s-lives":
                timeLeft = 3;
                break;
            case "7s-lives":
                timeLeft = 7;
                break;
            case "2s-lives":
                timeLeft = 2;
                break;
        }
        timeLeftDisplay.textContent = timeLeft;
    }

    function endGame(message) {
        clearInterval(timer);
        gameActive = false;
        resultMessage.textContent = message;
    }

    function generateWord() {
        currentWord = words[Math.floor(Math.random() * words.length)];
        wordDisplay.textContent = currentWord;
    }

    wordInput.addEventListener("input", function() {
        if (wordInput.value === currentWord && gameActive) {
            score++;
            scoreValue.textContent = score;
            tps = score / (60 - timeLeft);
            tpsValue.textContent = tps.toFixed(2);
            wordInput.value = "";
            generateWord();
            if (selectedMode !== "60s" && selectedMode !== "10s") {
                resetTime();
            }
        }
    });

    function resetGame() {
        clearInterval(timer);
        timeLeft = selectedMode === "60s" ? 60 : selectedMode === "10s" ? 10 : 5;
        score = 0;
        lives = 3;
        scoreValue.textContent = score;
        tpsValue.textContent = "0.00";
        livesValue.textContent = lives;
        timeLeftDisplay.textContent = timeLeft;
        wordDisplay.textContent = "";
        wordInput.value = "";
        resultMessage.textContent = "";
        gameActive = false;
    }

    // Toggle dark mode
    const darkModeToggle = document.getElementById("dark-mode-toggle");
    darkModeToggle.addEventListener("change", function() {
        document.body.classList.toggle("dark-mode", darkModeToggle.checked);
    });

    // Menu toggle functionality
    const menuToggle = document.getElementById("menu-toggle");
    const sideMenu = document.getElementById("side-menu");
    const closeMenu = document.getElementById("close-menu");

    menuToggle.addEventListener("click", function() {
        sideMenu.style.width = "250px";
    });

    closeMenu.addEventListener("click", function() {
        sideMenu.style.width = "0";
    });
});
