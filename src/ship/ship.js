export default class Ship {
  constructor(type, position) {
    this.name = type.name;
    this.size = type.size;
    this.hits = [];
    this.position = position;
  }
  hit(pos) {
    this.hits.push(pos);
  }
  isSunk() {
    return this.position.every((p) => this.hits.includes(p));
  }
}
