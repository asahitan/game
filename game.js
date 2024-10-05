const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 600;
canvas.height = 600;

let enemies = [];
let towers = [];
let projectiles = [];
let level = 1;
let spawnInterval = 100;
let frames = 0;
let lives = 10;
let money = 100;

document.getElementById('lives').innerText = lives;
document.getElementById('money').innerText = money;
document.getElementById('level').innerText = level;

// Base class for enemies
class Enemy {
    constructor(speed, health, color) {
        this.x = Math.random() * canvas.width;
        this.y = 0;
        this.speed = speed;
        this.health = health;
        this.size = 20;
        this.color = color;
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
}

// Different enemy types
function createEnemy() {
    const type = Math.random();
    if (type < 0.5) {
        return new Enemy(1, 2, 'red'); // Fast enemy
    } else {
        return new Enemy(0.5, 4, 'blue'); // Slower, tankier enemy
    }
}

// Tower class with upgrades
class Tower {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.range = 100;
        this.fireRate = 50;  // Fires every 50 frames
        this.damage = 1;
        this.upgradeCost = 50;
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
        ctx.fillStyle = 'blue';
        ctx.fill();
    }
    
    upgrade() {
        if (money >= this.upgradeCost) {
            this.damage++;
            money -= this.upgradeCost;
            this.upgradeCost += 20; // Increase upgrade cost
        }
    }
}

// Projectile class
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
        enemy.draw();
        
        // Remove enemies that reach the bottom
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
            lives--;
            document.getElementById('lives').innerText = lives;
            if (lives <= 0) {
                alert('Game Over!');
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
                money += 20; // Gain money for defeating an enemy
                document.getElementById('money').innerText = money;
            }
            projectiles.splice(index, 1);
        }
    });
    
    frames++;
    
    // Increase difficulty over time
    if (frames % 1000 === 0) {
        level++;
        spawnInterval = Math.max(20, spawnInterval - 10);
        document.getElementById('level').innerText = level;
    }
    
    requestAnimationFrame(gameLoop);
}

// Initialize towers
canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    if (money >= 50) { // Cost to place a tower
        towers.push(new Tower(x, y));
        money -= 50;
        document.getElementById('money').innerText = money;
    }
});

// Upgrade towers
canvas.addEventListener('contextmenu', (event) => {
    event.preventDefault();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    towers.forEach(tower => {
        if (Math.hypot(tower.x - x, tower.y - y) < 20) {
            tower.upgrade();
        }
    });
});

// Start the game loop
gameLoop();
