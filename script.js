/* 
TODO:
1. Create an object to store player information like: name, symbol, total score.
2. Create a function allow player to place their symbol on the board. Input are:
   player name, selected row and colum.
3. Create a function print aout the gameboard with recent change (like when player
   just place one of their symbol).
4. Create a function that switch player's turn when current player has already placed
   their symbol.
5. Create a factory function to keep track of each cell on the gameboard (which cell
   has symbol of which player on and which cell hasn't).
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

function createPlayer (name, symbol) {
    const playerName = "Player " + name;

    return { name, playerName }
}