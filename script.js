const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Game Variables
const player = {
    width: 50,
    height: 60,
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    speed: 5,
    dx: 0,
    dy: 0
};

const bullets = [];
const enemies = [];
const bulletSpeed = 5;
const enemySpeed = 2;
const enemyRows = 3;
const enemyCols = 7;

// Load Images
const playerImage = new Image();
playerImage.src = 'https://example.com/your-space-ship.png';  // Replace with a valid image

// Draw the player ship
function drawPlayer() {
    ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

// Move the player
function movePlayer() {
    player.x += player.dx;

    // Boundary check
    if (player.x < 0) player.x = 0;
    if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
}

// Draw the bullets
function drawBullets() {
    bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'red';
        ctx.fillRect(bullet.x, bullet.y, 5, 15);
        bullet.y -= bulletSpeed;

        // Remove bullets that go off-screen
        if (bullet.y < 0) bullets.splice(index, 1);
    });
}

// Shoot a bullet
function shootBullet() {
    bullets.push({
        x: player.x + player.width / 2 - 2.5,
        y: player.y - 10
    });
}

// Draw the enemies
function drawEnemies() {
    enemies.forEach(enemy => {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Create enemy grid
function createEnemies() {
    for (let row = 0; row < enemyRows; row++) {
        for (let col = 0; col < enemyCols; col++) {
            enemies.push({
                x: col * 70 + 50,
                y: row * 50 + 30,
                width: 40,
                height: 40
            });
        }
    }
}

// Move enemies down
function moveEnemies() {
    enemies.forEach(enemy => {
        enemy.y += enemySpeed;

        // If enemies reach the bottom, game over
        if (enemy.y + enemy.height > canvas.height) {
            alert('Game Over');
            document.location.reload();
        }
    });
}

// Collision detection between bullets and enemies
function collisionDetection() {
    bullets.forEach((bullet, bulletIndex) => {
        enemies.forEach((enemy, enemyIndex) => {
            if (
                bullet.x < enemy.x + enemy.width &&
                bullet.x + 5 > enemy.x &&
                bullet.y < enemy.y + enemy.height &&
                bullet.y + 15 > enemy.y
            ) {
                enemies.splice(enemyIndex, 1);
                bullets.splice(bulletIndex, 1);
            }
        });
    });
}

// Handle key down events
function keyDown(e) {
    if (e.key === 'ArrowRight') {
        player.dx = player.speed;
    } else if (e.key === 'ArrowLeft') {
        player.dx = -player.speed;
    } else if (e.key === ' ') {
        shootBullet();
    }
}

// Handle key up events
function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        player.dx = 0;
    }
}

// Update game objects
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw and move player
    drawPlayer();
    movePlayer();

    // Draw and move bullets
    drawBullets();

    // Draw and move enemies
    drawEnemies();
    moveEnemies();

    // Handle collisions
    collisionDetection();

    requestAnimationFrame(update);
}

// Event listeners for key presses
document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);

// Initialize game
createEnemies();
update();
