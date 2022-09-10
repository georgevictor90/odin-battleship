export default class Ship {
  constructor(type, head, orientation) {
    this.name = type.name;
    this.size = type.size;
    this.orientation = orientation;
    this.hits = [];
    this.head = head;
    this.position = [];
    this.setPos();
  }
  hit(pos) {
    let found = false;

    this.position.forEach((p) => {
      if (pos[0] === p[0] && pos[1] === p[1]) {
        found = true;
      }
    });

    if (found) {
      this.hits.push(pos);
    }
  }

  isSunk() {
    if (this.position.length !== this.hits.length) {
      return false;
    }
    return true;
  }

  setPos() {
    if (!this.orientation) throw new Error("No ship orientation specified");
    this.position.push(this.head);
    if (this.orientation === "horizontal") {
      for (let i = 1; i < this.size; i++) {
        this.position.push([this.head[0] + i, this.head[1]]);
      }
    } else if (this.orientation === "vertical") {
      for (let i = 1; i < this.size; i++) {
        this.position.push([this.head[0], this.head[1] + i]);
      }
    }
  }
}
