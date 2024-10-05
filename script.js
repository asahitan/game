const wordDisplay = document.getElementById('word-display');
const wordInput = document.getElementById('word-input');
const timeDisplay = document.getElementById('time');
const scoreDisplay = document.getElementById('score');
const startButton = document.getElementById('start-button');
const logoutButton = document.getElementById('logout-button');

// Auth elements
const authContainer = document.getElementById('auth-container');
const gameContainer = document.getElementById('game-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');

// Login form inputs
const loginUsername = document.getElementById('login-username');
const loginPassword = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

// Register form inputs
const registerUsername = document.getElementById('register-username');
const registerPassword = document.getElementById('register-password');
const registerButton = document.getElementById('register-button');

// Toggle forms
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

const words = ['javascript', 'coding', 'challenge', 'programming', 'fast', 'game', 'developer', 'function', 'variable', 'script'];

let time = 10;
let score = 0;
let currentWord = '';
let isPlaying = false;
let timerInterval;

// Check if user is logged in
if (localStorage.getItem('loggedInUser')) {
    showGame();
} else {
    showAuth();
}

// Register functionality
registerButton.addEventListener('click', function() {
    const username = registerUsername.value;
    const password = registerPassword.value;

    if (username && password) {
        localStorage.setItem(username, password);
        alert('Registration successful!');
        showLoginForm();
    } else {
        alert('Please enter both a username and password.');
    }
});

// Login functionality
loginButton.addEventListener('click', function() {
    const username = loginUsername.value;
    const password = loginPassword.value;
    
    const storedPassword = localStorage.getItem(username);

    if (storedPassword && storedPassword === password) {
        localStorage.setItem('loggedInUser', username);
        alert('Login successful!');
        showGame();
    } else {
        alert('Invalid username or password.');
    }
});

// Start Game
startButton.addEventListener('click', startGame);

function startGame() {
    if (isPlaying) return;  // Prevents multiple game starts
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
        time = 10;  // Reset time for each correct word
    }
}

// Show game if logged in
function showGame() {
    authContainer.style.display = 'none';
    gameContainer.style.display = 'block';
}

// Show auth if not logged in
function showAuth() {
    authContainer.style.display = 'block';
    gameContainer.style.display = 'none';
}

// Logout functionality
logoutButton.addEventListener('click', function() {
    localStorage.removeItem('loggedInUser');
    showAuth();
});

// Toggle login and register forms
showRegister.addEventListener('click', showRegisterForm);
showLogin.addEventListener('click', showLoginForm);

function showRegisterForm() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'flex';
}

function showLoginForm() {
    loginForm.style.display = 'flex';
    registerForm.style.display = 'none';
}
