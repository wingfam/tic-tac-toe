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
7. [X] Implement a win condition after one round and give one score to winner. 
7.1. [] Give board a blank slate after declare a winner of that round.
8. [] After 3 round, declare winner of that match.
9. [] Implement a tie condition after one round.
*/

function Cell() {
  let value = " ";
  const addSymbol = (playerSymbol) =>
    (value = value.replace(value, playerSymbol));
  const getValue = () => value;
  return { addSymbol, getValue };
}

function createPlayer(name, symbol) {
  let score = 0;
  const getScore = () => score;
  const giveScore = () => score++;
  return { name, symbol, getScore, giveScore };
}

function checkWinOneRound(playerSymbol, board) {
  let isWin = false;
  const totalCol = board.getColumn();
  const boardWithValues = board.getBoardWithValues();

  const compareSymbol = (value) => value === playerSymbol;

  /* Check for each cell in a row. Use every */
  const checkRow = () => {
    for (let row of boardWithValues) {
      const isTrue = row.every(compareSymbol);
      if (isTrue) {
        return true;
      }
    }
  };

  /*  Check for each cell in a column */
  const checkColumn = () => {
    for (let i = 0; i < totalCol; i++) {
      const col = boardWithValues.map((cell) => {
        return cell[i];
      });
      const isTrue = col.every(compareSymbol);
      if (isTrue) {
        return true;
      }
    }
  };

  /* Check each cell in a diagonal */
  const checkDiagonal = () => {
    // Diagonal from top left to bottom right
    const isLinearTrue = boardWithValues
      .map(function (cell, index) {
        return cell[index]; // index increase for each subsequence loop
      })
      .every(compareSymbol);

    // Diagonal from bottom left to top right
    const isReverseTrue = boardWithValues
      .toReversed()
      .map(function (cell, index) {
        return cell[index];
      })
      .every(compareSymbol);

    if (isLinearTrue || isReverseTrue) {
      return true;
    }
  };

  if (checkRow() || checkColumn() || checkDiagonal()) {
    isWin = true;
  }

  return isWin;
}

function checkPlayerWinAMatch(player1, player2) {
  const playerOneScore = player1.getScore();
  const playerTwoScore = player2.getScore();
  if (playerOneScore > playerTwoScore) return player1.name;
  if (playerOneScore < playerTwoScore) return player2.name;
}

const GameBoard = (function () {
  const rows = 3;
  const columns = 3;
  let board = [];

  const getColumn = () => columns;
  const getBoard = () => board;

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

  const getBoardWithValues = () => {
    return board.map((row) =>
      row.map((cell) => {
        return cell.getValue();
      })
    );
  };

  const printBoard = () => {
    const boardWithCellValues = getBoardWithValues();
    console.log(boardWithCellValues);
  };

  const placeSymbol = (playerSymbol, row, column) => {
    board[row][column].addSymbol(playerSymbol);
  };

  return { getColumn, getBoard, placeSymbol, printBoard, getBoardWithValues };
})();

function GameController(playerOneName, playerTwoName) {
  const board = GameBoard;
  const totalRoundPlay = 3;

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
    console.log("A new round has started.");
    console.log(`Now it's ${currentPlayer.name}'s turn`);
    board.printBoard();
  };

  const printMatchMessage = () => {
    console.log("This is a 2 of out 3 Tic-Tac-Toe match.");
    printRoundMessage();
  };

  const playMatch = () => {
    let currentRound = 0;
    do {
      // TODO: Find a way to implement invoke playing one round
      // inside this do while loop.
      playOneRound();
      currentRound++;
    } while (currentRound < totalRoundPlay);

    const winner = checkPlayerWinAMatch(player1, player2);
    console.log(`Congratulation! ${winner} has won the match.`);
  };

  function playOneRound() {
    let winOneCondition = false;

    do {
      let inputRow = prompt("Type row you want to place your symbol.");
      let inputCol = prompt("Type column you want to place your symbol.");

      board.placeSymbol(currentPlayer.symbol, inputRow, inputCol);
      console.log(`Player ${currentPlayer.name}'s symbol has been placed`);
      winOneCondition = checkWinOneRound(currentPlayer.symbol, board);

      if (winOneCondition) {
        board.printBoard();
        currentPlayer.giveScore();
        console.log(`${currentPlayer.name} has won this round!`);
        console.log(
          `${currentPlayer.name}'s total score is: ${currentPlayer.getScore()}`
        );
      } else {
        switchPlayerTurn();
        board.printBoard();
        console.log(`It's ${currentPlayer.name}'s turn`);
      }
    } while (winOneCondition === false);

    switchPlayerTurn();
    printRoundMessage();
  }

  printMatchMessage();

  return { getCurrentPlayer, playOneRound, playMatch };
}

const game = GameController("Minh", "BOT");
game.playMatch();

// First round: Minh won
// game.playOneRound(0, 0);
// game.playOneRound(1, 0);
// game.playOneRound(0, 1);
// game.playOneRound(1, 1);
// game.playOneRound(0, 2);
