const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let enemies = [];
let towers = [];
let projectiles = [];
let enemyProjectiles = [];
let level = 1;
let spawnInterval = 100;
let frames = 0;
let lives = 10;
let money = 100;
let score = 0;
let gameActive = false;
let selectedTower = null;

document.getElementById('lives').innerText = lives;
document.getElementById('money').innerText = money;
document.getElementById('level').innerText = level;
document.getElementById('score').innerText = score;

// Base class for enemies
class Enemy {
    constructor(speed, health, color) {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.speed = speed;
        this.health = health;
        this.size = 20;
        this.color = color;
        this.fireRate = 100; // Fires every 100 frames
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    shoot() {
        if (frames % this.fireRate === 0) {
            enemyProjectiles.push(new EnemyProjectile(this.x, this.y));
        }
    }
}

// Projectile class for enemy shooting
class EnemyProjectile {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.size = 5;
    }

    move() {
        this.y += this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    hit(tower) {
        const dx = this.x - tower.x;
        const dy = this.y - tower.y;
        return Math.sqrt(dx * dx + dy * dy) < tower.size;
    }
}

// Different enemy types
function createEnemy() {
    const type = Math.random();
    if (type < 0.5) {
        return new Enemy(1, 2, 'red'); // Fast enemy
    } else if (type < 0.8) {
        return new Enemy(0.5, 4, 'blue'); // Slower, tankier enemy
    } else {
        return new Enemy(0.75, 3, 'green'); // Balanced enemy
    }
}

// Tower class with upgrades and HP
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 50; // Fires every 50 frames
        this.damage = 1;
        this.health = 10; // Initial HP for towers
        this.color = 'blue';
    }

    shoot() {
        const target = enemies.find(enemy => this.getDistance(enemy) <= this.range);
        if (target && frames % this.fireRate === 0) {
            projectiles.push(new Projectile(this.x, this.y, target, this.damage));
        }
    }

    getDistance(enemy) {
        const dx = this.x - enemy.x;
        const dy = this.y - enemy.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 20, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();

        // Draw HP bar
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 10, this.y - 25, (this.health / 10) * 20, 5);
    }

    upgrade() {
        if (money >= 50) {
            this.damage++;
            this.health += 5; // Increase HP on upgrade
            money -= 50;
            document.getElementById('money').innerText = money;
        }
    }
}

// Projectile class for towers
class Projectile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
        this.damage = damage;
    }

    move() {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = 'yellow';
        ctx.fill();
    }

    hit() {
        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        return Math.sqrt(dx * dx + dy * dy) < this.target.size;
    }
}

// Game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Spawn enemies
    if (frames % spawnInterval === 0) {
        enemies.push(createEnemy());
    }
    
    // Move and draw enemies
    enemies.forEach((enemy, index) => {
        enemy.move();
        enemy.shoot(); // Enemies shoot at towers
        enemy.draw();
        
        // Remove enemies that reach the bottom
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            lives--;
            document.getElementById('lives').innerText = lives;
            if (lives <= 0) {
                alert('Game Over! Your score: ' + score);
                document.location.reload();
            }
        }
    });
    
    // Towers shoot at enemies
    towers.forEach(tower => {
        tower.shoot();
        tower.draw();
    });
    
    // Move and draw projectiles
    projectiles.forEach((projectile, index) => {
        projectile.move();
        projectile.draw();
        
        // Remove projectiles that hit an enemy
        if (projectile.hit()) {
            projectile.target.health -= projectile.damage;
            if (projectile.target.health <= 0) {
                enemies.splice(enemies.indexOf(projectile.target), 1);
                score += 10; // Gain score for defeating an enemy
                money += 20; // Gain money for defeating an enemy
                document.getElementById('money').innerText = money;
            }
            projectiles.splice(index, 1);
        }
    });

    // Move and draw enemy projectiles
    enemyProjectiles.forEach((ep, index) => {
        ep.move();
        ep.draw();
        
        // Check if enemy projectile hits a tower
        towers.forEach(tower => {
            if (ep.hit(tower)) {
                tower.health -= 1; // Damage tower
                enemyProjectiles.splice(index, 1);
                if (tower.health <= 0) {
                    towers.splice(towers.indexOf(tower), 1);
                }
            }
        });
    });

    // Update frames and score display
    frames++;
    document.getElementById('score').innerText = score;
    document.getElementById('level').innerText = level;

    requestAnimationFrame(gameLoop);
}

// Start game function
function startGame() {
    gameActive = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('pauseButton').disabled = false;
    gameLoop();
}

// Pause game function
function pauseGame() {
    gameActive = false;
    document.getElementById('pauseButton').disabled = true;
    document.getElementById('startButton').disabled = false;
}

// Initialize towers on left click
canvas.addEventListener('click', (event) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (money >= 50) { // Cost to place a tower
        const newTower = new Tower(x, y);
        towers.push(newTower);
        money -= 50;
        document.getElementById('money').innerText = money;
    }
});

// Upgrade tower on button click
document.getElementById('upgradeButton').addEventListener('click', () => {
    if (selectedTower) {
        selectedTower.upgrade();
    }
});

// Select tower for upgrade on right click
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    towers.forEach(tower => {
        if (Math.hypot(tower.x - x, tower.y - y) < 20) {
            selectedTower = tower;
            document.getElementById('selectedTower').innerText = 'Selected Tower: Damage ' + tower.damage + ', HP ' + tower.health;
            document.getElementById('upgradeButton').disabled = false; // Enable upgrade button
        }
    });
});

// Deselect tower when clicking outside
canvas.addEventListener('click', () => {
    selectedTower = null;
    document.getElementById('selectedTower').innerText = 'Select a tower to upgrade';
    document.getElementById('upgradeButton').disabled = true; // Disable upgrade button
});
