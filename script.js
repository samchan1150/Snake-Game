const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Each cell is 20x20 pixels
const tileCount = 20; // 20x20 grid

let gameSpeed = 200; // Snake speed in ms

let gameInterval;

const scoreElement = document.getElementById('score');
const startButton = document.getElementById('startButton');
startButton.addEventListener('click', startGame);

// Listen for keyboard input to change direction
document.addEventListener('keydown', changeDirection);

function startGame() {
    snake = [
        {x: 5, y: 5},
        {x: 4, y: 5},
        {x: 3, y: 5}
    ];
    direction = {x: 1, y: 0}; // Moving right initially
    food = spawnFood();
    gameOver = false;
    score = 0;
    updateScore();
    draw();
    
    // Disable the start button 
    startButton.classList.add('hidden');

    // Start the game loop
    gameInterval = setInterval(update, gameSpeed);
}

function changeDirection(event) {
    if (gameOver) return; // Ignore input if the game is over
    if (directionChanged) return; // Prevent multiple direction changes per update
    const keyPressed = event.key;
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!arrowKeys.includes(keyPressed)) return;
    
    let newDirection;

    switch(keyPressed) {
        case 'ArrowUp':
            if (direction.y === 0) {
                newDirection = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                newDirection = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                newDirection = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                newDirection = {x: 1, y: 0};
            }
            break;
    }

    if (newDirection) {
        direction = newDirection;
        directionChanged = true; // Set the flag to true after changing direction
    }
}

function spawnFood() {
    let newFood;
    while (true) {
        newFood = {
            x: Math.floor(Math.random() * tileCount),
            y: Math.floor(Math.random() * tileCount)
        };
        // Ensure food doesn't spawn on the snake
        if (!snake.some(segment => segment.x === newFood.x && segment.y === newFood.y)) {
            break;
        }
    }
    return newFood;
}

function update() {
    const head = {x: snake[0].x + direction.x, y: snake[0].y + direction.y};

    // Check wall collision
    if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
        endGame();
        return;
    }

    // Check self-collision
    if (snake.some(segment => segment.x === head.x && segment.y === head.y)) {
        endGame();
        return;
    }

    snake.unshift(head); // Add new head

    // Check food collision
    if (head.x === food.x && head.y === food.y) {
        food = spawnFood();
        score += 1;
        updateScore();
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    draw();

    // Reset the direction change flag for the next update
    directionChanged = false;
}

function draw() {
    // Clear the canvas
    ctx.fillStyle = '#000'; // Black background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food as a circle
    ctx.fillStyle = 'red';
    ctx.beginPath();
    ctx.arc(
        food.x * gridSize + gridSize / 2, // Center x
        food.y * gridSize + gridSize / 2, // Center y
        (gridSize - 2) / 2,               // Radius
        0,
        2 * Math.PI
    );
    ctx.fill();

    // Draw snake as a continuous line
    ctx.strokeStyle = 'green';
    ctx.lineWidth = gridSize - 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    snake.forEach((segment, index) => {
        const x = segment.x * gridSize + gridSize / 2;
        const y = segment.y * gridSize + gridSize / 2;
        if (index === 0) {
            ctx.moveTo(x, y); // Move to the first segment's center
        } else {
            ctx.lineTo(x, y); // Draw line to the next segment's center
        }
    });
    ctx.stroke();

    // Optionally, draw the snake's head as a circle to emphasize it
    ctx.fillStyle = 'green';
    ctx.beginPath();
    ctx.arc(
        snake[0].x * gridSize + gridSize / 2,
        snake[0].y * gridSize + gridSize / 2,
        (gridSize - 2) / 2,
        0,
        2 * Math.PI
    );
    ctx.fill();
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    alert(`Game Over!\nFinal Score: ${score}`);
    startButton.classList.remove('hidden');
}

