let balance = 5000;
let employees = 1;

function logMessage(message) {
  const logPanel = document.getElementById("log");
  const newLog = document.createElement("p");
  newLog.textContent = message;
  logPanel.appendChild(newLog);
  logPanel.scrollTop = logPanel.scrollHeight;
}

function updateUI() {
  document.getElementById("balance").textContent = balance;
  document.getElementById("employees").textContent = employees;
}

function developGame() {
  const cost = 1000;
  if (balance >= cost) {
    balance -= cost;
    const revenue = 2000 + Math.floor(Math.random() * 1000);
    balance += revenue;
    logMessage(`Developed a game! It cost $${cost} and earned $${revenue}.`);
    updateUI();
  } else {
    logMessage("Not enough money to develop a game.");
  }
}

function hireEmployee() {
  const cost = 500;
  if (balance >= cost) {
    balance -= cost;
    employees += 1;
    logMessage(`Hired a new employee for $${cost}.`);
    updateUI();
  } else {
    logMessage("Not enough money to hire an employee.");
  }
}

updateUI();
