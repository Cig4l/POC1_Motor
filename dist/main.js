import data from "../data/poc1-init.json" with { type: "json" };
import { Game } from "./classes/Game.js";
import { stdin, stdout } from 'node:process';
import { createInterface } from "node:readline/promises";
let game = new Game(data);
// console.log(data);
// console.log(game.getRange());
// console.log(game.getRobots().get("A")?.getEnergy());
const rl = createInterface({
    input: stdin,
    output: stdout
});
while (!game.hasEnded()) {
    const input = await rl.question("> ");
    if (input == "quit") {
        break;
    }
    game.execute(input);
}
rl.close();
process.exit(0);
