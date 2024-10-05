// Simulating account registration and login using localStorage
const users = JSON.parse(localStorage.getItem('users')) || [];

document.addEventListener('DOMContentLoaded', () => {
  // Handle login
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;

      const user = users.find(u => u.username === username && u.password === password);
      if (user) {
        window.location.href = 'game.html';
      } else {
        document.getElementById('error-message').textContent = 'Invalid login credentials.';
      }
    });
  }

  // Handle registration
  const registerForm = document.getElementById('registerForm');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('reg-username').value;
      const password = document.getElementById('reg-password').value;

      if (users.some(u => u.username === username)) {
        document.getElementById('error-message').textContent = 'Username already exists.';
      } else {
        users.push({ username, password });
        localStorage.setItem('users', JSON.stringify(users));
        alert('Registration successful! You can now log in.');
        window.location.href = 'index.html';
      }
    });
  }

  // Fast typing game logic
  const words = ['javascript', 'coding', 'html', 'css', 'developer', 'programming'];
  let score = 0;
  let currentWord = '';

  const wordDisplay = document.getElementById('wordDisplay');
  const typedWordInput = document.getElementById('typedWord');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const restartBtn = document.getElementById('restartBtn');

  function startGame() {
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
    typedWordInput.value = '';
    typedWordInput.focus();
  }

  function checkWord() {
    if (typedWordInput.value === currentWord) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      startGame();
    }
  }

  if (typedWordInput) {
    typedWordInput.addEventListener('input', checkWord);
    restartBtn.addEventListener('click', () => {
      score = 0;
      scoreDisplay.textContent = 'Score: 0';
      startGame();
    });
    startGame();
  }
});
