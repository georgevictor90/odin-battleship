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
      cpuAttacksHuman(opponent);
    }, 500);
  }
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

export {
  placeRandomShips,
  makePlayers,
  playRound,
  checkWin,
  handleAttackFromHuman,
};
