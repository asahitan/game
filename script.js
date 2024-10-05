let player = {
    class: '',
    hp: 100,
    maxHp: 100,
    mana: 50,
    maxMana: 50,
    attack: 10,
    level: 1,
    xp: 0,
    inventory: {
        potions: 2,
        magicPotions: 1
    }
};

let enemy = {
    hp: 80,
    maxHp: 80,
    attack: 8
};

// HTML Elements
const playerHpBar = document.getElementById("player-hp-bar");
const playerManaBar = document.getElementById("player-mana-bar");
const enemyHpBar = document.getElementById("enemy-hp-bar");
const gameMessageEl = document.getElementById("game-message");
const playerClassEl = document.getElementById("player-class");

// Character Selection
document.getElementById("warrior").addEventListener("click", function() {
    startGame("Warrior", 150, 0, 15);
});
document.getElementById("mage").addEventListener("click", function() {
    startGame("Mage", 100, 100, 12);
});
document.getElementById("archer").addEventListener("click", function() {
    startGame("Archer", 120, 50, 14);
});

function startGame(className, hp, mana, attack) {
    player.class = className;
    player.hp = hp;
    player.maxHp = hp;
    player.mana = mana;
    player.maxMana = mana;
    player.attack = attack;
    playerClassEl.textContent = player.class;

    // Start Battle
    document.querySelector(".character-selection").classList.add("hidden");
    document.getElementById("battle-area").classList.remove("hidden");
    updateBars();
}

function updateBars() {
    playerHpBar.style.width = (player.hp / player.maxHp) * 100 + '%';
    playerManaBar.style.width = (player.mana / player.maxMana) * 100 + '%';
    enemyHpBar.style.width = (enemy.hp / enemy.maxHp) * 100 + '%';
}

document.getElementById("attack-btn").addEventListener("click", function() {
    performAttack();
});

document.getElementById("magic-btn").addEventListener("click", function() {
    castMagic();
});

document.getElementById("heal-btn").addEventListener("click", function() {
    healPlayer();
});

function performAttack() {
    enemy.hp -= player.attack;
    if (enemy.hp <= 0) {
        enemy.hp = 0;
        gameMessageEl.textContent = "You defeated the enemy!";
    } else {
        player.hp -= enemy.attack;
        if (player.hp <= 0) {
            player.hp = 0;
            gameMessageEl.textContent = "You have been defeated!";
        } else {
            gameMessageEl.textContent = `You attacked for ${player.attack} damage. Enemy hit you for ${enemy.attack}.`;
        }
    }
    updateBars();
}

function castMagic() {
    if (player.mana >= 20) {
        player.mana -= 20;
        enemy.hp -= 25;
        if (enemy.hp <= 0) {
            enemy.hp = 0;
            gameMessageEl.textContent = "Your magic defeated the enemy!";
        } else {
            player.hp -= enemy.attack;
            gameMessageEl.textContent = `You cast a spell for 25 damage. Enemy hit you for ${enemy.attack}.`;
        }
        updateBars();
    } else {
        gameMessageEl.textContent = "Not enough mana!";
    }
}

function healPlayer() {
    if (player.mana >= 15) {
        player.mana -= 15;
        player.hp += 30;
        if (player.hp > player.maxHp) player.hp = player.maxHp;
        gameMessageEl.textContent = "You healed yourself.";
    } else {
        gameMessageEl.textContent = "Not enough mana to heal!";
    }
    updateBars();
}
