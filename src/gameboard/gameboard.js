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
  placeShip(head, shipType, orientation, name) {
    let ship = new Ship(shipType, head, orientation);

    this.spaces[head[1]][head[0]] = ship.name.charAt(0).toUpperCase();

    ship.position.slice(1).forEach((p) => {
      this.spaces[p[1]][p[0]] = ship.name.charAt(0);
    });

    if (name !== "CPU") {
      ship.position.forEach((pos) => {
        if (document.getElementById(`${pos[0]},${pos[1]} ${name}`) === null) {
          return;
        } else {
          document
            .getElementById(`${pos[0]},${pos[1]} ${name}`)
            .classList.toggle("selected");
        }
      });
    }
    this.ships.push(ship);
    this.handleReservedSpaces(ship);
  }

  handleReservedSpaces(ship) {
    let unfiltered = this.unfilteredReservedSpaces(
      ship.position,
      ship.orientation
    );
    let filtered = this.filterReserved(unfiltered);
    this.markReservedOnGameboard(filtered);
  }

  receiveAttack(coords) {
    // debugger;
    // console.log(coords);
    let target = this.spaces[coords[1]][coords[0]];

    if (target === "miss") return;
    if (target === null || target === "r") {
      this.spaces[coords[1]][coords[0]] = "miss";
      this.targetsMissed.push([...coords]);
    } else {
      if (target.includes("hit")) return;
      //find the correct ship and call ship.hit();
      let shipInitial = this.spaces[coords[1]][coords[0]].charAt(0);

      let ship = this.ships.find(
        (s) => s.name.charAt(0) === shipInitial.toLowerCase()
      );
      ship.hit(coords);
      this.spaces[coords[1]][coords[0]] += " hit";
    }
    // console.table(this.spaces);
  }

  allSunk() {
    return this.ships.every((x) => x.isSunk() === true);
  }

  getSunkShips() {
    return this.ships.filter((ship) => ship.isSunk());
  }

  unfilteredReservedSpaces(positionsArray, orientation) {
    //store head and tail of a ship in variables
    const h = positionsArray[0];
    const t = positionsArray[positionsArray.length - 1];
    let topRow = [];
    let bottomRow = [];
    let leftCol = [];
    let rightCol = [];
    let result = [];

    if (orientation === "horizontal") {
      positionsArray.forEach((pos) => {
        let newPos = [pos[0], pos[1] - 1];
        topRow.push(newPos);
      });

      positionsArray.forEach((pos) => {
        let newPos = [pos[0], pos[1] + 1];
        bottomRow.push(newPos);
      });

      leftCol = [
        [h[0] - 1, h[1] - 1],
        [h[0] - 1, h[1]],
        [h[0] - 1, h[1] + 1],
      ];

      rightCol = [
        [t[0] + 1, t[1] - 1],
        [t[0] + 1, t[1]],
        [t[0] + 1, t[1] + 1],
      ];
    } else if (orientation === "vertical") {
      positionsArray.forEach((pos) => {
        let newPos = [pos[0] - 1, pos[1]];
        leftCol.push(newPos);
      });

      positionsArray.forEach((pos) => {
        let newPos = [pos[0] + 1, pos[1]];
        rightCol.push(newPos);
      });

      topRow = [
        [h[0] - 1, h[1] - 1],
        [h[0], h[1] - 1],
        [h[0] + 1, h[1] - 1],
      ];

      bottomRow = [
        [t[0] - 1, t[1] + 1],
        [t[0], t[1] + 1],
        [t[0] + 1, t[1] + 1],
      ];
    }

    result.push(topRow);
    result.push(bottomRow);
    result.push(leftCol);
    result.push(rightCol);
    return [...topRow, ...bottomRow, ...leftCol, ...rightCol];
  }

  filterReserved(unfilteredArray) {
    // console.log(unfilteredArray);
    let filtered = [];

    filtered = unfilteredArray.filter(
      (arr) => arr[0] >= 0 && arr[0] <= 9 && arr[1] >= 0 && arr[1] <= 9
    );
    // console.log(filtered);
    return filtered;
  }

  markReservedOnGameboard(filteredArray) {
    filteredArray.forEach((coord) => {
      if (this.spaces[coord[1]][coord[0]] !== null) {
        return;
      } else {
        this.spaces[coord[1]][coord[0]] = "r";
      }
    });
  }
}
