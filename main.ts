import { Game } from "./classes/Game.js";
import data from "./poc1-init.json" with { type: "json" }
import * as readline from 'node:readline';
import { stdin, stdout } from 'node:process';

console.log(data);
let game : Game = new Game(data)
console.log(game.getRange());
console.log(game.getRobots().get("A")?.getEnergy());

