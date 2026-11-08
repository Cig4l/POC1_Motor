import { isRobot, isWorldConfig } from "../types/WorldInit.js";
import { Grid } from "./Grid.js";
import { Robot } from "./Robot.js";

export class Game {
    private grid : Grid;
    private robots : Map<string, Robot> = new Map();
    private move_speed : number;
    private range : number = 25;

    public constructor(file : unknown) {
        if (!isWorldConfig(file)) {
            throw new Error("Invalid world configuration");
        }
        
        this.grid = new Grid(file.world.w, file.world.h);
        this.move_speed = file.move_speed;

        this.initRobots(file.robots);
    }

    private initRobots(robots : unknown) {
        if(!Array.isArray(robots)) {
            throw new Error("No list of robots in init file"); 
        }

        if(robots.length < 2) {
            throw new Error("Not enough robots to init the game : " + robots.length)
        }

        robots.forEach((robot) => {
            this.robots.set(
                robot.id,
                new Robot(
                    robot.id,
                    robot.x,
                    robot.y,
                    robot.energy
                )
            );
        });
    }

    public getMoveSpeed() : number {
        return this.move_speed;
    }

    public setMoveSpeed(move_speed : number) : void {
        this.move_speed = move_speed;
    }

    public getRange() : number {
        return this.range;
    }

    public setRange(range : number) : void {
        this.range = range;
    }

    public getGrid() : Grid {
        return this.grid;
    }

    public setGrid() : void {
        this.grid = this.grid;
    }

    public getRobots() : Map<string, Robot> {
        return this.robots;
    }
}