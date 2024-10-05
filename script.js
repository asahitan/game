function saveGame() {
  const gameData = {
    balance: balance,
    employees: employees,
    gamesDeveloped: gamesDeveloped
  };
  localStorage.setItem("gameTycoonSave", JSON.stringify(gameData));
  logMessage("Game saved.");
}

function loadGame() {
  const savedGame = JSON.parse(localStorage.getItem("gameTycoonSave"));
  if (savedGame) {
    balance = savedGame.balance;
    employees = savedGame.employees;
    gamesDeveloped = savedGame.gamesDeveloped;
    updateUI();
    logMessage("Game loaded.");
  } else {
    logMessage("No saved game found.");
  }
}
