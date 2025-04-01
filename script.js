let playerName = '';
let board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
let gameActive = false;
let currentPlayer = 'O'; // اللاعب يبدأ بـ O

let playerWins = 0;
let aiWins = 0;

const boardElement = document.getElementById('board');
const resultElement = document.getElementById('result-container');
const playerNameInput = document.getElementById('player-name');
const playerNameDisplay = document.getElementById('player-name-display');
const playerScoreElement = document.getElementById('player-score');
const aiScoreElement = document.getElementById('ai-score');
const resetButton = document.getElementById('reset-button');

// تحميل الصور
const xImage = "x.png"; // صورة X (الكمبيوتر)
const oImage = "o.png"; // صورة O (اللاعب)

// دالة لبدء اللعبة
function startGame() {
    playerName = playerNameInput.value.trim();
    if (playerName === '') {
        alert('من فضلك أدخل اسمك');
        return;
    }
    
    gameActive = true;
    currentPlayer = 'O';
    board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];

    document.getElementById('player-name-container').style.display = 'none';
    playerNameDisplay.textContent = playerName;
    resultElement.innerHTML = '';
    resetButton.style.display = 'none';

    boardElement.innerHTML = '';
    for (let i = 0; i < 9; i++) {
        const button = document.createElement('button');
        button.setAttribute('data-index', i);
        button.addEventListener('click', () => handleMove(i));
        boardElement.appendChild(button);
    }
}

// التعامل مع الحركة لكل لاعب
function handleMove(index) {
    if (board[index] !== ' ' || !gameActive) {
        return;
    }

    board[index] = currentPlayer;
    let button = document.querySelector(`button[data-index="${index}"]`);
    button.style.backgroundImage = `url(${currentPlayer === 'O' ? oImage : xImage})`;

    if (checkWinner()) {
        gameActive = false;
        if (currentPlayer === 'O') {
            resultElement.textContent = `مبروك! ${playerName} فزت!`;
            playerWins++;
            playerScoreElement.textContent = playerWins;
        } else {
            resultElement.textContent = `سوتر كسبت!`;
            aiWins++;
            aiScoreElement.textContent = aiWins;
        }
        resetButton.style.display = 'block';
        return;
    }

    if (!board.includes(' ')) {
        gameActive = false;
        resultElement.textContent = "تعادل!";
        resetButton.style.display = 'block';
        return;
    }

    currentPlayer = 'X';
    aiMove();
}

// ذكاء الكمبيوتر (Minimax)
function aiMove() {
    if (!gameActive) return;

    let availableMoves = board.map((v, i) => v === ' ' ? i : null).filter(v => v !== null);
    let move = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    board[move] = 'X';
    let button = document.querySelector(`button[data-index="${move}"]`);
    button.style.backgroundImage = `url(${xImage})`;

    if (checkWinner()) {
        gameActive = false;
        resultElement.textContent = 'سوتر كسبت!';
        aiWins++;
        aiScoreElement.textContent = aiWins;
        resetButton.style.display = 'block';
    } else if (!board.includes(' ')) {
        gameActive = false;
        resultElement.textContent = "تعادل!";
        resetButton.style.display = 'block';
    } else {
        currentPlayer = 'O';
    }
}
function minimax(newBoard, player) {
    let availableMoves = newBoard.map((v, i) => v === ' ' ? i : null).filter(v => v !== null);

    if (checkWin(newBoard, 'X')) return { score: 10 };
    if (checkWin(newBoard, 'O')) return { score: -10 };
    if (availableMoves.length === 0) return { score: 0 };

    let moves = [];
    
    for (let i = 0; i < availableMoves.length; i++) {
        let move = {};
        move.index = availableMoves[i];
        newBoard[availableMoves[i]] = player;

        if (player === 'X') {
            let result = minimax(newBoard, 'O');
            move.score = result.score;
        } else {
            let result = minimax(newBoard, 'X');
            move.score = result.score;
        }

        newBoard[availableMoves[i]] = ' '; 
        moves.push(move);
    }

    let bestMove;
    if (player === 'X') {
        let bestScore = -Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}

// التحقق من الفائز بناءً على الحالة الحالية للوحة
function checkWin(boardState, player) {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    return winConditions.some(condition => 
        condition.every(index => boardState[index] === player)
    );
}
// التحقق من الفائز
function checkWinner() {
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]             
    ];

    for (let condition of winConditions) {
        const [a, b, c] = condition;
        if (board[a] !== ' ' && board[a] === board[b] && board[a] === board[c]) {
            return true;
        }
    }
    return false;
}

// دالة إعادة التشغيل
function resetGame() {
    startGame();
}
