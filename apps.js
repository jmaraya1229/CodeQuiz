const startButton = document.getElementById('start-btn');
const questionContainerEl = document.getElementById('questionContainer')
var shuffleQuestions, currentQuestionIndex
const questionEl = document.getElementById('question')
const answerButtonsEl = document.getElementById('answer-btn')
var answerValidation = document.getElementById('correction')
const submitPage = document.getElementById('submit')
const scorePage = document.getElementById('highscores')
const submitButton = document.getElementById('submitName')
const restartButton = document.getElementById('restart')
const clearButton = document.getElementById('clear')
const viewScores = document.getElementById('viewScores')

// On click, game starts
startButton.addEventListener('click', startGame);

// On click, submit button leads to final score page
submitButton.addEventListener('click', finalPage) ;

// On click, view scores button stops timer and leads user to score page
viewScores.addEventListener('click', finalPage);
viewScores.addEventListener('click', setNull);

// Restarts game and hides score page
restartButton.addEventListener('click', refreshPage);

// On click, clears score
clearButton.addEventListener('click', clearScores);

// Hides start button, reveals first randomized question
function startGame() {
    startButton.classList.add('hide');
    questionContainerEl.classList.remove('hide');
    shuffleQuestions = myQuestions.sort(() => Math.random() -.5);
    currentQuestionIndex = 0;
    nextQuestion();
    startTimer();
}

// Resets board and loads next question
function nextQuestion() {
    resetState();
    showQuestion(shuffleQuestions[currentQuestionIndex]);
}

// Pulls from question list and listens to when the user clicks an answer
function showQuestion(question) {
    questionEl.innerText = question.question;
    question.answers.forEach(answer => {
        const button = document.createElement('button');
        button.innerText = answer.text;
        button.classList.add('btn');
        if (answer.correct) {
            button.dataset.correct = answer.correct;
        }
        button.addEventListener('click', selectAnswer);
        answerButtonsEl.appendChild(button);
    })
}

// Clears previous answer choices
function resetState () {
    while (answerButtonsEl.firstChild) {
        answerButtonsEl.removeChild(answerButtonsEl.firstChild);
    }
} 

// Differentiates which answer choice user selected
function selectAnswer(e) {
    const selectedButton = e.target;
    const correct = selectedButton.dataset.correct;
    setStatusClass(document.body, correct);
    Array.from(answerButtonsEl.children).forEach(button => {
        setStatusClass(button, correct)})
    next();
}

// Determines right and wrong answers and adds applicable text
function setStatusClass(element, correct) {
    clearStatusClass(element);
    if (correct) {
        element.classList.add('correct');
        answerValidation.innerText = 'Correct!';
    } else {
        element.classList.add('wrong');
        answerValidation.innerText = 'Wrong!';
        subtractTime();
    }
    setTimeout(function(){answerValidation.innerText = ""}, 2000);
}

// clears last correct/wrong
function clearStatusClass (element) {
    element.classList.remove('correct');
    element.classList.remove('wrong');
}

// moves to the next question
function next() {
    currentQuestionIndex++;
    if (currentQuestionIndex <= 3) {
        nextQuestion();
    }else if (currentQuestionIndex == 4) {
        submition();
    }
}

// End page where user adds initials to score
function submition() {
    questionContainerEl.classList.add('hide');
    answerValidation.classList.add('hide');
    submitPage.classList.remove('hide');
}

// Final score page
function finalPage() {
    submitPage.classList.add('hide');
    startButton.classList.add('hide');
    questionEl.classList.add('hide');
    answerButtonsEl.classList.add('hide');
    scorePage.classList.remove('hide');
    var form = document.getElementById("submit");
    function handleForm(event) {
        event.preventDefault();
    } 
    form.addEventListener('submit', handleForm);
}   

// Function used to stop timer
function setNull() {
    timeLeft = null;
}

// To restart game
function refreshPage() {
    window.location.reload();
} 

// Question list
const myQuestions = [
    {
        question: "What does HTML do?",
        answers: [
            {text: "a. Defines the content of web pages", correct: true}, 
            {text: "b. Specifies the layout of web pages", correct: false},
            {text: "c: Programs the behavior of web pages", correct: false},
            {text: "d: Applies a set of functions that allow applications to access data", correct: false},
        ],
    },
    {
        question: "Commonly used data types DO NOT include:",
        answers:[
            {text: "a. strings", correct: false},
            {text: "b. boolean", correct: false},
            {text: "c: alerts", correct: true},
            {text: "d: numbers", correct: false},
        ],
    },
    {
        question: "Arrays in Javascript can be used to store:",
        answers:[
            {text: "a. quotes", correct: false},
            {text: "b: other arrays", correct: false},
            {text: "c: booleans", correct: false},
            {text: "d: all of the above", correct: true},
        ],
    },  
    {
        question: "The condition of an if/else statement is enclosed by:",
        answers:[
            {text: "a: quotes", correct: false},
            {text: "b: curly brackets", correct: true},
            {text: "c: parenthesis", correct: false},
            {text: "d: square brackets", correct: false},
        ],
    },
]


var initialsInput = document.querySelector("#initials");
var submitForm = document.querySelector("#submit");
var scoreList = document.querySelector("#score-list");
var scores = [];

function renderScores() {
  scoreList.innerHTML = "";
  for (var i = 0; i < scores.length; i++) {
    var todo = scores[i];
    var li = document.createElement("li");
    li.textContent = todo;
    li.setAttribute("data-index", i);
    scoreList.appendChild(li);
  }
}

function init() {
  var storedScores = JSON.parse(localStorage.getItem("scores"));
  if (storedScores !== null) {
    scores = storedScores;
  }
  renderScores();
}

function storeScores() {
  localStorage.setItem("scores", JSON.stringify(scores));
}+

submitForm.addEventListener("submit", function(event) {
  event.preventDefault();

  var initialText = (initialsInput.value.trim() + " - " + timeLeft);

  if (initialText === "") {
    return;
  }

  scores.push(initialText);
  initialsInput.value = "";

  storeScores();
  renderScores();
});

function clearScores() {
    localStorage.clear();
    scores = [];
    storeScores();
    renderScores();
}

init();

var timeLeft = 20;
function startTimer() {

    var downloadTimer = setInterval(function() {
    if (timeLeft == null) {
        document.getElementById("timerScore").innerHTML = "Finished";
        return;
    }        
    else if(timeLeft <= 0){
        clearInterval(downloadTimer);
        document.getElementById("timerScore").innerHTML = "Finished";
        timeLeft = 0;
        localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
        submition();
        return
    } else if ((currentQuestionIndex == 4) && (timeLeft > 0)) {
        clearInterval(downloadTimer);
        document.getElementById("timerScore").innerHTML = "Finished";
        localStorage.setItem("timeLeft", JSON.stringify(timeLeft));
        return
    } else {
        document.getElementById("timerScore").innerHTML = timeLeft + " seconds remaining";
    }
    timeLeft -= 1;
    }, 1000);
}

function subtractTime() {
    timeLeft -= 1;
}



