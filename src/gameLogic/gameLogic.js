import { Player, ComputerPlayer } from "../player/player";
import shipTypes from "../ship/shipTypes";
import { getRandomIntInclusive } from "../helpers";

function placeRandomShips(players) {
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
  });
}

function makePlayers(name = "Player") {
  const humanPlayer = new Player(name, "human");
  const computerPlayer = new ComputerPlayer();
  humanPlayer.opponent = computerPlayer;
  computerPlayer.opponent = humanPlayer;
  return [humanPlayer, computerPlayer];
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

export { placeRandomShips, makePlayers };
