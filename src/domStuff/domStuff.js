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
            //HANDLE ATTACKS

            let x = Number(cell.id.charAt(0));
            let y = Number(cell.id.charAt(2));
            //attack gameboard on click coords
            p.opponent.attack([x, y]);
            //render attack on board
            cell.textContent = row[i] === "miss" ? "\u{26AC}" : "\u{2717}";
            if (row[i] !== "miss") cell.classList.add("hit");
            //CPU random attacks human player
            let cpuAttackCoords = p.randomAttack();
            renderCPUAttack(p, cpuAttackCoords);
          });
        }
      }
    });
  });
}

function renderCPUAttack(p, coords) {
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
  } else {
    targetCell.textContent = "\u{26AC}";
  }
}
