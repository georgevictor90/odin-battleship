import { internalIP } from "webpack-dev-server";
import Ship from "./ship";
import shipTypes from "./shipTypes";

describe("ship object", () => {
  let carrier;
  let destroyer;
  beforeEach(() => {
    carrier = new Ship(shipTypes.carrier, [3, 4], "horizontal");
    destroyer = new Ship(shipTypes.destroyer, [4, 5], "horizontal");
  });
  it("should have correct properties", () => {
    expect(carrier.name).toBe("carrier");
    expect(carrier.size).toBe(5);
    expect(carrier.position).toEqual([
      [3, 4],
      [4, 4],
      [5, 4],
      [6, 4],
      [7, 4],
    ]);
  });

  it("should take a hit", () => {
    carrier.hit([3, 4]);
    carrier.hit([1, 2]);
    expect(carrier.hits).toEqual([[3, 4]]);
  });

  it("should take multiple hits", () => {
    destroyer.hit([4, 5]);
    destroyer.hit(2);
    destroyer.hit(3);
    expect(destroyer.hits).toEqual([[4, 5]]);
  });

  it("should show the boat is sunk", () => {
    destroyer.hit([4, 5]);
    destroyer.hit([5, 5]);
    destroyer.hit([6, 5]);
    expect(destroyer.isSunk()).toBe(true);
  });

  it("should show the boat is not sunk", () => {
    destroyer.hit([2, 2]);
    destroyer.hit([7, 8]);
    expect(destroyer.isSunk()).toBe(false);
  });
});
