// game.js

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2,
    y: canvas.height - 80,
    width: 50,
    height: 50,
    speed: 7,
    dx: 0,
    dy: 0,
    color: 'cyan'
};

let bullets = [];
let enemies = [];
let stars = [];
let score = 0;
let isGameOver = false;

// Create stars for the moving background
for (let i = 0; i < 100; i++) {
    stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2,
        speed: Math.random() * 2
    });
}

// Control player movement
document.addEventListener('keydown', movePlayer);
document.addEventListener('keyup', stopPlayer);

function movePlayer(e) {
    if (e.key === 'ArrowRight') player.dx = player.speed;
    else if (e.key === 'ArrowLeft') player.dx = -player.speed;
    if (e.key === ' ') shoot();
}

function stopPlayer(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') player.dx = 0;
}

// Shoot bullets
function shoot() {
    bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 3, height: 20, dy: -7, color: 'red' });
}

// Create enemies at random positions
function createEnemies() {
    enemies.push({ 
        x: Math.random() * (canvas.width - 50), 
        y: -50, 
        width: 50, 
        height: 50, 
        dy: 3, 
        color: `hsl(${Math.random() * 360}, 50%, 50%)`
    });
}

// Collision detection between bullets and enemies
function collisionDetection(bullet, enemy) {
    return bullet.x < enemy.x + enemy.width &&
           bullet.x + bullet.width > enemy.x &&
           bullet.y < enemy.y + enemy.height &&
           bullet.y + bullet.height > enemy.y;
}

// Move stars to create a background scrolling effect
function updateStars() {
    stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
            star.y = 0;
            star.x = Math.random() * canvas.width;
        }
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
    });
}

// Handle game over
function endGame() {
    isGameOver = true;
    document.getElementById('gameOverScreen').style.display = 'block';
}

// Restart the game
function restartGame() {
    document.getElementById('gameOverScreen').style.display = 'none';
    isGameOver = false;
    player.x = canvas.width / 2;
    player.y = canvas.height - 80;
    bullets = [];
    enemies = [];
    score = 0;
    updateGame();
}

// Update player, bullets, enemies, and check collisions
function updateGame() {
    if (isGameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Move player
    player.x += player.dx;
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;

    // Draw stars background
    updateStars();

    // Draw player spaceship
    ctx.fillStyle = player.color;
    ctx.beginPath();
    ctx.moveTo(player.x, player.y);
    ctx.lineTo(player.x + player.width / 2, player.y - player.height);
    ctx.lineTo(player.x + player.width, player.y);
    ctx.closePath();
    ctx.fill();

    // Move and draw bullets
    bullets = bullets.filter(bullet => bullet.y > 0);
    bullets.forEach(bullet => {
        bullet.y += bullet.dy;
        ctx.fillStyle = bullet.color;
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
    });

    // Move and draw enemies
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.dy;
        if (enemy.y > canvas.height) enemies.splice(index, 1); // Remove if off screen

        // Check for collision with player
        if (collisionDetection(player, enemy)) {
            endGame();
        }

        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });

    // Check collisions between bullets and enemies
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (collisionDetection(bullet, enemy)) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemyIndex, 1);
                score += 100;

                // Simple explosion effect
                for (let i = 0; i < 10; i++) {
                    bullets.push({
                        x: enemy.x + enemy.width / 2,
                        y: enemy.y + enemy.height / 2,
                        width: 2,
                        height: 2,
                        dx: (Math.random() - 0.5) * 4,
                        dy: (Math.random() - 0.5) * 4,
                        color: 'orange'
                    });
                }
            }
        });
    });

    // Spawn new enemies
    if (Math.random() < 0.02) createEnemies();

    // Draw score
    ctx.fillStyle = 'yellow';
    ctx.font = '20px Arial';
    ctx.fillText('Score: ' + score, 20, 30);

    requestAnimationFrame(updateGame);
}

// Start the game loop
updateGame();
