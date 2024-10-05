const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const spaceship = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 70,
    width: 50,
    height: 50,
    dx: 0
};

const laserArray = [];
const enemiesArray = [];

// Draw spaceship
function drawSpaceship() {
    ctx.fillStyle = 'white';
    ctx.fillRect(spaceship.x, spaceship.y, spaceship.width, spaceship.height);
}

// Move spaceship
function moveSpaceship() {
    spaceship.x += spaceship.dx;

    // Boundary checks
    if (spaceship.x < 0) {
        spaceship.x = 0;
    } else if (spaceship.x + spaceship.width > canvas.width) {
        spaceship.x = canvas.width - spaceship.width;
    }
}

// Create laser
function shootLaser() {
    laserArray.push({
        x: spaceship.x + spaceship.width / 2 - 2,
        y: spaceship.y,
        width: 4,
        height: 10,
        dy: -5
    });
}

// Draw laser
function drawLaser() {
    laserArray.forEach((laser, index) => {
        ctx.fillStyle = 'green';
        ctx.fillRect(laser.x, laser.y, laser.width, laser.height);
        laser.y += laser.dy;

        // Remove lasers that go off-screen
        if (laser.y < 0) {
            laserArray.splice(index, 1);
        }
    });
}

// Create enemies
function createEnemies() {
    for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 6; j++) {
            enemiesArray.push({
                x: 100 + j * 100,
                y: 50 + i * 60,
                width: 40,
                height: 40
            });
        }
    }
}

// Draw enemies
function drawEnemies() {
    enemiesArray.forEach(enemy => {
        ctx.fillStyle = 'red';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    });
}

// Key press events
function keyDown(e) {
    if (e.key === 'ArrowRight') {
        spaceship.dx = 5;
    } else if (e.key === 'ArrowLeft') {
        spaceship.dx = -5;
    } else if (e.key === ' ') {
        shootLaser();
    }
}

function keyUp(e) {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        spaceship.dx = 0;
    }
}

// Main game loop
function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSpaceship();
    moveSpaceship();
    drawLaser();
    drawEnemies();

    requestAnimationFrame(update);
}

createEnemies();
update();

document.addEventListener('keydown', keyDown);
document.addEventListener('keyup', keyUp);
