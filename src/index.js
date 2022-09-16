import "./styles.css";
import { makePlayers, placeRandomShips } from "./gameLogic/gameLogic.js";
import renderGameBoards from "./domStuff/domStuff";

const players = makePlayers("Victor");
renderGameBoards(players);
placeRandomShips(players);
