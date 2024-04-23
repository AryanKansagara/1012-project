// Get DOM elements
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const startScreen = document.getElementById('start-screen');
const startButton = document.getElementById('start-button');
const gameOverScreen = document.getElementById('game-over-screen');
const finalScore = document.getElementById('final-score');
const restartButton = document.getElementById('restart-button');
const scoreDisplay = document.getElementById('score');
const highScoreDisplay = document.getElementById('high-score');

// Game variables
let player;
let enemies = [];
let bullets = [];
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;

// Player object
class Player {
    constructor() {
        this.width = 50;
        this.height = 30;
        this.x = canvas.width / 2 - this.width / 2;
        this.y = canvas.height - this.height - 10;
        this.speed = 20;
    }

    draw() {
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move(direction) {
        if (direction === 'left' && this.x > 0) {
            this.x -= this.speed;
        } else if (direction === 'right' && this.x < canvas.width - this.width) {
            this.x += this.speed;
        }
    }
    
}
// Player.requestAnimationFrame(move);

// Enemy object
class Enemy {
    constructor(x, y) {
        this.width = 30;
        this.height = 30;
        this.x = x;
        this.y = y;
        this.speed = 1 + Math.random() * 2;
    }

    draw() {
        ctx.fillStyle = '#f00';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y += this.speed;
    }
}

// Bullet object
class Bullet {
    constructor(x, y) {
        this.width = 5;
        this.height = 10;
        this.x = x + 22.5;
        this.y = y;
        this.speed = 5;
    }

    draw() {
        ctx.fillStyle = '#0f0';
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    move() {
        this.y -= this.speed;
    }
}

// Start game function
function startGame() {
    startScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    isGameOver = false;
    player = new Player();
    enemies = [];
    bullets = [];
    score = 0;
    updateScore();
    updateHighScore();
    createEnemies();
    gameLoop();
}


// ------------------------------------------------------------------------------------------------
//Game loop - smooth animation
function gameLoop() {
    if (isGameOver) {
        gameOver();
        return;
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    player.draw();

    // Draw enemies
    enemies.forEach(enemy => {
        enemy.draw();
        enemy.move();

        // Check collision with player
        if (checkCollision(player, enemy)) {
            isGameOver = true;
        }

        // Check collision with bullets
        bullets.forEach((bullet, bulletIndex) => {
            if (checkCollision(bullet, enemy)) {
                bullets.splice(bulletIndex, 1);
                enemies.splice(enemies.indexOf(enemy), 1);
                score++;
                updateScore();
            }
        });
    });

    // Draw bullets
    bullets.forEach(bullet => {
        bullet.draw();
        bullet.move();
    });

    // Remove off-screen bullets
    bullets = bullets.filter(bullet => bullet.y > 0);

    // Generate more enemies
    if (Math.random() < 0.02) {
        createEnemies();
    }

    // Schedule next frame
    requestAnimationFrame(gameLoop);
}

// ------------------------------------------------------------------------------------------------
// // Game loop
// function gameLoop() {
//     if (isGameOver) {
//         gameOver();
//         return;
//     }

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw player
//     player.draw();

//     // Draw enemies
//     enemies.forEach(enemy => {
//         enemy.draw();
//         enemy.move();

//         // Check collision with player
//         if (checkCollision(player, enemy)) {
//             isGameOver = true;
//         }

//         // Check collision with bullets
//         bullets.forEach((bullet, bulletIndex) => {
//             if (checkCollision(bullet, enemy)) {
//                 bullets.splice(bulletIndex, 1);
//                 enemies.splice(enemies.indexOf(enemy), 1);
//                 score++;
//                 updateScore();
//             }
//         });
//     });

//     // Draw bullets
//     bullets.forEach(bullet => {
//         bullet.draw();
//         bullet.move();
//     });

//     // Remove off-screen bullets
//     bullets = bullets.filter(bullet => bullet.y > 0);

//     // Generate more enemies
//     if (Math.random() < 0.02) {
//         createEnemies();
//     }

//     requestAnimationFrame(gameLoop);
// }

// Game over function
function gameOver() {
    gameOverScreen.style.display = 'flex';
    finalScore.textContent = score;
    if (score > highScore) {
        highScore = score;
        localStorage.setItem('highScore', highScore);
        updateHighScore();
    }
}

// Update score display
function updateScore() {
    scoreDisplay.textContent = score;
}

// Update high score display
function updateHighScore() {
    highScoreDisplay.textContent = highScore;
}

// Check collision between two objects
function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

// Create enemies
function createEnemies() {
    const x = Math.random() * (canvas.width - 30);
    const y = -30;
    enemies.push(new Enemy(x, y));
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowLeft') {
        player.move('left');
    } else if (event.key === 'ArrowRight') {
        player.move('right');
    } else if (event.key === ' ') {
        bullets.push(new Bullet(player.x, player.y));
    }
});

// Start game
startGame();
