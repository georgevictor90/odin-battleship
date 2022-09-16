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
        cell.setAttribute("id", `${p.name}, ${iCol}, ${iRow}`);
        cell.textContent = row[i];
        playerBoard.appendChild(cell);
        cell.addEventListener("click", () => {
          cell.classList.toggle("selected");
        });
      }
    });
  });
}
