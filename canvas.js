import game from "/game.js";

const form = document.getElementById("form");
const canvas = document.querySelector("#canvas");

const ctx = canvas.getContext("2d");

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
  canvasBehaviour(game, char1, char2);
};

// creates canvas
const canvasBehaviour = (game, char1, char2) => {
  const canvasSize = game.size * 100;
  const unitSize = canvasSize / game.size;
  canvas.width = canvasSize;
  canvas.height = canvasSize;

  canvas.addEventListener("mousedown", function (e) {
    cursorBehaviour(canvas, e, char1, char2);
  });
  // recreates units + chars inside them every time you click
  for (let x = 0; x <= canvasSize; x += unitSize) {
    for (let y = 0; y <= canvasSize; y += unitSize) {
      ctx.strokeRect(x, y, x + unitSize, y + unitSize);
      game.map.forEach((value) => {
        // goes through game map, if it finds char at unit, draws it
        if (value.x === x + 50 && value.y === y + 50) {
          if (value.char === "X") {
            drawX(value.x, value.y);
            return;
          }
          drawO(value.x, value.y);
        }
      });
    }
  }
};

// cursor behaviour on canvas
const cursorBehaviour = (canvas, event, char1, char2) => {
  const rect = canvas.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;

  const positionX = parseInt(Math.floor(x / 100) + "" + 50);
  const positionY = parseInt(Math.floor(y / 100) + "" + 50);

  const filled = game.map.find((value) => {
    if (value.x === positionX && value.y === positionY) {
      return value;
    }
  });
  // if position is already filled return
  if (filled) {
    return;
  }

  // push char inside game map
  game.currentPlayer = game.currentPlayer === char1 ? char2 : char1;
  game.map.push({
    x: positionX,
    y: positionY,
    char: game.currentPlayer,
  });

  // recreates canvas
  canvasBehaviour(game, char1, char2);

  // checks game
  checkGame(game.map[game.map.length - 1]);
};

// game state checker
const checkGame = (clickedValue) => {
  console.log(game.map);
  const firstChar = game.map[0].char;
  if (clickedValue.char === "X") {
    const loopUnit = firstChar === "X" ? 0 : 1;
    rowChecker(clickedValue, loopUnit, "X");
    colChecker(clickedValue, loopUnit, "X");
    diagChecker(clickedValue, loopUnit, "X");
    return;
  }
  const loopUnit = firstChar === "O" ? 0 : 1;
  rowChecker(clickedValue, loopUnit, "O");
  colChecker(clickedValue, loopUnit, "O");
  diagChecker(clickedValue, loopUnit, "O");
};

// checks rows
const rowChecker = (clickedValue, loopUnit, char) => {
  // first unit check loop
  for (let i = loopUnit; i < game.map.length; i += 2) {
    let x = game.map[i].x;
    let y = game.map[i].y;

    // must be in same row (y)
    if (y === clickedValue.y && x !== clickedValue.x) {
      if (x === clickedValue.x + 100) {
        // second unit check loop
        for (let j = loopUnit; j < game.map.length; j += 2) {
          x = game.map[j].x;
          y = game.map[j].y;
          if (y === clickedValue.y && x !== clickedValue.x) {
            if (x === clickedValue.x - 100) {
              console.log("win " + char);
              drawWin(clickedValue.x + 150, y, clickedValue.x - 150, y);
              return;
            }
            if (x === clickedValue.x + 200) {
              console.log("win " + char);
              drawWin(clickedValue.x - 50, y, clickedValue.x + 250, y);
              return;
            }
          }
        }
      }

      if (x === clickedValue.x - 100) {
        for (let k = loopUnit; k < game.map.length; k += 2) {
          x = game.map[k].x;
          y = game.map[k].y;
          if (y === clickedValue.y && x !== clickedValue.x) {
            if (x === clickedValue.x + 100) {
              console.log("win " + char);
              drawWin(clickedValue.x - 150, y, clickedValue.x + 150, y);
              return;
            }
            if (x === clickedValue.x - 200) {
              console.log("win " + char);
              drawWin(clickedValue.x + 50, y, clickedValue.x - 250, y);
              return;
            }
          }
        }
      }
    }
  }
};

