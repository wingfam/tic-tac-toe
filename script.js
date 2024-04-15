/* 
TODO:
1. [X] Create an object to store player information like: name, symbol, total score.
2. [X] Create a function allow player to place their symbol on the board. Input are:
   player name, selected row and colum.
3. [X] Create a function print aout the gameboard with recent change (like when player
   just place one of their symbol).
4. [X] Create a function that switch player's turn.
5. [X] Create a factory function to keep track of each cell on the gameboard (which cell
   has symbol of which player on and which cell hasn't).
6. [] Create a GameController factory function that responsible for controlling the 
   flow and state of the game's turn.
7. [] Implement a win condition after 3 round that check each player total score, 
   then give a winning message to whoever has the highest score. 
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
            // For each column in a row, add
            // a cell to that column.
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const placeSymbol = (playerSymbol, row, column) => {
        board[row][column].addSymbol(playerSymbol);
    };

    const printBoard = () => {
        const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()));
        console.log(boardWithCellValues);
    }

    return { getBoard, placeSymbol, printBoard }
})();

function Cell() {
    let value = " ";

    const addSymbol = (playerSymbol) => {
        value = value.replace(value, playerSymbol);
    }

    const getValue = () => value;

    return { addSymbol, getValue }
}

function createPlayer(name, symbol) {
    let score = 0;
    const getScore = () => score;
    const giveScore = () => score++;

    return { name, symbol, getScore, giveScore };
}

function switchPlayerTurn (activePlayer) {
    if (activePlayer === player1) {
        activePlayer = player2;
    } else {
        activePlayer = player1;
    }

    return activePlayer;
}

const board = GameBoard;

const player1 = createPlayer("Minh", "X");
const player2 = createPlayer("BOT", "O");

let activePlayer = player1;

console.log(`${activePlayer.name}'s turn`);

console.log("Select a cell to place your symbol");

board.printBoard();