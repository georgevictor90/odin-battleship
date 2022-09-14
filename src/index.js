import "./styles.css";
import Gameboard from "./gameboard/gameboard";
import { Player, ComputerPlayer } from "./player/player";
import Ship from "./ship/ship";
import shipTypes from "./ship/shipTypes";
import { getRandomIntInclusive } from "./helpers";

let { ["log"]: c } = console;

const boardsContainer = document.querySelector(".boards");
const humanPlayer = new Player("Victor", "human");
const computerPlayer = new ComputerPlayer();
humanPlayer.opponent = computerPlayer;
computerPlayer.opponent = humanPlayer;

const players = [humanPlayer, computerPlayer];

players.forEach((p) => {
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

const playerBoards = [...document.querySelectorAll(".player-board")];

function placeRandomShips(players, counter = 0) {
  let x, y, z;
  let orientations = ["horizontal", "vertical"];

  players.forEach((p) => {
    for (const key in shipTypes) {
      do {
        x = getRandomIntInclusive(0, 9);
        y = getRandomIntInclusive(0, 9);
        z = getRandomIntInclusive(0, 1);
      } while (
        !isValidPosition([x, y], shipTypes[key], orientations[z], p.gameboard)
      );
      p.gameboard.placeShip([x, y], shipTypes[key], orientations[z], p.name);
    }
    // c(p.gameboard.ships);
  });
}

function isValidPosition(head, type, orientation, gameboard) {
  if (!orientation) return;
  let positions = [];
  let bool;
  positions.push(head);

  if (orientation === "horizontal") {
    //is ship outside board
    if (10 - head[0] < type.size) {
      bool = false;
    } else {
      //store the coords
      for (let i = 1; i < type.size; i++) {
        positions.push([head[0] + i, head[1]]);
      }
      bool = true;
    }
  } else if (orientation === "vertical") {
    //is ship outside board
    if (10 - head[1] < type.size) {
      bool = false;
    } else {
      //store the coords
      for (let i = 1; i < type.size; i++) {
        let newPos = [head[0], head[1] + i];
        positions.push(newPos);
        bool = true;
      }
    }
  }
  if (bool === false) return;
  return positions.every((p) => gameboard.spaces[p[1]][p[0]] === null);
}

// function renderShipsOnBoards() {}

placeRandomShips(players);
