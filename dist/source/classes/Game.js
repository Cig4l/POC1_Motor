import { isWorldConfig } from "../types/WorldInit.js";
import { Grid } from "./Grid.js";
import { Robot } from "./Robot.js";
export class Game {
    constructor(file) {
        this.robots = new Map();
        this.range = 25;
        if (!isWorldConfig(file)) {
            throw new Error("Invalid world configuration");
        }
        this.grid = new Grid(file.world.w, file.world.h);
        this.move_speed = file.move_speed;
        this.initRobots(file.robots);
    }
    execute(input) {
        switch (input) {
            case "Hello":
                console.log("World");
                break;
        }
    }
    initRobots(robots) {
        if (!Array.isArray(robots)) {
            throw new Error("No list of robots in init file");
        }
        if (robots.length < 2) {
            throw new Error("Not enough robots to init the game : " + robots.length);
        }
        robots.forEach((robot) => {
            this.robots.set(robot.id, new Robot(robot.id, robot.x, robot.y, robot.energy));
        });
    }
    getMoveSpeed() {
        return this.move_speed;
    }
    setMoveSpeed(move_speed) {
        this.move_speed = move_speed;
    }
    getRange() {
        return this.range;
    }
    setRange(range) {
        this.range = range;
    }
    getGrid() {
        return this.grid;
    }
    setGrid() {
        this.grid = this.grid;
    }
    getRobots() {
        return this.robots;
    }
}
