// Authentication Logic

const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const loginButton = document.getElementById('login-button');
const registerButton = document.getElementById('register-button');
const authContainer = document.getElementById('auth-container');
const gameContainer = document.getElementById('game-container');
const logoutButton = document.getElementById('logout-button');
const loginError = document.getElementById('login-error');
const registerError = document.getElementById('register-error');

// Listen for Login
loginButton.addEventListener('click', loginUser);

// Listen for Registration
registerButton.addEventListener('click', registerUser);

// Handle Logout
logoutButton.addEventListener('click', logoutUser);

// Register User
function registerUser() {
    const username = registerUsername.value;
    const password = registerPassword.value;

    if (username === '' || password === '') {
        registerError.textContent = 'Please fill in all fields';
        return;
    }

    if (localStorage.getItem(username)) {
        registerError.textContent = 'Username already exists';
        return;
    }

    const user = { username, password };
    localStorage.setItem(username, JSON.stringify(user));
    registerError.textContent = 'Registration successful! You can now log in.';
    registerUsername.value = '';
    registerPassword.value = '';
}

// Login User
function loginUser() {
    const username = loginUsername.value;
    const password = loginPassword.value;

    if (username === '' || password === '') {
        loginError.textContent = 'Please fill in all fields';
        return;
    }

    const user = JSON.parse(localStorage.getItem(username));

    if (!user || user.password !== password) {
        loginError.textContent = 'Invalid username or password';
        return;
    }

    loginError.textContent = '';
    switchToGame();
}

// Logout User
function logoutUser() {
    switchToLogin();
}

// Switch to Game Screen
function switchToGame() {
    authContainer.style.display = 'none';
    gameContainer.style.display = 'block';
}

// Switch to Login Screen
function switchToLogin() {
    authContainer.style.display = 'block';
    gameContainer.style.display = 'none';
    loginUsername.value = '';
    loginPassword.value = '';
}

// Game Logic

const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');

const words = ['javascript', 'coding', 'challenge', 'programming', 'fast', 'game', 'developer', 'function', 'variable', 'script'];

let time = 10;
let score = 0;
let currentWord = '';
let isPlaying = false;
let timerInterval;

// Start Game
startButton.addEventListener('click', startGame);

function startGame() {
    if (isPlaying) return;
    isPlaying = true;
    score = 0;
    time = 10;
    wordInput.disabled = false;
    wordInput.focus();
    startButton.disabled = true;
    startButton.textContent = 'Game in Progress...';
    showNewWord();
    timerInterval = setInterval(updateTime, 1000);
}

// Show a new random word
function showNewWord() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
    wordInput.value = '';
}

// Update time and check if game is over
function updateTime() {
    time--;
    timeDisplay.textContent = time;

    if (time === 0) {
        endGame();
    }
}

// End the game
function endGame() {
    isPlaying = false;
    wordInput.disabled = true;
    clearInterval(timerInterval);
    wordDisplay.textContent = `Game Over! Your final score is ${score}.`;
    startButton.disabled = false;
    startButton.textContent = 'Start Game';
}

// Check word input against the displayed word
wordInput.addEventListener('input', checkMatch);

function checkMatch() {
    if (wordInput.value === currentWord) {
        score++;
        scoreDisplay.textContent = score;
        showNewWord();
        time = 10;
    }
}
