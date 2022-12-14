import { Player, ComputerPlayer } from "../player/player";
import shipTypes from "../ship/shipTypes";
import { getRandomIntInclusive } from "../helpers";
import {
  markHit,
  markMiss,
  renderSunkShips,
  renderCPUAttack,
  declareWinner,
} from "../domStuff/domStuff";

function placeRandomShips(players) {
  let x, y, z;
  let orientations = ["horizontal", "vertical"];

  players.forEach((p) => {
    //For each type of ship generate random valid coordinates
    for (const key in shipTypes) {
      do {
        x = getRandomIntInclusive(0, 9);
        y = getRandomIntInclusive(0, 9);
        z = getRandomIntInclusive(0, 1);
      } while (
        !isValidPosition([x, y], shipTypes[key], orientations[z], p.gameboard)
      );
      //and then store the ships positions in player gameboard
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
    //ship outside board
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
    //ship outside board
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

function checkWin(playerBoard) {
  if (playerBoard.allSunk()) {
    return true;
  } else return false;
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
      cpuAttack(opponent);
    }, 1000);
  }
}

// function cpuAttacksHuman(cpuPlayer, targetStatus = "") {
//   do {
//     let cpuAttackCoords = cpuPlayer.randomAttack();
//     targetStatus = renderCPUAttack(cpuPlayer, cpuAttackCoords, targetStatus);

//     if (targetStatus === "missed") return;

//     renderSunkShips(cpuPlayer.opponent);
//     let gameOver = checkWin(cpuPlayer.opponent.gameboard);
//     if (gameOver !== false) declareWinner(cpuPlayer);

//     setTimeout(() => {
//       cpuAttacksHuman(cpuPlayer, targetStatus);
//     }, 1000);

//     targetStatus = "missed";
//   } while (targetStatus !== "missed");
// }

let orientation = "";
let visited = [];
let stack = [];
let hitCoords = [];
const adjacentsByOrientation = {
  horizontal: [],
  vertical: [],
};

function cpuAttack(cpuPlayer) {
  let humanBoard = cpuPlayer.opponent.gameboard;

  if (hitCoords.length === 0) {
    hunt(cpuPlayer, humanBoard);
  } else {
    target(cpuPlayer, humanBoard);
  }
}

function target(cpuPlayer, humanBoard, targetStatus = "") {
  if (stack.length === 0) {
    addAdjacentsToStack();
  }
  let newTarget = stack.pop();
  cpuPlayer.attack(newTarget);
  visited.push(newTarget.toString());
  targetStatus = renderCPUAttack(cpuPlayer, newTarget, targetStatus);

  if (targetStatus === "missed") return;
  handleHit(cpuPlayer, humanBoard, newTarget);
}

function addAdjacentsToStack() {
  let x = hitCoords[0];
  let y = hitCoords[1];
  let adjacents = [];

  if (orientation === "horizontal") {
    adjacents = [
      [x + 1, y],
      [x - 1, y],
    ];
  }
  if (orientation === "vertical") {
    adjacents = [
      [x, y + 1],
      [x, y - 1],
    ];
  }
  if (orientation === "") {
    adjacents = [
      [x + 1, y],
      [x - 1, y],
      [x, y - 1],
      [x, y + 1],
    ];
  }

  //check if adjacents outside board
  adjacents.forEach((coord) => {
    coord.forEach((index) => {
      if (index < 0 || index > 9) {
        // remove coord from adjacents
        let i = adjacents.indexOf(coord);
        adjacents.splice(i, 1);
      }
    });
  });

  //if not visited already, push to stack
  adjacents.forEach((coord) => {
    if (visited.includes(coord.toString())) return;
    if (coord[0] === x) {
      adjacentsByOrientation.vertical.push(coord.toString());
    } else if (coord[1] === y) {
      adjacentsByOrientation.horizontal.push(coord.toString());
    }

    stack.push(coord);
  });
}

function hunt(cpuPlayer, humanBoard, targetStatus = "") {
  let coords = cpuPlayer.randomAttack(visited);
  visited.push(coords.toString());
  targetStatus = renderCPUAttack(cpuPlayer, coords, targetStatus);
  if (targetStatus === "missed") return;
  handleHit(cpuPlayer, humanBoard, coords);
}

function resetVariables() {
  visited = [];
  stack = [];
  hitCoords = [];
  orientation = "";
}

function handleHit(cpuPlayer, humanBoard, coords) {
  if (coords[0] === hitCoords[0]) {
    orientation = "vertical";
  } else if (coords[1] === hitCoords[1]) {
    orientation = "horizontal";
  }

  if (orientation === "horizontal") {
    //remove vertical adjacents from stack
    stack.forEach((item) => {
      if (coords[1] !== item[1]) {
        let i = stack.indexOf(item);
        stack.slice(i, 1);
      }
    });
  } else if (orientation === "vertical") {
    //remove horizontal adjacents from stack
    stack.forEach((item) => {
      if (coords[0] !== item[0]) {
        let i = stack.indexOf(item);
        stack.slice(i, 1);
      }
    });
  }
  hitCoords = coords;

  let keys = Object.keys(adjacentsByOrientation);
  keys.forEach((key) => {
    if (adjacentsByOrientation[key].includes(hitCoords.toString())) {
      let index = keys.indexOf(key);
      keys.splice(index, 1);
    }
  });

  adjacentsByOrientation[keys[0]].forEach((adj) => {
    stack.forEach((coord) => {
      if (adj[0] === coord[0] && adj[1] === coord[1]) {
        stack.splice(stack.indexOf(coord), 1);
      }
    });
  });

  /////
  renderSunkShips(cpuPlayer.opponent);
  if (checkWin(humanBoard) === true) {
    resetVariables();
    declareWinner(cpuPlayer);
    return;
  }
  addAdjacentsToStack();
  //get ship
  let shipInitial = humanBoard.spaces[hitCoords[1]][hitCoords[0]].charAt(0);

  let ship = humanBoard.ships.find(
    (s) => s.name.charAt(0) === shipInitial.toLowerCase()
  );

  //is it sunk?
  if (ship.isSunk() === true) {
    //if yes empty stack and clear hitCoord
    stack = [];
    hitCoords = [];
    orientation = "";
    let reserved = cpuPlayer.opponent.gameboard.handleReservedSpaces(
      ship,
      "cpu"
    );
    reserved.forEach((space) => visited.push(space.toString()));
  }
  setTimeout(() => {
    cpuAttack(cpuPlayer);
  }, 1000);
}

export {
  placeRandomShips,
  makePlayers,
  playRound,
  checkWin,
  handleAttackFromHuman,
  isValidPosition,
};
