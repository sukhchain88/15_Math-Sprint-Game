// pages
const gamePage = document.getElementById("game-page");
const scorePage = document.getElementById("score-page");
const splashPage = document.getElementById("splash-page");
const countdownPage = document.getElementById("countdown-page");
// Splash Page
const startForm = document.getElementById("start-form");
const radioContainer = document.querySelectorAll(".radio-container");
const radioInput = document.querySelectorAll("input");
const bestScoresEl = document.querySelectorAll(".best-score-value");
// Countdown Page
const countdown = document.querySelector(".countdown");
// Game Page
const itemContainer = document.querySelector(".item-container");
// Score page
const finalTimeEl = document.querySelector(".final-time");
const baseTimeEl = document.querySelector(".base-time");
const penaltyTimeEl = document.querySelector(".penalty-time");
const playAgainBtn = document.querySelector(".play-again");

// Equations
let questionAmount = 0;
let equationsArray = [];
let playerGuessArray = [];
let bestScoreArray = [];

// Game Page
let firstNumber = 0;
let secondNumber = 0;
let equationObject = {};
let wrongFormat = [];

// Time
let timer;
let timePlayed = 0;
let baseTime = 0;
let penaltyTime = 0;
let finalTime = 0;
let finalTimeDisplay = "0.0";
// Scroll
let valueY = 0;

// Refresh Splash Page Best Scores

function bestScoreToDOM() {
  bestScoresEl.forEach((bestScore, index) => {
    const bestScoreEl = bestScore;
    bestScoreEl.textContent = `${bestScoreArray[index].bestScore}s`;
  });
}

// Check Local Storage for Best Scores, set bestScoreArray
function getSavedBestScores() {
  if (localStorage.getItem("bestScore")) {
    bestScoreArray = JSON.parse(localStorage.getItem("bestScore"));
  } else {
    bestScoreArray = [
      {
        questions: 10,
        bestScore: finalTimeDisplay,
      },
      {
        questions: 25,
        bestScore: finalTimeDisplay,
      },
      {
        questions: 50,
        bestScore: finalTimeDisplay,
      },
      {
        questions: 99,
        bestScore: finalTimeDisplay,
      },
    ];
    localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
  }
  bestScoreToDOM();
}

// Update Best Score Array
function updateBestScore() {
  bestScoreArray.forEach((score, index) => {
    // Selecct correct Best Score to update
    if (questionAmount == score.questions) {
      // Return  Best Score as number with one decimal
      const savedBestScore = Number(bestScoreArray[index].bestScore);
      // Update if the new final score is less or replacing zero
      if (savedBestScore === 0 || savedBestScore > finalTime) {
        bestScoreArray[index].bestScore = finalTimeDisplay;
      }
    }
  });
  // Update Splash Page
  bestScoreToDOM();
  // Save to Local Storage
  localStorage.setItem("bestScore", JSON.stringify(bestScoreArray));
}

// Reset Game
function playAgain() {
  gamePage.addEventListener("click", startTimer);
  scorePage.hidden = true;
  splashPage.hidden = false;
  equationsArray = [];
  playerGuessArray = [];
  valueY = 0;
  playAgainBtn.hidden = true;
}
// Show Score Page
function showScorePage() {
  // Show Play Again button after 1 second
  setTimeout(() => {
    playAgainBtn.hidden = false;
  }, 1000);
  gamePage.hidden = true;
  scorePage.hidden = false;
}

// Format & Display Time in DOM
function scoresToDOM() {
  finalTimeDisplay = finalTime.toFixed(1);
  baseTime = timePlayed.toFixed(1);
  penaltyTime = penaltyTime.toFixed(1);
  baseTimeEl.textContent = `Base Time: ${baseTime}s`;
  penaltyTimeEl.textContent = `Penalty: ${penaltyTime}s`;
  finalTimeEl.textContent = ` ${finalTimeDisplay}s`;
  updateBestScore();
  // Scroll to Top, go to Score Page
  itemContainer.scrollTo({ top: 0, behavior: "instant" });
  showScorePage();
}

// Stop Timer, Process Results, go t Score Page
function checkTime() {
  console.log(timePlayed);
  if (playerGuessArray.length == questionAmount) {
    console.log("player guess array:", playerGuessArray);
    clearInterval(timer);
    // Check for wrong guesses. add penalty time
    equationsArray.forEach((equation, index) => {
      if (equation.evaluated === playerGuessArray[index]) {
        // Correct guess. No panalty
      } else {
        // Incorrect Guess, Add penalty
        penaltyTime += 0.5;
      }
    });
    finalTime = timePlayed + penaltyTime;
    console.log(
      "time:",
      timePlayed,
      "penalty:",
      penaltyTime,
      "final:",
      finalTime
    );
    scoresToDOM();
  }
}

// Add a tenth of a second to timePlayed
function addTime() {
  timePlayed += 0.1;
  checkTime();
}

