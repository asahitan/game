let balance = 5000;
let employees = 3;
let gamesDeveloped = 0;

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
  const cost = 1000 + (employees * 100);  // Higher employee count increases game cost
  if (balance >= cost) {
    balance -= cost;
    gamesDeveloped++;
    const revenue = 2000 + Math.floor(Math.random() * 2000);  // Random game revenue
    balance += revenue;
    logMessage(`Developed a game! It cost $${cost} and made $${revenue}.`);
    updateUI();
  } else {
    logMessage("Not enough money to develop a game.");
  }
}

function hireEmployee() {
  const cost = 500;
  if (balance >= cost) {
    balance -= cost;
    employees++;
    logMessage("Hired a new employee for $500.");
    updateUI();
  } else {
    logMessage("Not enough money to hire a new employee.");
  }
}

function upgradeOffice() {
  const cost = 3000;
  if (balance >= cost) {
    balance -= cost;
    logMessage("Upgraded the office for $3000. More space for new employees!");
    updateUI();
  } else {
    logMessage("Not enough money to upgrade the office.");
  }
}

// Initial UI setup
updateUI();
