let humanScore = 0;
let computerScore = 0;

const resultDisplay = document.createElement("p");
document.querySelector("#result").appendChild(resultDisplay);

const humanImage = document.createElement("img");
humanImage.src = 'imgs/question.png';
document.querySelector("#choice").appendChild(humanImage);

const computerImage = document.createElement("img");
computerImage.src = 'imgs/question.png';
document.querySelector("#choice").appendChild(computerImage);

const humanChoices = document.querySelectorAll(".humanChoice img");
humanChoices.forEach(choice => 
    choice.addEventListener("click", () => {
        playRound(choice.alt, getComputerChoice());
        document.querySelector(".introduction").style.display = 'none';
    })
);

function getComputerChoice() {
    const choices = ["Rock", "Paper", "Scissors"];
    return choices[Math.floor(Math.random() * 3)];
}

function playRound(humanChoice, computerChoice) {
    switch (true) {
        case humanChoice === "Rock" && computerChoice === "Scissors":
        case humanChoice === "Paper" && computerChoice === "Rock":
        case humanChoice === "Scissors" && computerChoice === "Paper":
            humanScore++;
            resultDisplay.innerHTML = `Human wins this round! ${humanChoice} beats ${computerChoice}<br>`;
            break;
        case humanChoice === computerChoice:
            resultDisplay.innerHTML = "It's a tie!<br>";
            break;
        default:
            computerScore++;
            resultDisplay.innerHTML = `Computer wins this round! ${computerChoice} beats ${humanChoice}<br>`;
            break;
    }
    resultDisplay.innerHTML += `Human ${humanScore} - Computer ${computerScore}`;
    
    humanImage.src = getPickImage(humanChoice);
    computerImage.src = getPickImage(computerChoice);

    humanImage.style.display = 'flex';
    computerImage.style.display = 'flex';

    console.log(`Human Score: ${humanScore}`);
    console.log(`Computer Score: ${computerScore}`);

    if(humanScore === 5) {
        resultDisplay.innerHTML = `The human wins the game!`;
        humanImage.style.display = 'none';
        computerImage.style.display = 'none';
        humanChoices.forEach(choice => choice.style.display = 'none');
    } else if(computerScore === 5) {
        resultDisplay.innerHTML = `The computer wins the game!`;
        humanImage.style.display = 'none';
        computerImage.style.display = 'none';
        humanChoices.forEach(choice => choice.style.display = 'none');
    }
}

function getPickImage(choice) {
    switch (choice) {
        case "Rock":
            return "imgs/rock.webp";
        case "Paper":
            return "imgs/paper.webp";
        case "Scissors":
            return "imgs/scissors.webp";
    }
}
