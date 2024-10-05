const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let enemies = [];
let towers = [];
let projectiles = [];
let enemyProjectiles = [];
let level = 1;
let spawnInterval = 100; // Adjust spawn interval for enemies
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
        this.attackPower = 1; // Enemy attack power
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
        // Shoot projectiles towards the nearest tower
        const nearestTower = towers.reduce((prev, curr) => {
            return (this.getDistance(curr) < this.getDistance(prev)) ? curr : prev;
        }, null); // Ensure prev is initialized to null

        if (nearestTower && Math.random() < 0.02) { // Adjust shooting chance
            enemyProjectiles.push(new EnemyProjectile(this.x, this.y, nearestTower, this.attackPower));
        }
    }

    getDistance(tower) {
        const dx = this.x - tower.x;
        const dy = this.y - tower.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

// Enemy projectile class
class EnemyProjectile {
    constructor(x, y, target, damage) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 3;
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
        ctx.fillStyle = 'red';
        ctx.fill();
    }

    hit() {
        const dx = this.x - this.target.x;
        const dy = this.y - this.target.y;
        return Math.sqrt(dx * dx + dy * dy) < this.target.size;
    }
}

// Tower class with upgrades
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 50; // Fires every 50 frames
        this.damage = 1;
        this.health = 5; // Tower health
        this.type = Math.random() < 0.5 ? 'basic' : 'special'; // Randomly assign a type
        this.upgradeCost = 50;
        this.color = this.type === 'basic' ? 'blue' : 'purple';
    }

    shoot() {
        const target = enemies.find(enemy => this.getDistance(enemy) <= this.range);
        if (target && frames % this.fireRate === 0) {
            projectiles.push(new Projectile(this.x, this.y, target, this.damage, this.type));
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
        
        // Draw health bar
        ctx.fillStyle = 'green';
        ctx.fillRect(this.x - 10, this.y - 25, 20 * (this.health / 5), 5); // Adjust for tower health
    }

    upgrade() {
        if (money >= this.upgradeCost) {
            this.damage++;
            this.health++; // Increase health on upgrade
            money -= this.upgradeCost;
            this.upgradeCost += 20; // Increase upgrade cost
        }
    }
}

// Projectile class with unique effects
class Projectile {
    constructor(x, y, target, damage, type) {
        this.x = x;
        this.y = y;
        this.target = target;
        this.speed = 5;
        this.damage = damage;
        this.type = type;
    }

    move() {
        const angle = Math.atan2(this.target.y - this.y, this.target.x - this.x);
        this.x += Math.cos(angle) * this.speed;
        this.y += Math.sin(angle) * this.speed;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, 5, 0, Math.PI * 2);
        ctx.fillStyle = this.type === 'basic' ? 'yellow' : 'orange'; // Different color for special projectiles
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
        enemy.shoot();
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
            const enemyIndex = enemies.indexOf(projectile.target);
            if (enemyIndex !== -1) {
                projectile.target.health -= projectile.damage;
                if (projectile.target.health <= 0) {
                    score += 10; // Increase score for defeating an enemy
                    document.getElementById('score').innerText = score;
                    enemies.splice(enemyIndex, 1);
                }
            }
            projectiles.splice(index, 1);
        }
    });

    // Move and draw enemy projectiles
    enemyProjectiles.forEach((ep, index) => {
        ep.move();
        ep.draw();
        
        // Check if enemy projectile hits a tower
        if (ep.hit()) {
            ep.target.health -= ep.damage; // Reduce tower health
            enemyProjectiles.splice(index, 1);
            if (ep.target.health <= 0) {
                // Optionally handle tower destruction
                const towerIndex = towers.indexOf(ep.target);
                towers.splice(towerIndex, 1);
                alert('A tower has been destroyed!');
            }
        }
    });
    
    frames++;
    requestAnimationFrame(gameLoop);
}

// Start game function
function startGame() {
    gameActive = true;
    document.getElementById('startButton').disabled = true;
    document.getElementById('pauseButton').disabled = false;
    document.getElementById('upgradePanel').style.display = 'none';
    gameLoop();
}

// Pause game function
function pauseGame() {
    gameActive = false;
    document.getElementById('startButton').disabled = false;
    document.getElementById('pauseButton').disabled = true;
}

// Create enemy function with random attributes
function createEnemy() {
    const types = [
        { speed: 1, health: 2, color: 'green' },  // Basic enemy
        { speed: 1.5, health: 3, color: 'yellow' }, // Fast enemy
        { speed: 0.8, health: 5, color: 'red' }   // Strong enemy
    ];
    const randomType = types[Math.floor(Math.random() * types.length)];
    return new Enemy(randomType.speed, randomType.health, randomType.color);
}

// Add event listeners to buttons
document.getElementById('startButton').addEventListener('click', startGame);
document.getElementById('pauseButton').addEventListener('click', pauseGame);

// Initialize towers on left click
canvas.addEventListener('click', (event) => {
    if (!gameActive) return;
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (money >= 50) { // Cost to place a tower
        towers.push(new Tower(x, y));
        money -= 50;
        document.getElementById('money').innerText = money;
    }
});

// Upgrade towers using the upgrade panel
document.getElementById('upgradeButton').addEventListener('click', () => {
    if (selectedTower) {
        selectedTower.upgrade();
        document.getElementById('money').innerText = money;
        document.getElementById('selectedTowerInfo').innerText = `Tower upgraded! Current health: ${selectedTower.health}`;
    }
});

// Select tower for upgrade on click
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    selectedTower = towers.find(tower => Math.hypot(tower.x - x, tower.y - y) < 20);
    
    if (selectedTower) {
        document.getElementById('upgradePanel').style.display = 'block';
        document.getElementById('selectedTowerInfo').innerText = `Selected Tower: Health ${selectedTower.health}, Damage ${selectedTower.damage}`;
    } else {
        document.getElementById('upgradePanel').style.display = 'none';
        selectedTower = null;
    }
});
