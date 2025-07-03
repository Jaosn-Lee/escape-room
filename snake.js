// board
var blockSize = 25;
var rows = 20;
var columns = 20;
var board;
var context;

// snake head
var snakeX = blockSize * 5;
var snakeY = blockSize * 5;

var velocityX = 0;
var velocityY = 0;

var snakeBody = [];

// food
var foodX;
var foodY;

var gameOver = false;
var score = 0; // Initialize score
var gameInterval; // To store the interval ID for stopping the game

// Constants for button containers
const nextButtonContainer = document.getElementById('next-page-button-container');
const restartButtonContainer = document.getElementById('restart-button-container'); // New constant

window.onload = function() {
    board = document.getElementById("board");
    board.height = rows * blockSize;
    board.width = columns * blockSize;
    context = board.getContext("2d");

    placeFood();
    document.addEventListener("keyup", changeDirection);
    gameInterval = setInterval(update, 1000/10); // Store interval ID
    
    // Ensure buttons are hidden on load
    hideNextPageButton();
    hideRestartButton();
}

// Function to show the "Next Page" button (for winning)
function showNextPageButton() {
    // Clear any existing button to prevent duplicates if game is played multiple times
    nextButtonContainer.innerHTML = '';
    hideRestartButton(); // Ensure restart button is hidden if this one shows

    const nextButton = document.createElement('button');
    nextButton.id = 'next-page-button';
    nextButton.textContent = 'Go to Room 9'; // Button text
    nextButton.onclick = function() {
        window.location.href = 'room9.html'; // Link to room9.html
    };
    nextButtonContainer.appendChild(nextButton);
    nextButtonContainer.style.display = 'block'; // Make the container visible
}

// Function to hide the "Next Page" button
function hideNextPageButton() {
    nextButtonContainer.style.display = 'none'; // Hide the container
}

// NEW: Function to show the "Restart" button (for losing)
function showRestartButton() {
    // Clear any existing button
    restartButtonContainer.innerHTML = '';
    hideNextPageButton(); // Ensure next page button is hidden if this one shows

    const restartButton = document.createElement('button');
    restartButton.id = 'restart-button';
    restartButton.textContent = 'Restart Game';
    restartButton.onclick = function() {
        location.reload(); // Reloads the page, effectively restarting the game
    };
    restartButtonContainer.appendChild(restartButton);
    restartButtonContainer.style.display = 'block'; // Make the container visible
}

// NEW: Function to hide the "Restart" button
function hideRestartButton() {
    restartButtonContainer.style.display = 'none'; // Hide the container
}


function update() {
    if (gameOver) {
        clearInterval(gameInterval); // Stop the game loop
        return;
    }

    context.fillStyle = "black";
    context.fillRect(0, 0, board.width, board.height);

    context.fillStyle = "red";
    context.fillRect(foodX, foodY, blockSize, blockSize);

    if (snakeX == foodX && snakeY == foodY){
        snakeBody.push([foodX, foodY]);
        score++; // Increment score when food is eaten
        placeFood();

        // Check for win condition
        if (score >= 8) {
            gameOver = true; // Set game over to true
            clearInterval(gameInterval); // Stop the game loop immediately
            context.fillStyle = "white"; // Change color for win message
            context.font = "45px Arial";
            context.fillText("You Win!", board.width / 2 - 80, board.height / 2);
            showNextPageButton(); // Show the win button
            return; // Exit update function
        }
    }

    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i-1];
    }
    if (snakeBody.length) {
        snakeBody[0] = [snakeX, snakeY];
    }
    
    context.fillStyle = "lime";
    snakeX += velocityX * blockSize;
    snakeY += velocityY * blockSize;
    context.fillRect(snakeX, snakeY, blockSize, blockSize); 
    for (let i = 0; i < snakeBody.length; i++) {
        context.fillRect(snakeBody[i][0], snakeBody[i][1], blockSize, blockSize);
    }

    // Display score on the canvas
    context.fillStyle = "white";
    context.font = "20px Arial";
    context.fillText("Score: " + score, 10, 25);

    // game over conditions (hitting walls or self)
    // IMPORTANT: Check score here to determine which button to show
    if (snakeX < 0 || snakeX >= columns * blockSize || snakeY < 0 || snakeY >= rows * blockSize ||
        (function() { // Self-collision check
            for (let i = 0; i < snakeBody.length; i++){
                if (snakeX == snakeBody[i][0] && snakeY == snakeBody[i][1]) {
                    return true;
                }
            }
            return false;
        })()) { // Immediately execute the self-collision check
        
        gameOver = true;
        clearInterval(gameInterval); // Stop the game loop

        context.fillStyle = "white";
        context.font = "45px Arial";
        context.fillText("Game Over!", board.width / 2 - 120, board.height / 2);
        
        // Show restart button only if score is less than 8
        if (score < 8) {
            showRestartButton();
        }
    }
}

function changeDirection(e){
    // Prevent changing direction rapidly which can lead to self-collision bugs
    // or immediate game over if trying to reverse into itself
    if ((e.code == "ArrowUp" && velocityY != 1) || (e.code == "KeyW" && velocityY != 1)) {
        velocityX = 0;
        velocityY = -1;
    }
    else if ((e.code == "ArrowDown" && velocityY != -1) || (e.code == "KeyS" && velocityY != -1)) {
        velocityX = 0;
        velocityY = 1;
    }
    else if ((e.code == "ArrowLeft" && velocityX != 1) || (e.code == "KeyA" && velocityX != 1)) {
        velocityX = -1;
        velocityY = 0;
    }
    else if ((e.code == "ArrowRight" && velocityX != -1) || (e.code == "KeyD" && velocityX != -1)) {
        velocityX = 1;
        velocityY = 0;
    }   
}

function placeFood() {
    foodX = Math.floor(Math.random() * columns) * blockSize;
    foodY = Math.floor(Math.random() * rows) * blockSize;
}