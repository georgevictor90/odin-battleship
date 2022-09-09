import { internalIP } from "webpack-dev-server";
import Ship from "./ship";
import shipTypes from "./shipTypes";

describe("ship object", () => {
  let carrier;
  let destroyer;
  beforeEach(() => {
    carrier = new Ship(shipTypes.carrier, [1, 2, 3]);
    destroyer = new Ship(shipTypes.destroyer, [1, 2, 3]);
  });
  it("should have correct properties", () => {
    expect(carrier.name).toBe("carrier");
    expect(carrier.size).toBe(5);
    expect(carrier.position).toEqual([1, 2, 3]);
  });

  it("should take a hit", () => {
    carrier.hit(2);
    expect(carrier.hits).toEqual([2]);
  });

  it("should take multiple hits", () => {
    destroyer.hit(1);
    destroyer.hit(2);
    destroyer.hit(3);
    expect(destroyer.hits).toEqual([1, 2, 3]);
  });

  it("should show the boat is sunk", () => {
    destroyer.hit(1);
    destroyer.hit(2);
    destroyer.hit(3);
    expect(destroyer.isSunk()).toBe(true);
  });

  it("should show the boat is not sunk", () => {
    destroyer.hit(1);
    destroyer.hit(2);
    expect(destroyer.isSunk()).toBe(false);
  });
});
