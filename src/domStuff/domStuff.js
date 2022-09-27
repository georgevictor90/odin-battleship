import {
  makePlayers,
  placeRandomShips,
  playRound,
  isValidPosition,
} from "../gameLogic/gameLogic.js";
import shipTypes from "../ship/shipTypes.js";

//render player's gameboards on screen

function renderGameBoards(playersArray) {
  const boardsContainer = document.querySelector(".boards");

  playersArray.forEach((p) => {
    const playerBoard = document.createElement("div");
    playerBoard.setAttribute("id", p.type);
    playerBoard.classList.add("player-board");
    boardsContainer.appendChild(playerBoard);
    p.type === "human"
      ? renderShipDetails()
      : playerBoard.classList.toggle("hidden");

    p.gameboard.spaces.forEach((row) => {
      makeGameboardCells(p, row, playerBoard);
    });
  });
  addEventListenersForHumanCells(playersArray);
}

function makeGameboardCells(p, row, playerBoard) {
  //index of row in gameboard.spaces
  let iRow = p.gameboard.spaces.indexOf(row);
  //loop through each row's elements
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

function addEventListenersForHumanCells(players) {
  let j = 0;
  const keys = Object.keys(shipTypes);

  const cells = Array.from(document.getElementById("human").children);

  cells.forEach((cell) => {
    const cellId = cell.id;
    let cellCoords = [Number(cellId[0]), Number(cellId[2])];

    cell.addEventListener("mouseover", () => {
      let orientation = document.querySelector(".orientation-btn").textContent;
      if (j > 4) return;
      let isValid = isValidPosition(
        cellCoords,
        shipTypes[keys[j]],
        document.querySelector(".orientation-btn").textContent,
        players[0].gameboard
      );

      // if coords are invalid
      if (isValid !== true) {
        cell.classList.add("invalid");
        cell.addEventListener("mouseleave", () => {
          cell.classList.remove("invalid");
        });
      } else {
        for (let i = 0; i < shipTypes[keys[j]].size; i++) {
          const newId =
            orientation === "horizontal"
              ? `${Number(cellId[0]) + i}` + cellId.substring(1)
              : cellId.substring(0, 2) +
                `${Number(cellId[2]) + i}` +
                cellId.substring(3);

          document.getElementById(newId).classList.add("selected");
          cell.addEventListener("mouseleave", () => {
            document.getElementById(newId).classList.remove("selected");
          });
        }
      }
    });

    cell.addEventListener("click", () => {
      if (j > 4) return;
      // cell on click

      // let cellCoords = [Number(cellId[0]), Number(cellId[2])];
      let isValid = isValidPosition(
        cellCoords,
        shipTypes[keys[j]],
        document.querySelector(".orientation-btn").textContent,
        players[0].gameboard
      );
      // check valid position
      if (isValid !== true) return;
      players[0].gameboard.placeShip(
        cellCoords,
        shipTypes[keys[j]],
        document.querySelector(".orientation-btn").textContent,
        players[0].name
      );
      j++;
      if (j < 5) {
        document.querySelector(".current-ship-type").textContent =
          shipTypes[keys[j]].name;
      } else {
        const startGameBtn = document.createElement("button");
        startGameBtn.textContent = "GO";
        document.querySelector(".ship-details").appendChild(startGameBtn);
        document.querySelector(".current-ship-type").classList.toggle("hidden");
        document.querySelector(".orientation-btn").classList.toggle("hidden");
        startGameBtn.addEventListener("click", () => {
          document.querySelector(".ship-details").classList.toggle("hidden");
          document.getElementById("AI").classList.toggle("hidden");
        });
      }
    });
  });
}

function renderShipDetails() {
  const keys = Object.keys(shipTypes);
  const boardsContainer = document.querySelector(".boards");
  const shipDetails = document.createElement("div");
  shipDetails.classList.add("ship-details");
  boardsContainer.appendChild(shipDetails);

  const currentShipType = document.createElement("h2");
  currentShipType.textContent = shipTypes[keys[0]].name;
  currentShipType.classList.add("current-ship-type");
  shipDetails.appendChild(currentShipType);

  const orientationBtn = document.createElement("button");
  orientationBtn.classList.add("orientation-btn");
  orientationBtn.textContent = "horizontal";
  shipDetails.appendChild(orientationBtn);

  orientationBtn.addEventListener("click", changeOrientationBtnValue);
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

function changeOrientationBtnValue() {
  const btn = document.querySelector(".orientation-btn");
  btn.textContent === "horizontal"
    ? (btn.textContent = "vertical")
    : (btn.textContent = "horizontal");
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

    const players = makePlayers(nameInput.value);
    // renderPlaceShipsBoard(players.slice(0, 1));

    renderGameBoards(players);
    placeRandomShips(players.slice(1));
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
