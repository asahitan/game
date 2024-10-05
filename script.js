const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    dx: 0,
    dy: 0
};

const bullets = [];
const enemies = [];
let enemySpawnInterval;

// Load assets
const playerImage = new Image();
playerImage.src = 'player-ship.png';

// Control the player's ship
function movePlayer() {
    player.x += player.dx;
    player.y += player.dy;

    // Wall detection
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw player spaceship
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Draw bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        bullet.y -= bullet.speed;
        ctx.fillStyle = 'green';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);

        // Remove off-screen bullets
        if (bullet.y < 0) {
            bullets.splice(index, 1);
        }
    });
}

// Draw enemies
function drawEnemies() {
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // Remove off-screen enemies
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

// Spawn enemies
function spawnEnemy() {
    const enemy = {
        x: Math.random() * (canvas.width - 50),
        y: -50,
        width: 50,
        height: 50,
        speed: 3
    };
    enemies.push(enemy);
}

// Bullet firing logic
function fireBullet() {
    const bullet = {
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 5,
        height: 20,
        speed: 7
    };
    bullets.push(bullet);
}

// Collision detection between bullets and enemies
function checkCollisions() {
    bullets.forEach((bullet, bIndex) => {
        enemies.forEach((enemy, eIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + bullet.width > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + bullet.height > enemy.y
            ) {
                bullets.splice(bIndex, 1);
                enemies.splice(eIndex, 1);
            }
        });
    });
}

// Keyboard event handlers
function keyDown(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = -player.speed;
    } else if (e.key === ' ') {
        fireBullet();
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'd') {
        player.dx = 0;
    } else if (e.key === 'ArrowLeft' || e.key === 'a') {
        player.dx = 0;
    }
}

// Main game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    movePlayer();
    drawPlayer();
    drawBullets();
    drawEnemies();
    checkCollisions();

    requestAnimationFrame(update);
}

// Start the game
function startGame() {
    enemySpawnInterval = setInterval(spawnEnemy, 1000);
    update();
}

startGame();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
