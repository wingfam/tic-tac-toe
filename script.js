/*  
TODO:
Clean up the interface to allow players to put in their names, include a button 
to start/restart the game and add a display element that shows the results upon 
game end!
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


function GameController() {
  const board = GameBoard;
  const displayController = DisplayController;
  const selectPlayer1 = document.querySelector("#first-player-name");
  const selectPlayer2 = document.querySelector("#second-player-name");
  const firstPlayerLabel = document.querySelector("#first-player-name-label");
  const secondPlayerLabel = document.querySelector("#second-player-name-label");
  const startBtn = document.querySelector("#start-button");
  const resetBtn = document.querySelector("#reset-button");

  let numberOfPlacement = null;
  let activePlayer = null;
  let player1 = null;
  let player2 = null;

  const switchPlayerTurn = () => {
    activePlayer.name === player1.name
      ? (activePlayer = player2)
      : (activePlayer = player1);
    displayController.changePlayerTurnText(activePlayer);
  };

  function startGame() {
    if (selectPlayer1.value != "" && selectPlayer2.value != "") {
      player1 = Player(selectPlayer1.value, "X");
      player2 = Player(selectPlayer2.value, "O");

      numberOfPlacement = 0;
      activePlayer = player1;

      displayController.changePlayerTurnText(activePlayer);

      startBtn.style.display = "none";
      resetBtn.style.display = "block";
      selectPlayer1.style.display = "none";
      selectPlayer2.style.display = "none";
      firstPlayerLabel.style.display = "none";
      secondPlayerLabel.style.display = "none";
    } else {
      alert("Please make sure that both player's name was entered!");
    }
  }

  const resetGame = () => {
    switchPlayerTurn();
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
      resetGame();
      numberOfPlacement = 0;
      alert("The game is tie. The game will reset");
    }
  };

  (function addPlayGameEventToCells() {
    const cells = document.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.addEventListener("click", function () {
        playGame(cell.closest("tr").rowIndex, cell.cellIndex);
      });
    });
  })();

  (function resetButtonEventHandler() {
    const resetBtn = document.querySelector("#reset-button");
    resetBtn.addEventListener("click", function () {
      resetGame();
    });
  })();

  startBtn.addEventListener("click", startGame);

  return { playGame, resetGame };
}

GameController();