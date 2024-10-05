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
  const words = ['javascript', 'coding', 'html', 'css', 'developer', 'programming', 'computer', 'algorithm', 'keyboard', 'framework'];
  let score = 0;
  let currentWord = '';
  let time = 10;
  let timerInterval = null;

  const wordDisplay = document.getElementById('wordDisplay');
  const typedWordInput = document.getElementById('typedWord');
  const scoreDisplay = document.getElementById('scoreDisplay');
  const timeDisplay = document.createElement('p'); // Timer element
  timeDisplay.id = 'timeDisplay';
  timeDisplay.textContent = `Time: ${time}s`;
  scoreDisplay.insertAdjacentElement('beforebegin', timeDisplay); // Adding timer above score display
  const restartBtn = document.getElementById('restartBtn');

  // Start the game by displaying the first word and starting the timer
  function startGame() {
    startTimer();
    currentWord = words[Math.floor(Math.random() * words.length)];
    wordDisplay.textContent = currentWord;
    typedWordInput.value = '';
    typedWordInput.focus();
  }

  // Handle the word check
  function checkWord() {
    if (typedWordInput.value === currentWord) {
      score++;
      scoreDisplay.textContent = `Score: ${score}`;
      resetTimer();
      startGame(); // Move to the next word
    }
  }

  // Timer function
  function startTimer() {
    timerInterval = setInterval(() => {
      time--;
      timeDisplay.textContent = `Time: ${time}s`;
      if (time === 0) {
        clearInterval(timerInterval);
        endGame();
      }
    }, 1000);
  }

  // Reset the timer when a word is typed correctly
  function resetTimer() {
    time = 10;
    timeDisplay.textContent = `Time: ${time}s`;
    clearInterval(timerInterval);
    startTimer();
  }

  // End the game when the timer runs out
  function endGame() {
    alert(`Game Over! Your score is ${score}`);
    resetGame();
  }

  // Reset game to initial state
  function resetGame() {
    score = 0;
    time = 10;
    scoreDisplay.textContent = 'Score: 0';
    timeDisplay.textContent = `Time: ${time}s`;
    clearInterval(timerInterval);
    typedWordInput.value = '';
    restartBtn.textContent = 'Start Again';
  }

  // Event listeners
  if (typedWordInput) {
    typedWordInput.addEventListener('input', checkWord);
    restartBtn.addEventListener('click', () => {
      score = 0;
      resetGame();
      startGame();
    });
    startGame();
  }
});
