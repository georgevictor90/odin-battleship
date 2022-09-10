import shipTypes from "../ship/shipTypes";
import Gameboard from "./gameboard";
import Ship from "../ship/ship";

describe("gameboard", () => {
  let gameboard;
  beforeEach(() => {
    gameboard = new Gameboard();
  });

  it("should return an array of length 10", () => {
    expect(gameboard.spaces.length).toEqual(10);
  });

  it("should should have rows of length 10", () => {
    expect(gameboard.spaces[0].length).toEqual(10);
  });

  it("should place a ship on board", () => {
    gameboard.placeShip([3, 4], shipTypes.destroyer, "horizontal");
    expect(gameboard.spaces[4][3]).toBe("D");
    expect(gameboard.spaces[4][4]).toBe("d");
    expect(gameboard.spaces[4][5]).toBe("d");
    expect(gameboard.spaces[4][6]).toBe(null);
    expect(gameboard.ships.length).toEqual(1);
  });

  it("should not place ships outside board", () => {
    expect(() => {
      gameboard.placeShip([8, 5], shipTypes.destroyer, "horizontal");
    }).toThrow("Outside Board horizontal");
    expect(() => {
      gameboard.placeShip([8, 7], shipTypes.carrier, "vertical");
    }).toThrow("Outside Board vertical");
  });

  it("should receive attack", () => {
    gameboard.placeShip([3, 4], shipTypes.destroyer, "horizontal");
    gameboard.receiveAttack([5, 2]);
    gameboard.receiveAttack([3, 4]);
    expect(gameboard.spaces[2][5]).toBe("miss");
    expect(gameboard.spaces[4][3]).toBe("D hit");
  });

  it("should correctly report if all ships are sunk", () => {
    gameboard.placeShip([3, 4], shipTypes.destroyer, "horizontal");
    gameboard.placeShip([8, 1], shipTypes.carrier, "vertical");
    gameboard.receiveAttack([3, 4]);
    gameboard.receiveAttack([4, 4]);
    gameboard.receiveAttack([5, 4]);
    gameboard.receiveAttack([8, 1]);
    gameboard.receiveAttack([8, 2]);
    gameboard.receiveAttack([8, 3]);
    gameboard.receiveAttack([8, 4]);
    gameboard.receiveAttack([8, 5]);
    expect(gameboard.allSunk()).toBe(true);
  });
});
