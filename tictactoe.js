// Select the relevant elements
const gameModeButtons = document.querySelectorAll('.game-mode button');
const ticTacToeBoard = document.getElementById('tic-tac-toe-board');
const resetButton = document.getElementById('reset');

// Function to show the Tic-Tac-Toe board
function showBoard() {
    ticTacToeBoard.style.display = 'block';
}

// Function to hide the Tic-Tac-Toe board
function hideBoard() {
    ticTacToeBoard.style.display = 'none';
}

// Add event listeners to game mode buttons
gameModeButtons.forEach(button => {
    button.addEventListener('click', () => {
        showBoard();
    });
});

// Add event listener to reset button
resetButton.addEventListener('click', () => {
    hideBoard();
});
// Select relevant elements
const cells = document.querySelectorAll('.cell');
const gameStatus = document.querySelector('.game--status');

let currentPlayer = 'X'; // Start with player X

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
// Function to handle cell click
function handleCellClick(event) {
    const cell = event.target;
    // Check if the cell is already filled or the game has ended
    if (cell.textContent !== '' || gameStatus.textContent.indexOf("wins")!=-1 ) return;

    cell.textContent = currentPlayer; // Mark the cell with the current player's symbol
    
    if (checkWinner()) {
        return; // Stop further actions if there's a winner
    }
    
    // Switch player if no winner yet
    currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    gameStatus.textContent = `Player ${currentPlayer}'s turn`;
}

// Attach click event to each cell
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Function to reset the game
function resetGame() {
    cells.forEach(cell => {
        cell.textContent = ''; // Clear cell content
        cell.classList.remove('winner'); // Remove winner highlights
    });
    currentPlayer = 'X'; // Reset to player X
    gameStatus.textContent = `Player ${currentPlayer}'s turn`; // Reset status
}

// Attach click event to the reset button
resetButton.addEventListener('click', resetGame);

// Initialize game status
gameStatus.textContent = `Player ${currentPlayer}'s turn`;
