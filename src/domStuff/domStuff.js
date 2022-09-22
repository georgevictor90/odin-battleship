//render player's gameboards on screen
export default function renderGameBoards(players) {
  players.forEach((p) => {
    const boardsContainer = document.querySelector(".boards");
    const playerBoard = document.createElement("div");
    playerBoard.setAttribute("id", p.name);
    playerBoard.classList.add("player-board");
    boardsContainer.appendChild(playerBoard);
    p.gameboard.spaces.forEach((row) => {
      let iRow = p.gameboard.spaces.indexOf(row);
      for (let i = 0; i < row.length; i++) {
        let iCol = i;
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.setAttribute("id", `${iCol},${iRow} ${p.name}`);
        cell.textContent = row[i];
        playerBoard.appendChild(cell);
        if (p.type === "AI") {
          cell.addEventListener("click", () => {
            // console.log(row[i]);
            playRound(p.opponent, cell, row[i]);
          });
        }
      }
    });
  });
}

function renderCPUAttack(p, coords, targetStatus) {
  // console.log({ targetStatus: targetStatus });
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
  // console.log({ targetStatus: targetStatus });
  return targetStatus;
}

function playRound(humanPlayer, cell, boardPos) {
  // console.table(humanPlayer.opponent.gameboard.spaces);
  // console.log(boardPos);
  // debugger;
  //Human attacks CPU
  let x = Number(cell.id.charAt(0));
  let y = Number(cell.id.charAt(2));
  humanPlayer.attack([x, y]);
  // console.table(humanPlayer.opponent.gameboard.spaces[y][x]);
  // console.log(boardPos);
  boardPos = humanPlayer.opponent.gameboard.spaces[y][x];
  handleAttackFromHuman(humanPlayer, cell, boardPos);
  // console.table(humanPlayer.opponent.gameboard.spaces);
}

function handleAttackFromHuman(player, cell, boardPos) {
  let opponent = player.opponent;
  let result;

  if (boardPos !== "miss") {
    markHit(cell);
    renderSunkShips(opponent);
    checkWin(opponent.gameboard, result);
  } else {
    markMiss(cell);
    setTimeout(() => {
      cpuAttacksHuman(opponent, result);
    }, 500);
  }

  if (result === "Game over")
    setTimeout(function () {
      alert("game over");
    }, 0);
}

function markHit(cell) {
  cell.textContent = "\u{2717}";
  cell.classList.add("hit");
}

function markMiss(cell) {
  cell.textContent = "\u{26AC}";
}

function checkWin(playerBoard, result) {
  if (playerBoard.allSunk()) {
    result = "Game over";
    return true;
  } else return false;
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

function cpuAttacksHuman(cpuPlayer, result, targetStatus = "") {
  do {
    let cpuAttackCoords = cpuPlayer.randomAttack();
    targetStatus = renderCPUAttack(cpuPlayer, cpuAttackCoords, targetStatus);

    console.log(targetStatus);
    if (targetStatus === "missed") return;

    renderSunkShips(cpuPlayer.opponent);
    let gameOver = checkWin(cpuPlayer.opponent.gameboard, result);
    if (gameOver !== false) return;

    setTimeout(() => {
      cpuAttacksHuman(cpuPlayer, result, targetStatus);
    }, 1000);

    targetStatus = "missed";
  } while (targetStatus !== "missed");
  ////when is the game over?
}
