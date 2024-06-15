/*  
TODO:
- Add a check that keeps players from playing in spots that are already taken
Try to get value at the cell that the player is trying to place their symbol.
If it already had a value do nothing, else place current player's symbol.
- Add a tie condition
*/

function Player(name, symbol) {
  let score = 0;
  const getScore = () => score;
  const giveScore = () => score++;
  return { name, symbol, getScore, giveScore };
}

function Cell() {
  let value = "";

  const getValue = () => value;

  function addSymbol(playerSymbol) {
    value = value.replace(value, playerSymbol);
  }

  return { addSymbol, getValue };
}

const GameBoard = (function () {
  let board = [];
  const rows = 3;
  const columns = 3;
  const maximumPlacement = rows * columns;

  const getBoard = () => board;
  const getColumn = () => columns;
  const getMaxPlacement = () => maximumPlacement;

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

  const placeSymbol = (activePlayerSymbol, row, column) => {
    const boardWithValues = getBoardWithValues();
    if (!boardWithValues[row][column]) {
      board[row][column].addSymbol(activePlayerSymbol);
      return true;
    }
    return false;
  };

  function clearBoard() {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.addSymbol("");
      });
    });
  }

  return {
    getColumn,
    getBoard,
    placeSymbol,
    getBoardWithValues,
    clearBoard,
    getMaxPlacement
  };
})();

const DisplayController = (function () {
  const playerTurnLegend = document.querySelector("legend");

  const insertPlayerSymbol = (row, col, playerSymbol) => {
    const selectedCell = document.querySelector(
      "tr:nth-child(" + row + ") > td:nth-child(" + col + ")"
    );
    selectedCell.textContent = playerSymbol;
  };

  const changePlayerTurnText = (activePlayer) => {
    const regex = /[^\s]+/; // Match any character until the first white space.
    playerTurnLegend.textContent = playerTurnLegend.textContent.replace(
      regex,
      activePlayer.name
    );
  };

  const redrawBoard = () => {
    const tdTags = document.querySelectorAll("td");
    tdTags.forEach((tag) => {
      tag.textContent = "";
    });
  };

  return { insertPlayerSymbol, changePlayerTurnText, redrawBoard };
})();

function GameController(playerOneName, playerTwoName) {
  const board = GameBoard;
  const displayController = DisplayController;
  const player1 = Player(playerOneName, "X");
  const player2 = Player(playerTwoName, "O");

  let numberOfPlacement = 0;
  let activePlayer = player1;

  const getCurrentPlayer = () => activePlayer;

  const switchPlayerTurn = () => {
    activePlayer.name === player1.name
      ? (activePlayer = player2)
      : (activePlayer = player1);
    displayController.changePlayerTurnText(activePlayer);
  };

  const resetPlayerTurn = () => {
    activePlayer = player1;
    displayController.changePlayerTurnText(activePlayer);
  };

  const resetGame = () => {
    resetPlayerTurn();
    board.clearBoard();
    displayController.redrawBoard();
  };

  const checkWinCondition = (playerSymbol, board) => {
    const boardWithValues = board.getBoardWithValues();
    const totalCol = board.getColumn();

    const compareSymbol = (value) => value === playerSymbol;

    /* Check for each cell in a row */
    function checkRow() {
      for (let row of boardWithValues) {
        if (row.every(compareSymbol)) return true;
      }
    }

    /*  Check for each cell in a column */
    function checkColumn() {
      for (let i = 0; i < totalCol; i++) {
        const col = boardWithValues.map((cell) => {
          return cell[i];
        });

        if (col.every(compareSymbol)) return true;
      }
    }

    /* Check each cell in a diagonal */
    function checkDiagonal() {
      // Diagonal from top left to bottom right
      const isLinearTrue = boardWithValues
        .map(function (cell, index) {
          return cell[index];
        })
        .every(compareSymbol);

      // Diagonal from bottom left to top right
      const isReverseTrue = boardWithValues
        .toReversed()
        .map(function (cell, index) {
          return cell[index];
        })
        .every(compareSymbol);

      if (isLinearTrue || isReverseTrue) return true;
    }

    if (checkRow() || checkColumn() || checkDiagonal()) {
      alert(activePlayer.name + " has won the match");
      return true;
    };
  };

  function addPlayGameEventToCells() {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.addEventListener("click", function () {
        playGame(cell.closest("tr").rowIndex, cell.cellIndex);
      });
    });
  }

  function resetButtonEventHandler() {
    const resetButton = document.querySelector("#reset-button");
    resetButton.addEventListener("click", function () {
      resetGame();
    });
  }

  const playGame = (row, col) => {
    const isSymbolPlaced = board.placeSymbol(activePlayer.symbol, row, col);
    if (isSymbolPlaced) {
      numberOfPlacement++;
      // increase row and column by 1 because HTML table row and column index begin with 1
      displayController.insertPlayerSymbol(row + 1, col + 1, activePlayer.symbol);
    }

    // Check win condition
    if (checkWinCondition(activePlayer.symbol, board)) {
      board.clearBoard();
      activePlayer.giveScore();
      displayController.redrawBoard();
      numberOfPlacement = 0;
    } else {
      switchPlayerTurn();
    }

    // Check tie condition
    if (numberOfPlacement >= board.getMaxPlacement()) {
      alert("The game is tie. The game will reset");
      resetGame();
      numberOfPlacement = 0;
    }
  };

  addPlayGameEventToCells();
  resetButtonEventHandler();

  return { getCurrentPlayer, playGame, resetGame, resetButtonEventHandler };
}

const game = GameController("Player", "BOT");
