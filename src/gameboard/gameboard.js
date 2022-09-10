import Ship from "../ship/ship";
export default class Gameboard {
  constructor() {
    this.spaces = this.makeBoard();
    this.ships = [];
    this.targetsMissed = [];
  }
  makeBoard() {
    let rows = new Array(10);
    for (let i = 0; i < rows.length; i++) {
      rows[i] = new Array(10);
      for (let j = 0; j < rows[i].length; j++) {
        rows[i][j] = null;
      }
    }
    return rows;
  }
  placeShip(head, shipType, orientation) {
    if (orientation === "horizontal" && 10 - head[0] < shipType.size)
      throw new Error("Outside Board horizontal");

    if (orientation === "vertical" && 10 - head[1] < shipType.size)
      throw new Error("Outside Board vertical");

    let ship = new Ship(shipType, head, orientation);

    this.spaces[head[1]][head[0]] = ship.name.charAt(0).toUpperCase();

    ship.position.slice(1).forEach((p) => {
      this.spaces[p[1]][p[0]] = ship.name.charAt(0);
    });

    this.ships.push(ship);
  }

  receiveAttack(coords) {
    let target = this.spaces[coords[1]][coords[0]];

    if (target === "miss") return;
    if (target === null) {
      this.spaces[coords[1]][coords[0]] = "miss";
      this.targetsMissed.push([...coords]);
    } else {
      if (target.includes("hit")) return;
      //find the correct ship and call ship.hit();
      let shipInitial = this.spaces[coords[1]][coords[0]].charAt(0);

      let ship = this.ships.find(
        (s) => s.name.charAt(0) === shipInitial.toLowerCase()
      );
      // console.log(ship);
      ship.hit(coords);
      this.spaces[coords[1]][coords[0]] += " hit";
    }
  }

  allSunk() {
    return this.ships.every((x) => x.isSunk() === true);
  }
}
