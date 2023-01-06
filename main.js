import game from "/game.js";

const form = document.getElementById("form");
const gameBoard = document.getElementById("gameBoard");

// starts game, picks up data from form
const playGame = (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const char1 = formData.get("char1");
  const char2 = formData.get("char2");

  game.size = formData.get("gameBoard_size");
  game.players = {
    [char1]: formData.get("player1"),
    [char2]: formData.get("player2"),
  };

  game.currentPlayer = char1;

  boardBehaviour(game, char1, char2);
};

// reprints board every time its needed
const boardBehaviour = (game, char1, char2) => {
  // if board already exists => removes it
  if (gameBoard.hasChildNodes()) {
    const board = document.getElementById("board");
    gameBoard.removeChild(board);
  }
  // creates table and appends it
  const table = document.createElement("table");
  table.id = "board";
  gameBoard.append(table);

  // fills table cols and rows
  for (let x = 1; x <= game.size; x++) {
    const row = document.createElement("tr");
    row.className = "row";
    table.append(row);
    for (let y = 1; y <= game.size; y++) {
      const unit = document.createElement("td");
      unit.className = "unit";
      unit.addEventListener("click", unitBehaviour(x, y, char1, char2, unit));
      game.map.forEach((changeUnit) => {
        // checks map array for already filled points
        if (changeUnit.x === x && changeUnit.y === y) {
          unit.innerHTML = changeUnit.char;
        }
      });
      row.append(unit);
    }
  }
};

// this is click behaviour of every unit
const unitBehaviour = (x, y, char1, char2, unit) => {
  return () => {
    if (unit.innerHTML !== "") {
      return;
    }
    game.currentPlayer = game.currentPlayer === char1 ? char2 : char1;
    game.map.push({ x: x, y: y, char: game.currentPlayer });
    boardBehaviour(game, char1, char2);

    console.log("Souřadnice [ x: " + x + " || y: " + y + " ] ");
    console.log(game.map);
    console.log(game.currentPlayer);
  };
};

form.addEventListener("submit", playGame);
