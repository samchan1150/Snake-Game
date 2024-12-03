const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const gridSize = 20; // Each cell is 20x20 pixels
const tileCount = 20; // 20x20 grid

let gameSpeed = 200; // Snake speed in ms

let gameInterval;

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
    draw();
    
    // Disable the start button 
    startButton.classList.add('hidden');

    // Start the game loop
    gameInterval = setInterval(update, gameSpeed);
}

function changeDirection(event) {
    const keyPressed = event.key;
    const arrowKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
    if (!arrowKeys.includes(keyPressed)) return;

    switch(keyPressed) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = {x: 0, y: -1};
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = {x: 0, y: 1};
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = {x: -1, y: 0};
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = {x: 1, y: 0};
            }
            break;
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
    } else {
        snake.pop(); // Remove tail if no food eaten
    }

    draw();
}

function draw() {
    // Clear the canvas
    ctx.fillStyle = '#000'; // Black background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

    // Draw snake
    ctx.fillStyle = 'green';
    snake.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
    });
}

function endGame() {
    gameOver = true;
    clearInterval(gameInterval);
    alert('Game Over!');

    startButton.classList.remove('hidden');
}