const colChecker = (clickedValue, loopUnit, char) => {
  for (let i = loopUnit; i < game.map.length; i += 2) {
    let x = game.map[i].x;
    let y = game.map[i].y;

    // must be in same row (y)
    if (x === clickedValue.x && y !== clickedValue.y) {
      // there is something on right
      if (y === clickedValue.y + 100) {
        // second unit check loop
        for (let j = loopUnit; j < game.map.length; j += 2) {
          x = game.map[j].x;
          y = game.map[j].y;
          if (x === clickedValue.x && y !== clickedValue.y) {
            if (y === clickedValue.y - 100) {
              console.log("win " + char);
              drawWin(x, clickedValue.y + 150, x, clickedValue.y - 150);
              return;
            }
            if (y === clickedValue.y + 200) {
              console.log("win " + char);
              drawWin(x, clickedValue.y - 50, x, clickedValue.y + 250);
              return;
            }
          }
        }
      }

      if (y === clickedValue.y - 100) {
        for (let k = loopUnit; k < game.map.length; k += 2) {
          x = game.map[k].x;
          y = game.map[k].y;
          if (x === clickedValue.x && y !== clickedValue.y) {
            if (x === clickedValue.x + 100) {
              console.log("win " + char);
              drawWin(x, clickedValue.y - 150, x, clickedValue.y + 150);
              return;
            }
            if (y === clickedValue.y - 200) {
              console.log("win " + char);
              drawWin(x, clickedValue.y + 50, x, clickedValue.y - 250);
              return;
            }
          }
        }
      }
    }
  }
};

const diagChecker = (clickedValue, loopUnit, char) => {
  for (let i = loopUnit; i < game.map.length; i += 2) {
    let x = game.map[i].x;
    let y = game.map[i].y;

    if (y === clickedValue.y + 100 && x === clickedValue.x + 100) {
      // second unit check loop
      for (let j = loopUnit; j < game.map.length; j += 2) {
        x = game.map[j].x;
        y = game.map[j].y;

        if (y === clickedValue.y - 100 && x === clickedValue.x - 100) {
          console.log("win " + char);
          drawWin(
            clickedValue.x - 150,
            clickedValue.y - 150,
            clickedValue.x + 150,
            clickedValue.y + 150
          );
          return;
        }

        if (y === clickedValue.y + 200 && x === clickedValue.x + 200) {
          console.log("win " + char);
          drawWin(
            clickedValue.x - 50,
            clickedValue.y - 50,
            clickedValue.x + 250,
            clickedValue.y + 250
          );
          return;
        }
      }
    }

    if (y === clickedValue.y - 100 && x === clickedValue.x - 100) {
      for (let k = loopUnit; k < game.map.length; k += 2) {
        x = game.map[k].x;
        y = game.map[k].y;

        if (y === clickedValue.y + 100 && x === clickedValue.x + 100) {
          console.log("win " + char);
          drawWin(
            clickedValue.x + 150,
            clickedValue.y + 150,
            clickedValue.x - 150,
            clickedValue.y - 150
          );
          return;
        }

        if (y === clickedValue.y - 200 && x === clickedValue.x - 200) {
          console.log("win " + char);
          drawWin(
            clickedValue.x + 50,
            clickedValue.y + 50,
            clickedValue.x - 250,
            clickedValue.y - 250
          );
          return;
        }
      }
    }

    if (y === clickedValue.y - 100 && x === clickedValue.x + 100) {
      for (let k = loopUnit; k < game.map.length; k += 2) {
        x = game.map[k].x;
        y = game.map[k].y;

        if (y === clickedValue.y + 100 && x === clickedValue.x - 100) {
          console.log("win " + char);
          drawWin(
            clickedValue.x + 150,
            clickedValue.y - 150,
            clickedValue.x - 150,
            clickedValue.y + 150
          );
          return;
        }

        if (y === clickedValue.y - 200 && x === clickedValue.x + 200) {
          console.log("win " + char);
          drawWin(
            clickedValue.x - 50,
            clickedValue.y + 50,
            clickedValue.x + 250,
            clickedValue.y - 250
          );
          return;
        }
      }
    }

    if (y === clickedValue.y + 100 && x === clickedValue.x - 100) {
      for (let k = loopUnit; k < game.map.length; k += 2) {
        x = game.map[k].x;
        y = game.map[k].y;

        if (y === clickedValue.y - 100 && x === clickedValue.x + 100) {
          console.log("win " + char);
          drawWin(
            clickedValue.x - 150,
            clickedValue.y + 150,
            clickedValue.x + 150,
            clickedValue.y - 150
          );
          return;
        }

        if (y === clickedValue.y + 200 && x === clickedValue.x - 200) {
          console.log("win " + char);
          drawWin(
            clickedValue.x + 50,
            clickedValue.y - 50,
            clickedValue.x - 250,
            clickedValue.y + 250
          );
          return;
        }
      }
    }
  }
};

// draw X
const drawX = (x, y) => {
  ctx.beginPath();

  ctx.moveTo(x - 20, y - 20);
  ctx.lineTo(x + 20, y + 20);

  ctx.moveTo(x + 20, y - 20);
  ctx.lineTo(x - 20, y + 20);
  ctx.stroke();
};

// draw O
const drawO = (x, y) => {
  ctx.beginPath();
  ctx.arc(x, y, 25, 0, 2 * Math.PI);
  ctx.stroke();
};

const drawWin = (startX, startY, endX, endY) => {
  ctx.beginPath();

  ctx.moveTo(startX, startY);
  ctx.lineTo(endX, endY);

  ctx.stroke();
};

form.addEventListener("submit", playGame);
