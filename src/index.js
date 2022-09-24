import "./styles.css";
import { makePlayers, placeRandomShips } from "./gameLogic/gameLogic.js";
import renderGameBoards from "./domStuff/domStuff";

(function init() {
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
})();
