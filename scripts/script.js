const hangmanImage = document.querySelector(".hangman-box img");
const wordDisplay = document.querySelector(".word-display");
const guessesText = document.querySelector(".guesses-text b");
const keyboardDiv = document.querySelector(".keyboard");
const gameModal = document.querySelector(".game-modal");
const playAgainBtn = document.querySelector(".play-again"); // This is still the "Play Again" button


let currentWord,correctLetters, wrongGuessCount;
const maxGuesses = 6;

const resetGame = () => {
    //reseting all game variables and UI elements
    correctLetters = [];
    wrongGuessCount = 0;
    hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;
    keyboardDiv.querySelectorAll("button").forEach(btn => btn.disabled = false);
    wordDisplay.innerHTML = currentWord.split("").map(() => `<li class="letter"></li>`).join("");
    gameModal.classList.remove("show");

    // Ensure only the "Play Again" button exists and is visible when resetting
    // Remove any previously added "Go to Final Page" button
    const finalPageBtn = gameModal.querySelector(".next-page-btn");
    if (finalPageBtn) {
        finalPageBtn.remove();
    }
    playAgainBtn.style.display = 'block'; // Make sure Play Again button is visible for next game
}

const getRandomWord = () => {
    // Selecting a random word from the wordlist
    const { word, hint } = wordList[Math.floor(Math.random() * wordList.length)];
    currentWord = word;
    document.querySelector(".hint-text b").innerText = hint;
    resetGame(); // Reset game state including button visibility
}

const gameOver = (isVictory) => {
    // After 300ms of the game completing.. showing modal with relevant details
    setTimeout(() => {
        const modalText = isVictory ? `You found the word: ` : `The correct word was:`;
        gameModal.querySelector("img").src = `images/${isVictory ? 'victory' : 'lost'}.gif`;
        gameModal.querySelector("h4").innerText = `${isVictory ? 'Ok fine you got it ig 🙄' : 'Game Over!'}`;
        gameModal.querySelector("p").innerHTML = `${modalText}<b>${currentWord}</b>`;
        gameModal.classList.add("show");

        if (isVictory) {
            // Hide the "Play Again" button
            playAgainBtn.style.display = 'none';

            // Create and append the "Go to Final Page" button
            const nextButton = document.createElement('button');
            nextButton.textContent = 'Go to Final Page';
            nextButton.classList.add('next-page-btn'); // Add a class for specific styling
            nextButton.onclick = () => {
                window.location.href = 'finalpage.html'; // Link to finalpage.html
            };
            gameModal.querySelector(".content").appendChild(nextButton);
        } else {
            // Ensure "Play Again" button is visible if player loses
            playAgainBtn.style.display = 'block';
            // Remove "Go to Final Page" button if it exists from a previous win
            const finalPageBtn = gameModal.querySelector(".next-page-btn");
            if (finalPageBtn) {
                finalPageBtn.remove();
            }
        }
    }, 300);
}

const initGame = (button, clickedLetter) =>{
    // checking if clicked button exists on the word
    if(currentWord.includes(clickedLetter)) {
        // showing all correct letters on the word display
        [...currentWord].forEach((letter, index) => {
            if(letter === clickedLetter) {
                correctLetters.push(letter);
                wordDisplay.querySelectorAll("li")[index].innerText = letter;
                wordDisplay.querySelectorAll("li")[index].classList.add("guessed");
            }
        })
    } else {
        // If clicked letter is wrong then update the wrong guess count and the hangman image
        wrongGuessCount++;
        hangmanImage.src = `images/hangman-${wrongGuessCount}.svg`;
    }

    button.disabled = true;
    guessesText.innerText = `${wrongGuessCount} / ${maxGuesses}`;

    // calling gameover function if any of these conditions are met
    if(wrongGuessCount === maxGuesses) return gameOver(false);
    if(correctLetters.length === currentWord.length) return gameOver(true);
}

// Creating keyboard buttons and adding event listeners
for (let i = 97; i <= 122; i ++) {
    const button = document.createElement("button");
    button.innerText = String.fromCharCode(i)
    keyboardDiv.appendChild(button);
    button.addEventListener("click", e => initGame(e.target, String.fromCharCode(i)));
}

getRandomWord();
// Play Again button handler - now it just calls getRandomWord to reset the game
playAgainBtn.addEventListener("click", getRandomWord);