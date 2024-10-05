// Select canvas and set up context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Set canvas dimensions to fill the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Game variables
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  speed: 5
};

const projectiles = [];
const enemies = [];
let score = 0;

// Event listener for player movement
document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') player.y -= player.speed;
  if (event.key === 'ArrowDown') player.y += player.speed;
  if (event.key === 'ArrowLeft') player.x -= player.speed;
  if (event.key === 'ArrowRight') player.x += player.speed;
});

// Event listener for shooting
document.addEventListener('click', (event) => {
  const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
  projectiles.push({
    x: player.x,
    y: player.y,
    radius: 5,
    speed: 10,
    dx: Math.cos(angle) * 10,
    dy: Math.sin(angle) * 10
  });
});

// Game loop
function gameLoop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw player
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();

  // Update and draw projectiles
  projectiles.forEach((projectile, index) => {
    projectile.x += projectile.dx;
    projectile.y += projectile.dy;

    ctx.beginPath();
    ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();

    // Remove projectile if it goes off screen
    if (
      projectile.x + projectile.radius < 0 ||
      projectile.x - projectile.radius > canvas.width ||
      projectile.y + projectile.radius < 0 ||
      projectile.y - projectile.radius > canvas.height
    ) {
      projectiles.splice(index, 1);
    }
  });

  // Generate random enemies
  if (Math.random() < 0.02) {
    const size = Math.random() * 30 + 10;
    enemies.push({
      x: Math.random() * canvas.width,
      y: 0 - size,
      radius: size,
      speed: Math.random() * 2 + 1
    });
  }

  // Update and draw enemies
  enemies.forEach((enemy, index) => {
    enemy.y += enemy.speed;

    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();

    // Remove enemy if it goes off screen
    if (enemy.y - enemy.radius > canvas.height) {
      enemies.splice(index, 1);
    }

    // Check for collisions with projectiles
    projectiles.forEach((projectile, projIndex) => {
      const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
      if (dist - projectile.radius - enemy.radius < 1) {
        // Increase score
        score += 100;

        // Remove enemy and projectile
        enemies.splice(index, 1);
        projectiles.splice(projIndex, 1);
      }
    });
  });

  // Display score
  ctx.fillStyle = 'yellow';
  ctx.font = '24px Arial';
  ctx.fillText(`Score: ${score}`, 10, 30);

  requestAnimationFrame(gameLoop);
}

// Start the game loop
gameLoop();
