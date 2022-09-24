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

        // function handleClick(e) {
        //   // console.log(e);
        //   playRound(p.opponent, cell, row[i]);
        // }

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
    });
  });
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

function playRound(humanPlayer, cell, boardPos) {
  if (
    checkWin(humanPlayer.gameboard) === true ||
    checkWin(humanPlayer.opponent.gameboard) === true
  )
    return;
  //Human attacks CPU
  let x = Number(cell.id.charAt(0));
  let y = Number(cell.id.charAt(2));
  humanPlayer.attack([x, y]);
  boardPos = humanPlayer.opponent.gameboard.spaces[y][x];
  handleAttackFromHuman(humanPlayer, cell, boardPos);
}

function handleAttackFromHuman(player, cell, boardPos) {
  let opponent = player.opponent;

  if (boardPos !== "miss") {
    markHit(cell);
    renderSunkShips(opponent);
    let gameover = checkWin(opponent.gameboard);
    if (gameover) declareWinner(player);
  } else {
    markMiss(cell);
    setTimeout(() => {
      cpuAttacksHuman(opponent);
    }, 500);
  }
}

function markHit(cell) {
  cell.textContent = "\u{2717}";
  cell.classList.add("hit");
}

function markMiss(cell) {
  cell.textContent = "\u{26AC}";
}

function checkWin(playerBoard) {
  if (playerBoard.allSunk()) {
    return true;
  } else return false;
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

function cpuAttacksHuman(cpuPlayer, targetStatus = "") {
  do {
    let cpuAttackCoords = cpuPlayer.randomAttack();
    targetStatus = renderCPUAttack(cpuPlayer, cpuAttackCoords, targetStatus);

    if (targetStatus === "missed") return;

    renderSunkShips(cpuPlayer.opponent);
    let gameOver = checkWin(cpuPlayer.opponent.gameboard);
    if (gameOver !== false) declareWinner(cpuPlayer);

    setTimeout(() => {
      cpuAttacksHuman(cpuPlayer, targetStatus);
    }, 1000);

    targetStatus = "missed";
  } while (targetStatus !== "missed");
  ////when is the game over?
}
