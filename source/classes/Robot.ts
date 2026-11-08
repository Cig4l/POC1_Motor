export class Robot {
    private id : string;
    private x : number;
    private y : number;
    private hp : number = 100;
    private energy : number;

    public constructor(id : string, x : number, y : number, energy : number) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.energy = energy;
    }

    public decrementEnergy() : void {
        this.energy = this.energy--;
    }

    public loseHp(lostHp : number) : void {
        if(this.hp - lostHp < 0) {
            this.hp = 0
        } else {
            this.hp = this.hp - lostHp;
        }
    }

    public getId() : string {
        return this.id;
    }

    public setId(id : string) : void {
        this.id = id;
    }

    public getX() : number {
        return this.x;
    }

    public setX(x : number) : void {
        this.x = x;
    }

    public getY() : number {
        return this.y;
    }

    public setY(y : number) : void {
        this.y = y;
    }

    public getHp() : number {
        return this.hp;
    }

    public setHp(hp : number) : void {
        this.hp = hp;
    }

    public getEnergy() : number {
        return this.hp;
    }

    public setEnergy(hp : number) : void {
        this.hp = hp;
    }
}