// Start timerwhen game page is clicked
function startTimer() {
  // Rest times
  timePlayed = 0;
  penaltyTime = 0;
  finalTime = 0;
  timer = setInterval(addTime, 100);
  gamePage.removeEventListener("click", startTimer);
}

// Scroll, Store user selection in playerGuessArray
function select(guessedTrue) {
  // Scroll 80 pixels
  valueY += 80;
  itemContainer.scroll(0, valueY);
  // Add player guess to array
  return guessedTrue ? playerGuessArray.push("true") : playerGuessArray.push("false");
}

// Displays Game Page
function showGamePage() {
  gamePage.hidden = false;
  countdownPage.hidden = true;
}

// Get Random Number up to a max number
function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

// Create Correct/Incorrect Random Equatons
function createEquations() {
  // Rendomly choose how many correct equations there should be
  const correctEquation = getRandomInt(questionAmount);
  console.log("correct equations:", correctEquation);
  // Set amout of wrong equations
  const wrongEquation = questionAmount - correctEquation;
  console.log("wrong equations:", wrongEquation);
  // Loopthrough, multiply random numbers up to 9, push to array
  for (let i = 0; i < correctEquation; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    const equation = `${firstNumber} x ${secondNumber} = ${equationValue}`;
    equationObject = { value: equation, evaluated: "true" };
    equationsArray.push(equationObject);
  }

  // Loop through, mess with the equation results, push to array
  for (let i = 0; i < wrongEquation; i++) {
    firstNumber = getRandomInt(9);
    secondNumber = getRandomInt(9);
    const equationValue = firstNumber * secondNumber;
    wrongFormat[0] = `${firstNumber} x ${secondNumber + 1} = ${equationValue}`;
    wrongFormat[1] = `${firstNumber} x ${secondNumber} = ${equationValue - 1}`;
    wrongFormat[2] = `${firstNumber + 1} x ${secondNumber} = ${equationValue}`;
    const formatChoice = getRandomInt(3);
    const equation = wrongFormat[formatChoice];
    equationObject = { value: equation, evaluated: "false" };
    equationsArray.push(equationObject);
  }
  shuffle(equationsArray);
}

function equationToDOM() {
  equationsArray.forEach((equation) => {
    // Item
    const item = document.createElement("div");
    item.classList.add("item");
    // Equation Text
    const equationText = document.createElement("h1");
    equationText.textContent = equation.value;
    // Append
    item.appendChild(equationText);
    itemContainer.appendChild(item);
  });
}

// Dynamically adding correct/incorrect equations.
function populateGamePage() {
  // Reset DOM, set Blank Space Above
  itemContainer.textContent = "";
  // Spacer
  const topSpacer = document.createElement("div");
  topSpacer.classList.add("height-240");
  // Selected Item
  const selectedItem = document.createElement("div");
  selectedItem.classList.add("selected-item");
  // Append
  itemContainer.append(topSpacer, selectedItem);

  // Create Equations, Build Elements in DOM
  createEquations();
  equationToDOM();

  // set Blank Space Below
  const bottomSpacer = document.createElement("div");
  bottomSpacer.classList.add("height-500");
  itemContainer.appendChild(bottomSpacer);
}

// Displays 3, 2, 1, GO!

function countdownSart() {
  let count = 3;
  countdown.textContent = count;
  const timeCountdown = setInterval(() => {
    count--;
    if (count === 0) {
      countdown.textContent = "GO!";
    } else if (count === -1) {
      showGamePage();
      clearInterval(timeCountdown);
    } else {
      countdown.textContent = count;
    }
  }, 1000);
  // setTimeout(() => {
  //   countdown.textContent = "2";
  // }, 1000);
  // setTimeout(() => {
  //   countdown.textContent = "1";
  // }, 2000);
  // setTimeout(() => {
  //   countdown.textContent = "GO!";
  // }, 3000);
}

// Navigate form Splash page to Countdown Page
function showCountdown() {
  countdownPage.hidden = false;
  splashPage.hidden = true;
  populateGamePage();
  countdownSart();
}

// Get the value from selected radio button
function getRadioValue() {
  let radioValue;
  radioInput.forEach((radioInput) => {
    if (radioInput.checked) {
      radioValue = radioInput.value;
    }
  });
  return radioValue;
}

// Form that decides amount of questions
function SelectQuestionAmout(e) {
  e.preventDefault();
  questionAmount = getRadioValue();
  console.log("question amount:", questionAmount);
  if (questionAmount) {
    showCountdown();
  }
}

startForm.addEventListener("click", () => {
  radioContainer.forEach((radioEl) => {
    // Remove Selected Label Styling
    radioEl.classList.remove("selected-label");
    // Add it back if radio input is checked
    if (radioEl.children[1].checked) {
      radioEl.classList.add("selected-label");
    }
  });
});

//Event Listeners
startForm.addEventListener("submit", SelectQuestionAmout);
gamePage.addEventListener("click", startTimer);

//  On Load
getSavedBestScores();
