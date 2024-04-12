/*

*/

const GameBoard = (function () {
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

    const getBoard = () => board;

    const printBoard = () => {
        console.log(board);
    };

    return { getBoard, printBoard }
}) ();