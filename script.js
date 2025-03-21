const playBoard = document.querySelector(".play-board");

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = []; // Store body segments
let velocityX = 0, velocityY = 0; // Initial velocity (no movement)
let gameOver = false; // Track if the game is over
let gameInterval; // Store the interval ID for stopping the game

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

const changeDirection = (e) => {
    if (e.key === "ArrowUp" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1; // Move up
    } else if (e.key === "ArrowDown" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1; // Move down
    } else if (e.key === "ArrowLeft" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0; // Move left
    } else if (e.key === "ArrowRight" && velocityX === 0) {
        velocityX = 1;
        velocityY = 0; // Move right
    }
}

const updateGame = () => {
    if (gameOver) return; // Prevent further movement if the game is over

    // Save the current head position
    const head = { x: snakeX, y: snakeY };

    // Move the snake: Add the head to the front of the array
    snakeX += velocityX;
    snakeY += velocityY;

    // Add the previous head position to the body
    snakeBody.unshift(head);

    // Check if the snake has eaten the food
    if (snakeX === foodX && snakeY === foodY) {
        changeFoodPosition();  // Generate new food
    } else {
        // If food is not eaten, remove the last segment of the body
        snakeBody.pop();
    }

    // Check if the snake collided with the walls
    if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
        gameOver = true;  // Set game over
        clearInterval(gameInterval);  // Stop the game loop
        renderGame();  // Render final "Game Over" state
        return;
    }

    // Render the updated game
    renderGame();
}

const renderGame = () => {
    let htmlMarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Render the head of the snake
    htmlMarkup += `<div class="head" style="grid-area: ${snakeY} / ${snakeX}"></div>`;

    // Render each part of the snake's body
    snakeBody.forEach(segment => {
        htmlMarkup += `<div class="body" style="grid-area: ${segment.y} / ${segment.x}"></div>`;
    });

    // If the game is over, display the "Game Over" message
    if (gameOver) {
        htmlMarkup += `<div class="game-over">Game Over</div>`;
    }

    playBoard.innerHTML = htmlMarkup;
}

const initGame = () => {
    changeFoodPosition();
    renderGame();
    gameInterval = setInterval(updateGame, 100); // Update game every 100ms
}

// Listen for arrow key presses to change direction
document.addEventListener("keydown", changeDirection);

initGame();
