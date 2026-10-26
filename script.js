
const questions = [
    {
        question: "What is the output of console.log(typeof null)?",
        options: ["null", "undefined", "object", "number"],
        answer: 2
    },
    {
        question: "What will console.log(2 + '2' - 1) output?",
        options: ["3", "21", "221", "NaN"],
        answer: 1
    },
    {
        question: "Which method creates a new array by transforming every element?",
        options: ["filter()", "map()", "find()", "forEach()"],
        answer: 1
    },
    {
        question: "What is the output of console.log(0.1 + 0.2 === 0.3)?",
        options: ["true", "false", "undefined", "Error"],
        answer: 1
    },
    {
        question: "Which keyword prevents reassignment of a variable?",
        options: ["let", "var", "const", "static"],
        answer: 2
    },
    {
        question: "What does Promise.all() do?",
        options: [
            "Runs promises one by one",
            "Waits for all promises to fulfill, or rejects if one rejects",
            "Converts promises into callbacks",
            "Cancels all promises"
        ],
        answer: 1
    },
    {
        question: "Which function runs after the current synchronous code finishes?",
        options: [
            "A Promise.then() callback",
            "The current function immediately",
            "A variable declaration",
            "A return statement"
        ],
        answer: 0
    },
    {
        question: "What is a closure in JavaScript?",
        options: [
            "A loop that never ends",
            "A function that remembers its outer lexical scope",
            "A method that closes a browser tab",
            "An object without properties"
        ],
        answer: 1
    },
    {
        question: "What does document.querySelector('.box') return?",
        options: [
            "All matching elements",
            "The first matching element",
            "An array of elements",
            "Only elements with an ID"
        ],
        answer: 1
    },
    {
        question: "What is the output of Boolean('false')?",
        options: ["false", "true", "undefined", "Error"],
        answer: 1
    },
    {
        question: "Which array method returns a new array containing elements that pass a test?",
        options: ["reduce()", "filter()", "push()", "includes()"],
        answer: 1
    },
    {
        question: "What is the main purpose of event.preventDefault()?",
        options: [
            "Stop all JavaScript execution",
            "Remove an event listener",
            "Prevent the browser's default action",
            "Stop a loop"
        ],
        answer: 2
    },
    {
        question: "What does the spread syntax [...arr] commonly create?",
        options: [
            "A shallow copy of an array",
            "A deep copy of every nested object",
            "A string",
            "A Promise"
        ],
        answer: 0
    },
    {
        question: "What is the output of console.log(typeof NaN)?",
        options: ["NaN", "undefined", "number", "object"],
        answer: 2
    },
    {
        question: "What is the result of [] === []?",
        options: ["true", "false", "undefined", "Error"],
        answer: 1
    }
];
const startScreen = document.getElementById("startScreen");
const quizScreen = document.getElementById("quizScreen");
const resultScreen = document.getElementById("resultScreen");

const startBtn = document.getElementById("startBtn");
const nextBtn = document.getElementById("nextBtn");
const restartBtn = document.getElementById("restartBtn");
const themeBtn = document.getElementById("themeBtn");

const questionNumber = document.getElementById("questionNumber");
const scoreText = document.getElementById("scoreText");
const progressBar = document.getElementById("progressBar");
const questionText = document.getElementById("questionText");
const optionsContainer = document.getElementById("optionsContainer");
const feedback = document.getElementById("feedback");

const resultTitle = document.getElementById("resultTitle");
const resultScore = document.getElementById("resultScore");
const resultMessage = document.getElementById("resultMessage");
const reviewContainer = document.getElementById("reviewContainer");
const bestScoreText = document.getElementById("bestScore");

let currentIndex = 0;
let score = 0;
let selected = false;
let userAnswers = [];
let currentQuestions = [];
// Restore the saved theme
if (localStorage.getItem("quizTheme") === "dark") {
    document.body.classList.add("dark");
}

updateThemeButton();

// Switch between light and dark mode
themeBtn.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    const theme = document.body.classList.contains("dark")
        ? "dark"
        : "light";

    localStorage.setItem("quizTheme", theme);
    updateThemeButton();
});

function updateThemeButton() {
    const isDark = document.body.classList.contains("dark");

    themeBtn.textContent = isDark
        ? "☀️ Light Mode"
        : "🌙 Dark Mode";
}

