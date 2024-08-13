document.addEventListener('DOMContentLoaded', () => {
    let selectedCell = null; // Variable to keep track of the currently selected cell

    // Function to handle cell clicks
    function handleCellClick(event) {
        // Remove highlight from the previously selected cell if any
        if (selectedCell) {
            selectedCell.style.backgroundColor = ''; // Revert to original background
        }

        // Highlight the newly selected cell
        event.target.style.backgroundColor = 'lightblue';
        
        // Update the selectedCell reference
        selectedCell = event.target;
    }

    // Function to handle number button clicks
    function handleNumberClick(event) {
        if (selectedCell) {
            const num = parseInt(event.target.textContent);
            const row = Math.floor(selectedCell.id / 9);
            const col = selectedCell.id % 9;
            
            if (isValid(num, row, col)) {
                selectedCell.textContent = num;
            } else {
                alert('Invalid number for this cell!');
            }
        }
    }

    // Check if the number is valid in the given row
    function isValidInRow(num, row) {
        for (let col = 0; col < 9; col++) {
            if (document.querySelector(`#sudoku-board td[id="${row * 9 + col}"]`).textContent == num) {
                return false;
            }
        }
        return true;
    }

    // Check if the number is valid in the given column
    function isValidInCol(num, col) {
        for (let row = 0; row < 9; row++) {
            if (document.querySelector(`#sudoku-board td[id="${row * 9 + col}"]`).textContent == num) {
                return false;
            }
        }
        return true;
    }

    // Check if the number is valid in the 3x3 subgrid
    function isValidInBox(num, row, col) {
        const startRow = row - row % 3;
        const startCol = col - col % 3;
        for (let r = startRow; r < startRow + 3; r++) {
            for (let c = startCol; c < startCol + 3; c++) {
                if (document.querySelector(`#sudoku-board td[id="${r * 9 + c}"]`).textContent == num) {
                    return false;
                }
            }
        }
        return true;
    }

    // Check if a number can be placed in the cell
    function isValid(num, row, col) {
        return isValidInRow(num, row) &&
               isValidInCol(num, col) &&
               isValidInBox(num, row, col);
    }

    // Select all <td> elements inside the sudoku-board table
    const cells = document.querySelectorAll('#sudoku-board td');
    const numberButtons = document.querySelectorAll('.numbers .number');

    // Add event listeners to all cells
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    // Add event listeners to all number buttons
    numberButtons.forEach(button => {
        button.addEventListener('click', handleNumberClick);
    });

    document.addEventListener('click', (event) => {
        if (!event.target.closest('#sudoku-board')) {
            // Clicked outside the Sudoku board, remove highlight from any selected cell
            if (selectedCell) {
                selectedCell.style.backgroundColor = ''; // Revert to original background
                selectedCell = null; // Clear the selectedCell reference
            }
        }
    });
});

function getSudokuGrid() {
    const grid = [];
    const cells = document.querySelectorAll('#sudoku-board td');
    cells.forEach(cell => {
        const value = cell.textContent.trim();
        grid.push(value === '' ? 0 : parseInt(value));
    });
    return grid;
}

// Helper function to set the Sudoku grid in the table
function setSudokuGrid(grid) {
    const cells = document.querySelectorAll('#sudoku-board td');
    grid.forEach((value, index) => {
        cells[index].textContent = value === 0 ? '' : value;
    });
}

function resetSudokuGrid() {
    const cells = document.querySelectorAll('#sudoku-board td');
    for(let index = 0; index < cells.length; index++) {
        cells[index].textContent =  '' ;
    };
}

// Check if the number is valid in the given row
function isValidInRow(grid, row, num) {
    for (let col = 0; col < 9; col++) {
        if (grid[row * 9 + col] === num) {
            return false;
        }
    }
    return true;
}

// Check if the number is valid in the given column
function isValidInCol(grid, col, num) {
    for (let row = 0; row < 9; row++) {
        if (grid[row * 9 + col] === num) {
            return false;
        }
    }
    return true;
}

// Check if the number is valid in the 3x3 subgrid
function isValidInBox(grid, row, col, num) {
    const startRow = row - row % 3;
    const startCol = col - col % 3;
    for (let r = startRow; r < startRow + 3; r++) {
        for (let c = startCol; c < startCol + 3; c++) {
            if (grid[r * 9 + c] === num) {
                return false;
            }
        }
    }
    return true;
}

// Check if a number can be placed in the cell
function isValid(grid, row, col, num) {
    return isValidInRow(grid, row, num) &&
           isValidInCol(grid, col, num) &&
           isValidInBox(grid, row, col, num);
}

// Find an empty cell (represented by 0)
function findEmptyCell(grid) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (grid[row * 9 + col] === 0) {
                return { row, col };
            }
        }
    }
    return null; // No empty cells found
}

// Backtracking Sudoku solver
function solve(grid) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) {
        return true; // Puzzle solved
    }

    const { row, col } = emptyCell;

    for (let num = 1; num <= 9; num++) {
        if (isValid(grid, row, col, num)) {
            grid[row * 9 + col] = num;

            if (solve(grid)) {
                return true;
            }

            // Undo the move
            grid[row * 9 + col] = 0;
        }
    }
    return false;
}

// Function to solve the Sudoku puzzle
function solveSudoku() {
    const grid = getSudokuGrid();
    if (solve(grid)) {
        setSudokuGrid(grid);
    } else {
        alert('No solution exists');
    }
}

