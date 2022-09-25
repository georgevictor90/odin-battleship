import {
  makePlayers,
  placeRandomShips,
  playRound,
  checkWin,
} from "../gameLogic/gameLogic.js";

//render player's gameboards on screen
function renderGameBoards(players) {
  players.forEach((p) => {
    const boardsContainer = document.querySelector(".boards");
    const playerBoard = document.createElement("div");
    playerBoard.setAttribute("id", p.name);
    playerBoard.classList.add("player-board");
    boardsContainer.appendChild(playerBoard);

    p.gameboard.spaces.forEach((row) => {
      makeGameboardCells(p, row, playerBoard);
    });
  });
}

function makeGameboardCells(p, row, playerBoard) {
  let iRow = p.gameboard.spaces.indexOf(row);
  for (let i = 0; i < row.length; i++) {
    let iCol = i;
    const cell = document.createElement("div");
    cell.classList.add("cell");
    cell.setAttribute("id", `${iCol},${iRow} ${p.name}`);
    cell.textContent = row[i];
    playerBoard.appendChild(cell);

    if (p.type === "AI") {
      cell.addEventListener(
        "click",
        () => {
          playRound(p.opponent, cell, row[i]);
        },
        { once: true }
      );
    }
  }
}

function renderCPUAttack(p, coords, targetStatus) {
  //get the random coords that were used by cpu to attack
  let x = coords[0];
  let y = coords[1];
  let name = p.opponent.name;
  let gameboard = p.opponent.gameboard.spaces;
  //   //get the cell with id of coords and player name
  let targetCell = document.getElementById(`${x},${y} ${name}`);
  //   //change its text content
  if (gameboard[y][x] !== "miss") {
    targetCell.textContent = "\u{2717}";
    targetCell.classList.add("hit");
    targetStatus = "hit";
  } else {
    targetCell.textContent = "\u{26AC}";
    targetStatus = "missed";
  }
  return targetStatus;
}

function markHit(cell) {
  cell.textContent = "\u{2717}";
  cell.classList.add("hit");
}

function markMiss(cell) {
  cell.textContent = "\u{26AC}";
}

function declareWinner(player) {
  const newGameBtn = document.querySelector(".new-game-btn");
  const h1 = document.querySelector(".players-h1");
  const winner = document.querySelector(".winner");
  winner.textContent = player.name + " wins!";

  newGameBtn.classList.toggle("hidden");
  h1.classList.toggle("hidden");
  winner.classList.toggle("hidden");

  const cpuCells = document.querySelectorAll(`[id$=" CPU"]`);
  cpuCells.forEach((cell) => {
    cell.click();
  });
}

function renderSunkShips(player) {
  let sunkShips = player.gameboard.getSunkShips();
  sunkShips.forEach((ship) => {
    //get the coords
    ship.position.forEach((pos) => {
      //access the cells with id containing coords
      let cell = document.getElementById(`${pos[0]},${pos[1]} ${player.name}`);
      //add class to the cells
      cell.classList.add("sunk");
    });
  });
}

function renderInitialElements() {
  const newGameDiv = document.querySelector(".new-game");
  const winner = document.createElement("h1");
  winner.classList.add("winner", "hidden");
  newGameDiv.appendChild(winner);

  const newGameBtn = document.createElement("button");
  newGameBtn.textContent = "New Game";
  newGameBtn.classList.add("new-game-btn");
  newGameDiv.appendChild(newGameBtn);

  const inputDiv = document.createElement("div");
  inputDiv.classList.add("input-div", "hidden");
  const nameInput = document.createElement("input");
  nameInput.classList.add("name-input");
  nameInput.type = "text";
  nameInput.placeholder = "Name";
  inputDiv.appendChild(nameInput);
  newGameDiv.appendChild(inputDiv);

  const goBtn = document.createElement("button");
  goBtn.textContent = "Start";
  goBtn.classList.add("go-btn");
  inputDiv.appendChild(goBtn);

  const playersH1 = document.createElement("h1");
  playersH1.classList.add("players-h1", "hidden");
  newGameDiv.appendChild(playersH1);

  newGameBtn.addEventListener("click", () => {
    const boards = document.querySelector(".boards");
    boards.innerHTML = "";
    winner.classList.add("hidden");
    nameInput.value = "";
    newGameBtn.classList.toggle("hidden");
    inputDiv.classList.toggle("hidden");
  });

  goBtn.addEventListener("click", () => {
    inputDiv.classList.toggle("hidden");
    playersH1.textContent = `${nameInput.value} vs CPU`;
    playersH1.classList.toggle("hidden");

    const players = makePlayers("Victor");

    renderGameBoards(players);
    placeRandomShips(players);
  });
}

export {
  renderInitialElements,
  markHit,
  markMiss,
  renderSunkShips,
  renderCPUAttack,
  declareWinner,
};
