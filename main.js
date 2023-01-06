import game from "/game.js";

const form = document.getElementById("form");
const gameBoard = document.getElementById("gameBoard");

// starts game, picks up data from form
const playGame = (e) => {
  e.preventDefault();
  const formData = new FormData(form);

  const znak1 = formData.get("znak1");
  const znak2 = formData.get("znak2");

  game.size = formData.get("velikost_plochy");
  game.players = {
    [znak1]: formData.get("hrac1"),
    [znak2]: formData.get("hrac2"),
  };

  game.currentPlayer = znak1;

  boardBehaviour(game, znak1, znak2);
};

// reprints board every time its needed
const boardBehaviour = (game, znak1, znak2) => {
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
      unit.addEventListener("click", unitBehaviour(x, y, znak1, znak2, unit));
      game.map.forEach((changeUnit) => {
        // checks map array for already filled points
        if (changeUnit.x === x && changeUnit.y === y) {
          unit.innerHTML = changeUnit.znak;
        }
      });
      row.append(unit);
    }
  }
};

// this is click behaviour of every unit
const unitBehaviour = (x, y, znak1, znak2, unit) => {
  return () => {
    if (unit.innerHTML !== "") {
      return;
    }
    game.currentPlayer = game.currentPlayer === znak1 ? znak2 : znak1;
    game.map.push({ x: x, y: y, znak: game.currentPlayer });
    boardBehaviour(game, znak1, znak2);

    console.log("Souřadnice [ x: " + x + " || y: " + y + " ] ");
    console.log(game.map);
    console.log(game.currentPlayer);
  };
};

form.addEventListener("submit", playGame);
