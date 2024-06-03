let questions = [];
let currentQuestionIndex = 0;
let timer;
let answers = [];
let timeLeft = 30;
let questionStartTime;

// JSON API'den soruları çekiliyor
fetch('https://jsonplaceholder.typicode.com/posts')
    .then(response => response.json())
    .then(data => {
        questions = data.slice(0, 10);  // İlk 10 soruyu alıyorum burada
        startQuiz();
    })
    .catch(error => console.error('Error:', error));

document.getElementById('toggle-theme').addEventListener('click', toggleTheme);

function startQuiz() {
    showQuestion();
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    let question = questions[currentQuestionIndex];
    document.getElementById('question-text').textContent = `${currentQuestionIndex + 1}. ${question.title}`;
    let choices = parseChoices(question.body);
    document.getElementById('choiceA').textContent = `A. ${choices[0]}`;
    document.getElementById('choiceB').textContent = `B. ${choices[1]}`;
    document.getElementById('choiceC').textContent = `C. ${choices[2]}`;
    document.getElementById('choiceD').textContent = `D. ${choices[3]}`;
    enableChoices(false);

    document.getElementById('question-counter').textContent = `Soru ${currentQuestionIndex + 1}/${questions.length}`;

    timeLeft = 30;
    document.getElementById('timer').textContent = timeLeft;
    updateProgressBar();
    questionStartTime = new Date();
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer').textContent = timeLeft;
        updateProgressBar();
        if (timeLeft === 20) {
            enableChoices(true);
        }
        if (timeLeft === 0) {
            clearInterval(timer);
            currentQuestionIndex++;
            showQuestion();
        }
    }, 1000);
}

function updateProgressBar() {
    let progressBar = document.getElementById('progress-bar');
    let progressPercentage = (timeLeft / 30) * 100;
    progressBar.style.width = progressPercentage + '%';
}

function enableChoices(enabled) {
    document.querySelectorAll('.choice').forEach(button => {
        button.disabled = !enabled;
    });
}

function parseChoices(text) {
    let words = text.split(' ');
    let choices = [];
    for (let i = 0; i < 4; i++) {
        choices.push(words.slice(i * 5, (i + 1) * 5).join(' '));
    }
    return choices;
}

document.querySelectorAll('.choice').forEach(button => {
    button.addEventListener('click', event => {
        let answerTime = new Date();
        let responseTime = Math.round((answerTime - questionStartTime) / 1000);
        answers.push({
            questionNumber: currentQuestionIndex + 1,
            question: questions[currentQuestionIndex].title,
            answer: event.target.textContent,
            time: responseTime
        });
        clearInterval(timer);
        currentQuestionIndex++;
        showQuestion();
    });
});

function showResults() {
    document.getElementById('quiz-container').style.display = 'none';
    let resultContainer = document.getElementById('result-container');
    resultContainer.style.display = 'block';
    let tbody = resultContainer.querySelector('tbody');
    answers.forEach(answer => {
        let row = document.createElement('tr');
        let questionNumberCell = document.createElement('td');
        questionNumberCell.textContent = answer.questionNumber;
        let questionCell = document.createElement('td');
        questionCell.textContent = answer.question;
        let answerCell = document.createElement('td');
        answerCell.textContent = answer.answer;
        let timeCell = document.createElement('td');
        timeCell.textContent = answer.time;
        row.appendChild(questionNumberCell);
        row.appendChild(questionCell);
        row.appendChild(answerCell);
        row.appendChild(timeCell);
        tbody.appendChild(row);
    });
}

function toggleTheme() {
    let body = document.body;
    let card = document.getElementById('quiz-container');
    let navbar = document.querySelector('.navbar');
    let table = document.querySelector('.table-bordered');

    if (body.classList.contains('light-mode')) {
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        card.classList.add('dark-mode');
        navbar.classList.add('dark-mode');
        table.classList.add('dark-mode');
        document.getElementById('toggle-theme').textContent = '☀️';
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        card.classList.remove('dark-mode');
        navbar.classList.remove('dark-mode');
        table.classList.remove('dark-mode');
        document.getElementById('toggle-theme').textContent = '🌙';
    }
}
