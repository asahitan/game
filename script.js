const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const tpsDisplay = document.getElementById('tps');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const gameContainer = document.getElementById('game-container');
const authContainer = document.getElementById('auth-container');

let users = {};  // Store registered users in-memory
let currentUser = null;  // Keep track of the logged-in user

const words = ['javascript', 'coding', 'challenge', 'programming', 'fast', 'game', 'developer', 'function', 'variable', 'script'];

let time = 10;
let score = 0;
let correctWords = 0;
let startTime = 0;
let currentWord = '';
let isPlaying = false;
let timerInterval;

// Event Listeners for Login/Register
document.getElementById('login-btn').addEventListener('click', login);
document.getElementById('register-btn').addEventListener('click', register);
document.getElementById('register-link').addEventListener('click', showRegisterForm);
document.getElementById('login-link').addEventListener('click', showLoginForm);

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (users[username] && users[username] === password) {
        currentUser = username;
        alert(`Welcome, ${username}!`);
        authContainer.style.display = 'none';
        gameContainer.style.display = 'block';
    } else {
        alert('Invalid username or password.');
    }
}

function register() {
    const username = document.getElementById('register-username').value;
    const password = document.getElementById('register-password').value;

    if (username && password && !users[username]) {
        users[username] = password;
        alert('Account registered successfully! You can now login.');
        showLoginForm();
    } else {
        alert('Username already exists or invalid details.');
    }
}

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
}

function showLoginForm() {
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
}

// Start Game
startButton.addEventListener('click', startGame);

function startGame() {
    if (isPlaying) return;  // Prevents multiple game starts
    isPlaying = true;
    score = 0;
    correctWords = 0;
    startTime = Date.now();
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

    const elapsedTime = (Date.now() - startTime) / 1000;
    const tps = (correctWords / elapsedTime).toFixed(2);  // Calculate TPS
    tpsDisplay.textContent = tps;

    startButton.disabled = false;
    startButton.textContent = 'Start Game';
}

// Check word input against the displayed word
wordInput.addEventListener('input', checkMatch);

function checkMatch() {
    if (wordInput.value === currentWord) {
        score++;
        correctWords++;
        scoreDisplay.textContent = score;
        showNewWord();
        time = 10;  // Reset time for each correct word
    }
}
