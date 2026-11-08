import { Game } from "./classes/Game.js";
import data from "./poc1-init.json" with { type: "json" };
console.log(data);
let game = new Game(data);
console.log(game.getRange());
console.log(game.getRobots().get("A")?.getEnergy());
