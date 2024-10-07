const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player settings
let player = {
    x: 50,
    y: 50,
    width: 40,
    height: 40,
    speed: 5,
    color: 'white'
};

// Listen for keypress events
window.addEventListener('keydown', movePlayer);

function movePlayer(event) {
    switch(event.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
    }
}

// Game loop to continuously update the game
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawPlayer();
    requestAnimationFrame(gameLoop);
}

// Draw player character
function drawPlayer() {
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);
}

// Start the game
gameLoop();
