let score;
let timeRemaining;
let currentDifficulty;
let timerInterval;
let currentQuestion;
let timeBonus;

function startGame(difficulty) {
    currentDifficulty = difficulty;
    score = 100;
    timeRemaining = difficulty === 'easy' ? 30 : difficulty === 'medium' ? 20 : 10;
    timeBonus = difficulty === 'easy' ? 14 : difficulty === 'medium' ? 8 : 5;

    document.getElementById('score-value').textContent = score;
    document.getElementById('time').textContent = timeRemaining;

    startTimer();
    generateQuestion();
}

function startTimer() {
    clearInterval(timerInterval);
    timerInterval = setInterval(function() {
        if (timeRemaining > 0) {
            timeRemaining--;
            document.getElementById('time').textContent = timeRemaining;
        } else {
            clearInterval(timerInterval);
            endGame('خسرت! انتهى الوقت.');
        }
    }, 1000);
}

function generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = getRandomOperation();
    const answer = calculateAnswer(num1, num2, operation);

    currentQuestion = { num1, num2, operation, answer };
    document.getElementById('question').textContent = `${num1} ${operation} ${num2} = ?`;
}

function getRandomOperation() {
    if (currentDifficulty === 'easy') {
        return Math.random() < 0.5 ? '+' : '-';
    } else if (currentDifficulty === 'medium') {
        return ['+', '-', '*'][Math.floor(Math.random() * 3)];
    } else {
        return ['+', '-', '*', '/'][Math.floor(Math.random() * 4)];
    }
}

function calculateAnswer(num1, num2, operation) {
    if (operation === '+') return num1 + num2;
    if (operation === '-') return num1 - num2;
    if (operation === '*') return num1 * num2;
    if (operation === '/') return (num1 / num2).toFixed(2); // نتائج القسمة بدقة
}

function checkAnswer() {
    const userAnswer = parseFloat(document.getElementById('answer').value);
    if (userAnswer === parseFloat(currentQuestion.answer)) {
        score += 10;
        timeRemaining += timeBonus;
        document.getElementById('score-value').textContent = score;
        document.getElementById('time').textContent = timeRemaining;
        generateQuestion();
    } else {
        score -= 10;
        document.getElementById('score-value').textContent = score;
        if (score <= 0) {
            endGame('خسرت! نفدت النقاط.');
        }
    }
    document.getElementById('answer').value = '';
}

function endGame(message) {
    clearInterval(timerInterval);
    alert(message);
    window.location.href = 'index.html'; // العودة للصفحة الرئيسية
}
