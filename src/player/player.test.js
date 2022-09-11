import { Player, ComputerPlayer } from "./player";

describe("Player", () => {
  let player;
  let enemy;

  beforeEach(() => {
    player = new Player("Victor", "human");
    enemy = new ComputerPlayer();
    player.opponent = enemy;
    enemy.opponent = player;
  });
  it("should return an object with correct key value pairs", () => {
    expect(player.name).toBe("Victor");
    expect(player.type).toBe("human");
    expect(Array.isArray(player.gameboard.spaces)).toBe(true);
  });
  it("should attack opponent board, marking spaces on enemy board", () => {
    player.attack([3, 4]);
    expect(enemy.gameboard.spaces[4][3]).toBe("miss");
  });
});

describe("CPU player", () => {
  let cpu;
  let human;

  beforeEach(() => {
    human = new Player("Jack", "human");
    cpu = new ComputerPlayer();
    human.opponent = cpu;
    cpu.opponent = human;
  });

  it("should hit a random spot on enemy gameboard", () => {
    cpu.randomAttack();
    let found = [];
    human.gameboard.spaces.forEach((row) => {
      let bingo = row.find((spot) => spot === "miss");
      if (bingo !== undefined) found.push(bingo);
    });
    expect(found.length).toStrictEqual(1);
  });
});
