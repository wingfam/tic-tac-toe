/*  
TODO:
- Add a check that keeps players from playing in spots that are already taken
Try to get value at the cell that the player is trying to place their symbol.
If it already had a value do nothing, else place current player's symbol.
- Add a tie condition
*/ 

function Cell() {
  let value = " ";

  function addSymbol(playerSymbol) {
    value = value.replace(value, playerSymbol);
  }

  const getValue = () => value;

  return { addSymbol, getValue };
}

function createPlayer(name, symbol) {
  let score = 0;
  const getScore = () => score;
  const giveScore = () => score++;
  return { name, symbol, getScore, giveScore };
}

const DisplayController = (function () {
  const playerTurnLegend = document.querySelector("legend");

  const insertPlayerSymbol = (tdTag, playerSymbol) => {
    tdTag.textContent = playerSymbol;
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

const GameBoard = (function () {
  const rows = 3;
  const columns = 3;
  const maximumPlacement = rows * columns;
  let board = [];

  const getColumn = () => columns;
  const getMaxPlacement = () => maximumPlacement;
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

  const placeSymbol = (playerSymbol, row, column) => {
    board[row][column].addSymbol(playerSymbol);
  };

  function clearBoard() {
    board.forEach((row) => {
      row.forEach((cell) => {
        cell.addSymbol(" ");
      });
    });
  }

  return {
    getColumn,
    getBoard,
    placeSymbol,
    getBoardWithValues,
    clearBoard,
    getMaxPlacement,
  };
})();

function GameController(playerOneName, playerTwoName) {
  const board = GameBoard;
  const displayController = DisplayController;
  const player1 = createPlayer(playerOneName, "X");
  const player2 = createPlayer(playerTwoName, "O");

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
    let isWin = false;
    const totalCol = board.getColumn();
    const boardWithValues = board.getBoardWithValues();

    const compareSymbol = (value) => value === playerSymbol;

    /* Check for each cell in a row. Use every */
    function checkRow() {
      for (let row of boardWithValues) {
        if (row.every(compareSymbol)) return true;
        // else return false;
      }
    }

    /*  Check for each cell in a column */
    function checkColumn() {
      for (let i = 0; i < totalCol; i++) {
        const col = boardWithValues.map((cell) => {
          return cell[i];
        });

        if (col.every(compareSymbol)) return true;
        // else return false;
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

    if (checkRow() || checkColumn() || checkDiagonal()) isWin = true;

    return isWin;
  };

  const playGame = (inputRow, inputCol) => {
    numberOfPlacement++;
    board.placeSymbol(activePlayer.symbol, inputRow, inputCol);
    let winCondition = checkWinCondition(activePlayer.symbol, board);

    // Check win condition
    if (winCondition) {
      board.clearBoard();
      activePlayer.giveScore();
      displayController.redrawBoard();
      alert(activePlayer.name + " has won the match");
    } else {
      switchPlayerTurn();
    }

    // Check tie condition
    // if (numberOfPlacement >= board.getMaxPlacement()) {
    //   resetGame();
    //   displayController.redrawBoard();
    // }
  };

  function addEventToGridItems() {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.addEventListener("click", function () {
        displayController.insertPlayerSymbol(cell, activePlayer.symbol);
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

  addEventToGridItems();
  resetButtonEventHandler();

  return { getCurrentPlayer, playGame, resetGame, resetButtonEventHandler };
}

const game = GameController("Player", "BOT");
