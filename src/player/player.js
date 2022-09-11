import Gameboard from "../gameboard/gameboard";

export class Player {
  constructor(name, type) {
    this.name = name;
    this.type = type;
    this.turn = false;
    this.opponent = null;
    this.gameboard = new Gameboard();
  }
  attack(coords) {
    if (!this.opponent) return;
    this.opponent.gameboard.receiveAttack(coords);
  }
}

export class ComputerPlayer extends Player {
  name = "CPU";
  type = "AI";
  randomAttack() {
    this.attack(this.#getRandomCoords());
  }

  #getRandomCoords() {
    let x = this.#getRandomIntInclusive(0, 9);
    let y = this.#getRandomIntInclusive(0, 9);
    if (this.opponent.gameboard.spaces[y][x] === null) {
      return [x, y];
    } else {
      this.#getRandomCoords();
    }
  }

  // From MDN docs
  #getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }
}
