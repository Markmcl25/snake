const playBoard = document.querySelector(".play-board");

let foodX, foodY;
let snakeX = 5, snakeY = 10;
let snakeBody = []; // Store body segments
let velocityX = 0, velocityY = 0; // Initial velocity (no movement)
let gameOver = false; // Track if the game is over
let score = 0; // Initialize score
let highScore = localStorage.getItem('highScore') || 0; // Get high score from localStorage or set to 0 if not found
let gameInterval; // Store the interval ID for stopping the game

const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
}

// Change direction when an arrow key or button is pressed
const changeDirection = (e) => {
    if (e.key === "ArrowUp" || e.target.id === "up" && velocityY === 0) {
        velocityX = 0;
        velocityY = -1; // Move up
    } else if (e.key === "ArrowDown" || e.target.id === "down" && velocityY === 0) {
        velocityX = 0;
        velocityY = 1; // Move down
    } else if (e.key === "ArrowLeft" || e.target.id === "left" && velocityX === 0) {
        velocityX = -1;
        velocityY = 0; // Move left
    } else if (e.key === "ArrowRight" || e.target.id === "right" && velocityX === 0) {
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
        score++;  // Increase score by 1
        changeFoodPosition();  // Generate new food
    } else {
        // If food is not eaten, remove the last segment of the body
        snakeBody.pop();
    }

    // Check if the snake collided with its body
    for (let i = 0; i < snakeBody.length; i++) {
        if (snakeBody[i].x === snakeX && snakeBody[i].y === snakeY) {
            gameOver = true;  // Set game over if head collides with body
            clearInterval(gameInterval);  // Stop the game loop
            if (score > highScore) {
                highScore = score;  // Update high score if current score is higher
                localStorage.setItem('highScore', highScore);  // Store new high score in localStorage
            }
            renderGame();  // Render final "Game Over" state
            return;
        }
    }

    // Check if the snake collided with the walls
    if (snakeX < 1 || snakeX > 30 || snakeY < 1 || snakeY > 30) {
        gameOver = true;  // Set game over
        clearInterval(gameInterval);  // Stop the game loop
        if (score > highScore) {
            highScore = score;  // Update high score if current score is higher
            localStorage.setItem('highScore', highScore);  // Store new high score in localStorage
        }
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

    // Update the score in the existing HTML
    const scoreElement = document.querySelector(".score");
    scoreElement.textContent = `Score: ${score}`;

    // Update the high score in the existing HTML
    const highScoreElement = document.querySelector(".high-score");
    highScoreElement.textContent = `High Score: ${highScore}`;

    playBoard.innerHTML = htmlMarkup;
}

// Event listeners for the control buttons
document.querySelector("#up").addEventListener("click", changeDirection);
document.querySelector("#down").addEventListener("click", changeDirection);
document.querySelector("#left").addEventListener("click", changeDirection);
document.querySelector("#right").addEventListener("click", changeDirection);

// Listen for arrow key presses to change direction
document.addEventListener("keydown", changeDirection);

const initGame = () => {
    changeFoodPosition();
    renderGame();
    gameInterval = setInterval(updateGame, 100); // Update game every 100ms
}

initGame();
