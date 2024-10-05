const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 50,
    height: 50,
    speed: 5,
    movingLeft: false,
    movingRight: false,
    bullets: []
};

let enemies = [];
let enemySpeed = 2;

function drawPlayer() {
    ctx.fillStyle = 'red';
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

function movePlayer() {
    if (player.movingLeft && player.x > 0) {
        player.x -= player.speed;
    }
    if (player.movingRight && player.x + player.width < canvas.width) {
        player.x += player.speed;
    }
}

function shootBullet() {
    player.bullets.push({
        x: player.x + player.width / 2 - 5,
        y: player.y,
        width: 5,
        height: 10,
        speed: 7
    });
}

function drawBullets() {
    player.bullets.forEach((bullet, index) => {
        ctx.fillStyle = 'yellow';
        ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
        bullet.y -= bullet.speed;

        // Remove bullets that go off screen
        if (bullet.y < 0) {
            player.bullets.splice(index, 1);
        }
    });
}

function createEnemy() {
    let x = Math.random() * (canvas.width - 50);
    enemies.push({
        x: x,
        y: -50,
        width: 50,
        height: 50
    });
}

function drawEnemies() {
    enemies.forEach((enemy, index) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
        enemy.y += enemySpeed;

        // Remove enemies that go off screen
        if (enemy.y > canvas.height) {
            enemies.splice(index, 1);
        }
    });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawPlayer();
    movePlayer();
    drawBullets();
    drawEnemies();

    requestAnimationFrame(updateGame);
}

// Controls
window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        player.movingLeft = true;
    } else if (e.key === 'ArrowRight') {
        player.movingRight = true;
    } else if (e.key === ' ') {
        shootBullet();
    }
});

window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowLeft') {
        player.movingLeft = false;
    } else if (e.key === 'ArrowRight') {
        player.movingRight = false;
    }
});

// Spawn enemies every 2 seconds
setInterval(createEnemy, 2000);

// Start the game loop
updateGame();
