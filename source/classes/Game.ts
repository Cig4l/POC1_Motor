import { isRobot, isWorldConfig } from "../types/WorldInit.js";
import { Robot } from "./Robot.js";
import { Command } from "../types/Command.js"
import { readFileSync, writeFileSync } from "node:fs";

export class Game {
    private width : number;
    private height : number;
    private robots : Map<string, Robot> = new Map();
    private moveSpeed : number;
    private range : number = 25;
    private seq : number = 0;
    private logsPath = "./data/logs.json";

    public constructor(file : any) {
        if (!isWorldConfig(file)) {
            throw new Error("Invalid world configuration");
        }

        this.clearLogs();
        
        this.width = file.world.w;
        this.height = file.world.h;
        this.moveSpeed = file.move_speed;

        this.initRobots(file.robots);
    }

    public execute(input : string) : void {
        const command : Command|null = this.parseCommand(input);
        
        if(!this.validateCommand(command)) return;
        if(command == null) return;

        switch(command.action) {
            case("MINE"):
                this.resolveMine(command.id);
                break;
            case("MOVE"):
                if(command.value == null) throw new Error("Radian required");
                this.resolveMove(command.id, command.value);
                break;
            case("SHOOT"):
                if(command.value == null) throw new Error("Radian required");
                this.resolveShoot(command.id, command.value);
                break;
        }
    }

    public hasEnded() : boolean {
        for (const robot of this.robots.values()) {
            if (robot.getEnergy() <= 0 || robot.getHp() <= 0) {
                const winner = this.getEnemyRobot(robot.getId());

                if(!winner) throw new Error("Game ended but no winner");

                const log = {
                    seq: this.seq,
                    type: "GAME_ENDED",
                    winner: winner.getId()
                }
                this.writeLogs(log);
                return true;
            }
        }
        return false;
    }

    private resolveShoot(shooterId:string, radian:number) : void {
        const shooter = this.robots.get(shooterId);
        if(!shooter) throw new Error("Shoot Action but no shooter found");

        const enemy = this.getEnemyRobot(shooter.getId());
        console.log("ENEMY ID : " + enemy.getId());

        for(let i : number = 0; i<this.range; i++) {
            let x : number = this.calculateNewX(shooter.getX(), i+1);
            let y : number = this.calculateNewY(shooter.getY(), i+1);

            if(x == enemy.getX() && y == enemy.getY()) {
                console.log("robot shot");
                let shotLog = {
                    seq: this.seq,
                    type: "ROBOT_SHOT",
                    robot: shooter.getId(),
                    angle: radian,
                    hit: enemy.getId()
                }

                this.writeLogs(shotLog);
                this.incrementSeq();
                enemy.loseHp(25);
                shooter.decrementEnergy();

                let damagedLog = {
                    seq: this.seq,
                    type: "ROBOT_DAMAGED",
                    robot: enemy.getId(),
                    hp: enemy.getHp()
                }

                this.writeLogs(damagedLog);
                this.incrementSeq();
                break;
            }
        }
    }

    private resolveMove(id:string, radian:number) : void {
        let robot = this.robots.get(id);

        if(!robot) {
            throw new Error("No robot while trying to resolve move");
        }

        let newX = this.calculateNewX(robot.getX(), radian);
        let newY = this.calculateNewY(robot.getY(), radian);

        if(newX < 1) {
            newX = 1.0;
        }
        if(newY < 1) {
            newY = 1.0;
        }
        if(newX > this.width) {
            newX = this.width;
        }
        if(newY > this.height) {
            newY = this.height
        }

        const log = {
            seq: this.seq,
            type: "ROBOT_MOVED",
            robot: id,
            x: newX,
            y: newY
        }

        this.writeLogs(log);

        this.incrementSeq();
        robot.setX(newX);
        robot.setY(newY);
        robot.decrementEnergy();
    }

    private resolveMine(id : string) : void {
        const log = {
            seq: this.seq,
            type: "ACTION_REJECTED",
            robot: id,
            reason: "NO_CRYSTAL"
        }

        this.writeLogs(log);
        this.incrementSeq();
        this.robots.get(id)?.decrementEnergy();
    }

    private getEnemyRobot(currentRobotId : string) : Robot {
        const enemy : Robot|undefined = [...this.robots.values()]
            .find(r => r.getId() !== currentRobotId);

        if(!enemy) throw new Error("No enemy robot");

        return enemy;
    }

    private calculateNewX(x : number, radian : number) : number {
        return Math.round((x + this.moveSpeed * Math.cos(radian)) * 10) / 10;
    }

    private calculateNewY(y : number, radian : number) : number {
        return Math.round((y + this.moveSpeed * Math.sin(radian)) * 10) / 10;
    }

    private writeLogs(log : any) : void {
        const data = JSON.parse(readFileSync(this.logsPath, "utf-8"));
        data.logs.push(log);
        writeFileSync(this.logsPath, JSON.stringify(data, null, 4), "utf-8");
    }

    private validateCommand(command: Command|null) : boolean {
        if(command == null) {
            return false;
        }    

        if (!this.robots.has(command.id)) {
            console.log("Input invalide : robot inexistant");
            return false;
        }
        if(
            command.action !== "MOVE" && 
            command.action !== "SHOOT" &&
            command.action !== "MINE"
        ) {
            console.log("Input invalide : action inexistante");
            return false;
        }
        if(command.action == "MOVE" || command.action == "SHOOT") {
            if(command.value == null) {
                console.log("Input invalide : radian nécessaire");
                return false;
            }
        }
        if(command.action == "MINE") {
            if(command.value !== null) {
                console.log("Input invalide : l'action MINE n'a pas besoin de radian");
            }
        }
        return true;
    }

    private parseCommand(input: string): Command|null {
        const parts = input.trim().split(" ");

        if(parts.length > 3 || parts.length < 2) {
            console.log("Input invalide : commande doit avoir 2 à 3 mots");
            return null;
        }

        const [id, action, rawValue] = parts;

        if (rawValue !== undefined && !Number.isFinite(Number(rawValue))) {
            console.log("Input invalide : value doit être un chiffre");
            return null;
        }

        return {
            id,
            action,
            value: rawValue ? Number(rawValue) : null
        };
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

    private clearLogs() : void {
        const data = JSON.parse(readFileSync(this.logsPath, "utf-8"));
        data.logs = [];

        writeFileSync(this.logsPath, JSON.stringify(data, null, 4), "utf-8");
    }

    private incrementSeq() : void {
        this.seq = this.seq++;
    }

    public getMoveSpeed() : number {
        return this.moveSpeed;
    }

    public setMoveSpeed(move_speed : number) : void {
        this.moveSpeed = move_speed;
    }

    public getRange() : number {
        return this.range;
    }

    public setRange(range : number) : void {
        this.range = range;
    }

    public getRobots() : Map<string, Robot> {
        return this.robots;
    }
}