// Display the saved best score
function showBestScore() {
    const best = localStorage.getItem("quizBestScore");

    bestScoreText.textContent = best === null
        ? "Best score: Not attempted yet"
        : `Best score: ${best}/10`;
}

function startQuiz() {
    currentIndex = 0;
    score = 0;
    selected = false;
    userAnswers = [];

    // Shuffle all questions randomly
    const shuffledQuestions = [...questions];

    for (let i = shuffledQuestions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [shuffledQuestions[i], shuffledQuestions[j]] =
            [shuffledQuestions[j], shuffledQuestions[i]];
    }

    // Select 10 random questions for this attempt
    currentQuestions = shuffledQuestions.slice(0, 10);

    startScreen.classList.add("hidden");
    resultScreen.classList.add("hidden");
    quizScreen.classList.remove("hidden");

    showQuestion();
}

function showQuestion() {
    selected = false;

  const currentQuestion = currentQuestions[currentIndex];

    questionNumber.textContent =
        `Question ${currentIndex + 1} of ${questions.length}`;

    scoreText.textContent = `Score: ${score}`;

    progressBar.style.width =
        `${((currentIndex + 1) / questions.length) * 100}%`;

    questionText.textContent = currentQuestion.question;
    optionsContainer.innerHTML = "";
    feedback.textContent = "";
    nextBtn.disabled = true;

    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement("button");

        button.className = "option-btn";
        button.textContent = `${String.fromCharCode(65 + index)}. ${option}`;

        button.addEventListener("click", () => {
            checkAnswer(index);
        });

        optionsContainer.appendChild(button);
    });

    nextBtn.textContent =
        currentIndex === questions.length - 1
            ? "See Results →"
            : "Next Question →";
}

function checkAnswer(selectedIndex) {
    if (selected) return;

    selected = true;

    const currentQuestion = questions[currentIndex];
    const buttons = optionsContainer.querySelectorAll(".option-btn");
    const isCorrect = selectedIndex === currentQuestion.answer;

    userAnswers.push(selectedIndex);

    if (isCorrect) {
        score++;
        feedback.textContent = "Correct! Well done.";
        feedback.style.color = "var(--correct)";
    } else {
        feedback.textContent =
            `Incorrect. Correct answer: ${currentQuestion.options[currentQuestion.answer]}`;
        feedback.style.color = "var(--wrong)";
    }

    buttons.forEach((button, index) => {
        button.disabled = true;

        if (index === currentQuestion.answer) {
            button.classList.add("correct");
        } else if (index === selectedIndex) {
            button.classList.add("wrong");
        }
    });

    scoreText.textContent = `Score: ${score}`;
    nextBtn.disabled = false;
}

function nextQuestion() {
    if (!selected) return;

    if (currentIndex < questions.length - 1) {
        currentIndex++;
        showQuestion();
    } else {
        showResults();
    }
}

function showResults() {
    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    const percentage = Math.round((score / questions.length) * 100);

    resultTitle.textContent = score >= 7
        ? "Great job!"
        : "Keep practising!";

    resultScore.textContent =
        `You scored ${score}/${questions.length} (${percentage}%).`;

    resultMessage.textContent = score >= 7
        ? "Excellent work. Keep learning and improving!"
        : "Review your answers and try the quiz again.";

    const previousBest = Number(
        localStorage.getItem("quizBestScore") || 0
    );

    if (score > previousBest || localStorage.getItem("quizBestScore") === null) {
        localStorage.setItem("quizBestScore", score);
    }

    showBestScore();

    reviewContainer.innerHTML = "";

    questions.forEach((question, index) => {
        const item = document.createElement("div");
        item.className = "review-item";

        const heading = document.createElement("h3");
        heading.textContent = `${index + 1}. ${question.question}`;

        const yourAnswer = document.createElement("p");
        const answerIndex = userAnswers[index];

        yourAnswer.textContent =
            `Your answer: ${question.options[answerIndex]}`;

        yourAnswer.style.color = answerIndex === question.answer
            ? "var(--correct)"
            : "var(--wrong)";

        const correctAnswer = document.createElement("p");
        correctAnswer.textContent =
            `Correct answer: ${question.options[question.answer]}`;

        item.append(heading, yourAnswer, correctAnswer);
        reviewContainer.appendChild(item);
    });
}

startBtn.addEventListener("click", startQuiz);
nextBtn.addEventListener("click", nextQuestion);
restartBtn.addEventListener("click", startQuiz);

showBestScore();