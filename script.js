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
6. [X] Create a GameController factory function that responsible for controlling the 
   flow and state of the game's turn.
7. [] Implement a win condition after 3 round that check each player total score, 
   then give a winning message to whoever has the highest score. 
*/

function Cell() {
  let value = " ";

  const addSymbol = (playerSymbol) => {
    value = value.replace(value, playerSymbol);
  };

  const getValue = () => value;

  return { addSymbol, getValue };
}

function createPlayer(name, symbol) {
  let score = 0;
  const getScore = () => score;
  const giveScore = () => score++;

  return { name, symbol, getScore, giveScore };
}

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

  const getColumn = () => column;
  const getBoard = () => board;

  const placeSymbol = (playerSymbol, row, column) => {
    board[row][column].addSymbol(playerSymbol);
  };

  const boardWithCellValues = board.map((row) =>
    row.map((cell) => {
      return cell.getValue();
    })
  );

  const printBoard = () => {
    console.log(boardWithCellValues);
  };

  return { getColumn, getBoard, placeSymbol, printBoard, boardWithCellValues };
})();

function GameController(playerOneName, playerTwoName) {
  const board = GameBoard;

  const player1 = createPlayer(playerOneName, "X");
  const player2 = createPlayer(playerTwoName, "O");

  let currentPlayer = player1;

  const getCurrentPlayer = () => currentPlayer;

  const switchPlayerTurn = () => {
    if (currentPlayer.name === player1.name) {
      currentPlayer = player2;
    } else {
      currentPlayer = player1;
    }

    return currentPlayer;
  };

  const printRoundMessage = () => {
    console.log(`Now it's ${currentPlayer.name}'s turn`);
    console.log("Select a cell to place your symbol");
    board.printBoard();
  };

  const checkWinOneRound = () => {
    // Check for each cell in a column if every symbol is the same.
  };

  const playOneRound = (currentPlayer, row, column) => {
    board.placeSymbol(currentPlayer.symbol, row, column);
    console.log(`Player ${currentPlayer.name}'s symbol has been placed`);

    // Check win condition here

    switchPlayerTurn();
    printRoundMessage();
  };

  printRoundMessage();

  return { playOneRound, getCurrentPlayer };
}

// const game = GameController("Minh", "BOT");

var two_d = [
  ["O", "X", "X"],
  ["X", "X", "X"],
  ["O", "X", "O"],
];

/* Check for each cell in a row. Use every */
const row = two_d.every((row) => { return row; })
console.log(row)

/*  Check for each cell in a column */
const checkColumns = (totalColumn) => {
  for (let i = 0; i < totalColumn; i++) {
    isTrue = two_d
      .map((row) => {
        return row[i];
      })
      .every((cell) => {
        return cell == "X";
      });

    if (isTrue) return true;
  }
};

const column = 3;
if (checkColumns(column)) console.log("Player won by column");


/* Check each cell in a diagonal */
// Diagonal from top left to bottom right
var diagonal1 = two_d.map(function (cell, index) {
  return cell[index]; // index increase for each subsequence loop
});

// Diagonal from bottom left to top right
var diagonal2 = two_d.toReversed().map(function (cell, index) {
  return cell[index];
});

console.log(`Diagonal 1: ${diagonal1}`);
console.log(`Diagonal 2: ${diagonal2}`);

const isSameSymbol = diagonal1.every(function (cell) {
  return cell == "X";
});

if (isSameSymbol) console.log("Player won by diagonal");
