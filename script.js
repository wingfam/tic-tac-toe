/*
** Create an object to store player information like:
** name, symbol
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

    return { getBoard }
}) ();

function createPlayer (name) {
    const playerName = "Player " + name;

    return { name, playerName }
}