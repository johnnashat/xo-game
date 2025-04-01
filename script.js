let board = Array(9).fill(null);
let player = 'O';
let computer = 'X';
let computerScore = 0;
let playerScore = 0;
let playerName = "";

function startGame() {
    playerName = document.getElementById("playerName").value || "Player";
    document.getElementById("playerNameDisplay").textContent = `اللاعب: ${playerName}`;
    document.getElementById("board").innerHTML = '';
    board.fill(null);
    document.getElementById("result").textContent = '';
    for (let i = 0; i < 9; i++) {
        let cell = document.createElement("div");
        cell.classList.add("cell");
        cell.dataset.index = i;
        cell.onclick = () => playerMove(i);
        document.getElementById("board").appendChild(cell);
    }
}

function playerMove(index) {
    if (board[index] || checkWinner()) return;
    board[index] = player;
    updateBoard();
    if (!checkWinner()) computerMove();
}

function computerMove() {
    let bestMove = minimax(board, computer).index;
    if (bestMove !== undefined) {
        board[bestMove] = computer;
        updateBoard();
    }
}

function updateBoard() {
    document.querySelectorAll(".cell").forEach((cell, index) => {
        if (board[index] === 'X') cell.style.backgroundImage = "url('x.png')";
        else if (board[index] === 'O') cell.style.backgroundImage = "url('o.png')";
    });
    let winner = checkWinner();
    if (winner) {
        if (winner === 'X') {
            document.getElementById("result").textContent = "سوتر كسبت!";
            computerScore++;
        } else if (winner === 'O') {
            document.getElementById("result").textContent = `${playerName} كسب!`;
            playerScore++;
        } else {
            document.getElementById("result").textContent = "تعادل!";
        }
        document.getElementById("computerScore").textContent = computerScore;
        document.getElementById("playerScore").textContent = playerScore;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];
    for (let pattern of winPatterns) {
        let [a, b, c] = pattern;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : 'Draw';
}

function minimax(newBoard, player) {
    let emptyCells = newBoard.map((v, i) => v === null ? i : null).filter(v => v !== null);
    
    // التحقق من وجود فائز
    if (checkWinner() === 'X') return { score: 10 };
    if (checkWinner() === 'O') return { score: -10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i of emptyCells) {
        let move = { index: i };
        newBoard[i] = player;
        
        // في هنا هنضيف جزء من العشوائية
        let score = (player === computer) 
            ? minimax(newBoard, 'O').score 
            : minimax(newBoard, 'X').score;

        // لو الكمبيوتر، هنقلل من الدقة عن طريق إضافة نسبة عشوائية
        if (player === computer) {
            score += Math.random() * 2 - 1;  // إضافة عشوائية صغيرة بين -1 و 1
        }

        newBoard[i] = null;
        move.score = score;
        moves.push(move);
    }

    // إعادة الخيار الأفضل للكمبيوتر مع تعديله ليكون أقل دقة
    return moves.reduce((best, move) =>
        (player === computer ? move.score > best.score : move.score < best.score)
        ? move : best,
        { score: player === computer ? -Infinity : Infinity }
    );
}
