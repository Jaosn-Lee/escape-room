const gameContainer = document.querySelector(".container"),
    userResult = document.querySelector(".user_result img"),
    cpuResult = document.querySelector(".cpu_result img"),
    result = document.querySelector(".result"),
    optionImages = document.querySelectorAll(".option_image");

// New constant for the next page button container
const nextButtonContainer = document.getElementById('next-page-button-container');

// Function to show the "Next Page" button
function showNextPageButton() {
    // Clear any existing button to prevent duplicates if game is played multiple times
    nextButtonContainer.innerHTML = '';

    const nextButton = document.createElement('button');
    nextButton.id = 'next-page-button';
    nextButton.textContent = 'Go to Next Page';
    nextButton.onclick = function() {
        // Replace 'next-page.html' with the actual path to your next page
        window.location.href = 'room8.html';
    };
    nextButtonContainer.appendChild(nextButton);
    nextButtonContainer.style.display = 'block'; // Make the container visible
}

// Function to hide the "Next Page" button
function hideNextPageButton() {
    nextButtonContainer.style.display = 'none'; // Hide the container
}

optionImages.forEach((image, index) => {
    image.addEventListener("click", (e) => {
        image.classList.add("active");

        optionImages.forEach((image2,index2) => {
            index !== index2 && image2.classList.remove("active");
        });

        gameContainer.classList.add("start");

        let time = setTimeout(()=>{
            gameContainer.classList.remove("start");
            let imageSrc = e.target.querySelector("img").src;
            userResult.src = imageSrc;

            let randomNumber = Math.floor(Math.random() *3);
            let cpuImages = ["images/rock.png","images/paper.png","images/scissors.png"];
            cpuResult.src = cpuImages[randomNumber];

            let cpuValue = ["R","P","S"][randomNumber];
            let userValue = ["R","P","S"][index];

            let outcomes= {
                RR: "Draw",
                RP: "Cpu",
                RS: "User",
                PP: "Draw",
                PR: "User",
                PS: "Cpu",
                SS: "Draw",
                SR: "Cpu",
                SP: "User",
            };

            let outComeValue = outcomes[userValue + cpuValue];
            
            // Update the result message
            result.textContent = userValue === cpuValue ? "Match Draw" : `${outComeValue} Won!!`;

            // Check if the user won and show/hide the button accordingly
            if (outComeValue === "User") {
                showNextPageButton();
            } else {
                hideNextPageButton();
            }
        },2500);
    });
});

// Initially hide the button when the page loads
hideNextPageButton();