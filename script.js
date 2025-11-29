function gameboard() {
  let board = [];

  for (let row = 0; row < 3; row++) {
    board[row] = [];
    for (let column = 0; column < 3; column++) {
      board[row].push(cell());
    }
  }

  function setBoard(posX, posY, player) {
    if (posX < 0 || posX > 2 || posY < 0 || posY > 2) {
      console.log("invalid position");
      return;
    }

    if (board[posY][posX].getValue() === null) {
      if (player === "x") {
        board[posY][posX].setX();
      } else {
        board[posY][posX].setO();
      }
    } else {
      console.log("cell already occupied");
      return;
    }
    return 0;
  }

  function getBoard() {
    return board;
  }

  function printBoard() {
    const displayBoard = board
      .map((row) => row.map((cell) => cell.getValue() || "-").join(" "))
      .join("\n");
    console.log(displayBoard);
  }

  return {
    setBoard,
    getBoard,
    printBoard,
  };
}

function cell() {
  let value = null;

  function setX() {
    if (value !== null) return;
    value = "x";
  }

  function setO() {
    if (value !== null) return;
    value = "o";
  }

  function getValue() {
    return value;
  }

  return {
    setX,
    setO,
    getValue,
  };
}

const gameloop = function (
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  console.log("welcome to the game");

  const players = [
    {
      name: playerOneName,
      token: "x",
    },
    {
      name: playerTwoName,
      token: "o",
    },
  ];

  const game = gameboard();
  game.printBoard();

  let activePlayer = players[0];

  function getActivePlayer() {
    return activePlayer;
  }

  function switchPlayer() {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const playRound = (posX, posY) => {
    const complete = game.setBoard(posX, posY, activePlayer.token);

    if (complete === 0) {
      const winner = checkWinCondition();
      const fullboard = game
        .getBoard()
        .every((row) => row.some((cell) => cell.getValue() === null) !== true);
      if (winner) {
        console.log("The winner is ", winner);
        return winner;
      } else if (fullboard) {
        return "draw";
      }
      switchPlayer();
    }
    game.printBoard();
  };

  function checkWinCondition() {
    const board = game.getBoard();
    // check rows
    for (const row of board) {
      let winOne = 0;
      let winTwo = 0;
      for (let i = 0; i < row.length; i++) {
        if (row[i].getValue() === null) break;
        if (row[i].getValue() === players[0].token) winOne++;
        if (row[i].getValue() === players[1].token) winTwo++;
      }

      if (winOne === 3) {
        return players[0].name;
      } else if (winTwo === 3) {
        return players[1].name;
      }
    }

    for (let i = 0; i < 3; i++) {
      let winOne = 0;
      let winTwo = 0;
      for (let a = 0; a < 3; a++) {
        if (board[a][i].getValue() === null) break;
        if (board[a][i].getValue() === players[0].token) winOne++;
        if (board[a][i].getValue() === players[1].token) winTwo++;
      }

      if (winOne === 3) {
        return players[0].name;
      } else if (winTwo === 3) {
        return players[1].name;
      }
    }

    if (
      board[0][0].getValue() === board[1][1].getValue() &&
      board[0][0].getValue() === board[2][2].getValue() &&
      board[0][0].getValue() !== null
    ) {
      if (board[0][0].getValue() === players[0].token) {
        return players[0].name;
      } else if (board[0][0].getValue() === players[1].token) {
        return players[1].name;
      }
    }

    if (
      board[0][2].getValue() === board[1][1].getValue() &&
      board[0][2].getValue() === board[2][0].getValue() &&
      board[0][2].getValue() !== null
    ) {
      if (board[0][2].getValue() === players[0].token) {
        return players[0].name;
      } else if (board[0][2].getValue() === players[1].token) {
        return players[1].name;
      }
    }

    return null;
  }

  return {
    playRound,
    getActivePlayer,
    getBoard: game.getBoard,
  };
};

const screenController = (function () {
  const mainGame = gameloop();

  // Draw board
  const viewBoard = document.getElementById("board");
  for (let i = 0; i < 3; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < 3; j++) {
      const column = document.createElement("td");
      const button = document.createElement("button");
      button.dataset.row = i;
      button.dataset.column = j;
      button.classList.add("game-cells")
      button.addEventListener("click", eventTrigger);
      column.appendChild(button);
      row.appendChild(column);
    }
    viewBoard.appendChild(row);
  }

  function eventTrigger(e) {
    const rowY = e.target.dataset.row;
    const colX = e.target.dataset.column;
    console.log(rowY, colX);
    console.log(mainGame.getBoard()[rowY][colX].getValue());
    if (mainGame.getBoard()[rowY][colX].getValue() !== null) return;
    const player = mainGame.getActivePlayer();
    const endingState = mainGame.playRound(colX, rowY);
    const mark = document.createElement("div");
    if (player.token === "x") {
      mark.classList.add("cross-icon");
    } else {
      mark.classList.add("circle");
    }
    e.target.appendChild(mark);
    e.target.disabled = true;
    e.target.style.cursor = "default";
    if (endingState) {
      endGameDisplay(endingState);
      blockBoard();
    }
  }

  function endGameDisplay(result) {
    const endBanner = document.getElementById("end");
    const endPhrase = document.createElement("h2");
    if (result === "draw") {
      endPhrase.textContent = "Game is a Draw!";
    } else {
      endPhrase.textContent = `The winner ${result}. Congratulations!`;
    }
    endBanner.appendChild(endPhrase);
  }

  function blockBoard() {
    const viewBoard = document.getElementById("board");
    const rows = viewBoard.querySelectorAll("tr");
    rows.forEach((row) => {
      row.childNodes.forEach((td) => {
        const button = td.children[0];
        button.disabled = true;
        button.style.cursor = "default";
      });
    });
  }


})();
