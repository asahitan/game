// Game state variables
let playerHP = 100;
let enemyHP = 50;
const playerAttack = 10;
const enemyAttack = 5;
const healAmount = 20;

// Elements
const playerHpEl = document.getElementById("player-hp");
const enemyHpEl = document.getElementById("enemy-hp");
const gameMessageEl = document.getElementById("game-message");

// Function to update health displays
function updateHealth() {
    playerHpEl.textContent = playerHP;
    enemyHpEl.textContent = enemyHP;
}

// Attack button logic
document.getElementById("attack-btn").addEventListener("click", function() {
    // Player attacks
    enemyHP -= playerAttack;
    if (enemyHP <= 0) {
        enemyHP = 0;
        updateHealth();
        gameMessageEl.textContent = "You defeated the enemy!";
        return;
    }
    
    // Enemy attacks
    playerHP -= enemyAttack;
    if (playerHP <= 0) {
        playerHP = 0;
        updateHealth();
        gameMessageEl.textContent = "You have been defeated!";
        return;
    }

    updateHealth();
    gameMessageEl.textContent = `You attacked the enemy for ${playerAttack} damage. The enemy attacked you for ${enemyAttack} damage.`;
});

// Heal button logic
document.getElementById("heal-btn").addEventListener("click", function() {
    // Player heals
    playerHP += healAmount;
    if (playerHP > 100) playerHP = 100;

    // Enemy attacks after heal
    playerHP -= enemyAttack;
    if (playerHP <= 0) {
        playerHP = 0;
        updateHealth();
        gameMessageEl.textContent = "You have been defeated!";
        return;
    }

    updateHealth();
    gameMessageEl.textContent = `You healed for ${healAmount} HP. The enemy attacked you for ${enemyAttack} damage.`;
});

// Initialize game
updateHealth();
