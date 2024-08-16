// Select the relevant elements
const gameModeButtons = document.querySelectorAll('.game-mode button');
const ticTacToeBoard = document.getElementById('tic-tac-toe-board');
const resetButton = document.getElementById('reset');
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.game--status');
let currentPlayer = 'X'; // Start with player X
const AIPlayer = 'O'; // AI is 'O'
let opponentPlayer = 'X';
let moveIndex = 0;
let boardState = [['', '', ''], ['', '', ''], ['', '', '']];
// Function to show the Tic-Tac-Toe board
function showBoard() {
    ticTacToeBoard.style.display = 'block';
}

// Function to hide the Tic-Tac-Toe board
function hideBoard() {
    ticTacToeBoard.style.display = 'none';
}

// Add event listeners to game mode buttons
gameModeButtons[0].addEventListener('click', () => {
    showBoard();
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
});
gameModeButtons[1].addEventListener('click', () => {
    showBoard();
    cells.forEach(cell => cell.addEventListener('click', handleCellClickAI));
});

// Add event listener to reset button
resetButton.addEventListener('click', () => {
    resetGame();
    hideBoard();
    //remove all event listeners
    cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    cells.forEach(cell => cell.removeEventListener('click', handleCellClickAI));
    // Reset board state
    boardState = [['', '', ''], ['', '', ''], ['', '', '']];
});
// Function to check for a winner
function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            gameStatus.textContent = `Player ${cells[a].textContent} wins!`;
            cells[a].classList.add('winner');
            cells[b].classList.add('winner');
            cells[c].classList.add('winner');
            return true;
        }
    }

    // Check for a tie
    if ([...cells].every(cell => cell.textContent)) {
        gameStatus.textContent = "It's a tie!";
        return true;
    }

    return false;
}
function evaluateBoard() {
    for (let row = 0; row < 3; row++) {
        if (boardState[row][0] == boardState[row][1] && boardState[row][1] == boardState[row][2]) {
            if (boardState[row][0] == 'O') return +10;
            if (boardState[row][0] == 'X') return -10;
        }
    }

    for (let col = 0; col < 3; col++) {
        if (boardState[0][col] == boardState[1][col] && boardState[1][col] == boardState[2][col]) {
            if (boardState[0][col] == 'O') return +10;
            if (boardState[0][col] == 'X') return -10;
        }
    }

    if (boardState[0][0] == boardState[1][1] && boardState[1][1] == boardState[2][2]) {
        if (boardState[0][0] == 'O') return +10;
        if (boardState[0][0] == 'X') return -10;
    }

    if (boardState[0][2] == boardState[1][1] && boardState[1][1] == boardState[2][0]) {
        if (boardState[0][2] == 'O') return +10;
        if (boardState[0][2] == 'X') return -10;
    }

    return 0;
}
function isgameover() {
    let score = evaluateBoard();
    if (score === 10 || score === -10) return true;

    // Check for tie (no empty spaces)
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (boardState[i][j] === '') return false;
        }
    }

    return true;
}
// Function to handle cell click multiplayer
function handleCellClick(event) {
    const cell = event.target;
    // Check if the cell is already filled or the game has ended
    if (cell.textContent !== '' || gameStatus.textContent.indexOf("wins") != -1) return;

    cell.textContent = currentPlayer; // Mark the cell with the current player's symbol

    if (checkWinner()) {
        return; // Stop further actions if there's a winner
    }

    // Switch player if no winner yet
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}
// Helper function to wrap setTimeout in a Promise
function waitFor(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
async function performMove() {
    console.log("Wait");
    await waitFor(3000);
    // Execute AI move
    makeAIMove();
    // Check for a winner after AI's move
    if (!checkWinner()) {
        // Switch back to player if AI hasn't won or tied
        currentPlayer = 'X';
        gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    }
}

// Function to handle cell click
function handleCellClickAI(event) {
    const cell = event.target;
    // Ignore if the cell is already filled or game is over
    if (cell.textContent !== '' || gameStatus.textContent.includes("wins") || gameStatus.textContent === "It's a tie!") return;

    // Player's move
    cell.textContent = currentPlayer;
    let cellIndex = [...cells].indexOf(cell);
    let x = Math.floor(cellIndex / 3);
    let y = cellIndex % 3;
    boardState[x][y] = currentPlayer;
    moveIndex++;
    boardstate();
    if (checkWinner()) return;

    // Switch player to AI
    currentPlayer = AIPlayer;
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
    performMove();
}
// Function to make AI move
function makeAIMove(mi) {
    let bestMoveIndex = bestMove(mi);
    let x = Math.floor(bestMoveIndex / 3);
    let y = bestMoveIndex % 3;
    cells[bestMoveIndex].textContent = AIPlayer;
    boardState[x][y] = AIPlayer;
    boardstate();
    moveIndex++;
}
function boardstate(){
    console.log(boardState[0]);
    console.log(boardState[1]);
    console.log(boardState[2]);
}
function minimax(depth, isAi) {
    let score = evaluateBoard(), bestScore = 0;
    if(score===10 || score===-10) return score;

    if (isgameover()) {
        return 0;
    }
    
        if (isAi) {
            bestScore = -1000;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (boardState[i][j] === '') {
                        boardState[i][j] = AIPlayer;
                        let cscore = minimax(depth + 1, false);
                        boardState[i][j] = '';
                        bestScore = Math.max(cscore, bestScore);
                    }
                }
            }
            return bestScore;
        }
        else {
            bestScore = 1000;
            for (let i = 0; i < 3; i++) {
                for (let j = 0; j < 3; j++) {
                    if (boardState[i][j] === '') {
                        boardState[i][j] = opponentPlayer;
                        let cscore = minimax(depth + 1, true);
                        boardState[i][j] = '';
                        bestScore = Math.min(cscore, bestScore);
                    }
                }
            }
            return bestScore;
        }
}
function bestMove(moveIndex) {
    let x = -1, y = -1;
    let bestScore = -1000;
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (boardState[i][j] === '') {
                boardState[i][j] = AIPlayer;
                let score = minimax(moveIndex + 1, false);
                boardState[i][j] = '';
                if (score > bestScore) {
                    bestScore = score;
                    x = i;
                    y = j;
                }
            }
        }
    }
    return x * 3 + y;
}
// Function to reset the game
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = ''; // Clear cell content
        cell.classList.remove('winner'); // Remove winner highlights
    });
    currentPlayer = 'X'; // Reset to player X
    gameStatus.textContent = `Player ${currentPlayer}'s turn`; // Reset status
}
// Initialize game status
gameStatus.textContent = `Player ${currentPlayer}'s turn`;
