/*
- I need a GameBoard factory function that can be use
to create one instance of the gameboard.
- The board has 3 row and 3 column.
- Each row and column will be store in a 2d array.
- I can use for loop for row to loop through each row 
and column, then store them in an array.
- Create a print function to print out the board to console.
*/

function GameBoard() {
    const rows = 3;
    const columns = 3;
    let board = [];

    for (let i = 0; i < rows; i++) {
        // For each row, asign an empty array
        // that represent a column.
        board[i] = [];
        for (let j = 0; j < columns; j++) {
            // For each column in a row, asign
            // an X symbol to that column.
            board[i].push("X");
        }
    }

    const printBoard = () => {
        console.log(board);
    };

    return { board, printBoard }
}