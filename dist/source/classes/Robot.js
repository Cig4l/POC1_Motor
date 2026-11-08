export class Robot {
    constructor(id, x, y, energy) {
        this.hp = 100;
        this.id = id;
        this.x = x;
        this.y = y;
        this.energy = energy;
    }
    getId() {
        return this.id;
    }
    setId(id) {
        this.id = id;
    }
    getX() {
        return this.x;
    }
    setX(x) {
        this.x = x;
    }
    getY() {
        return this.y;
    }
    setY(y) {
        this.y = y;
    }
    getHp() {
        return this.hp;
    }
    setHp(hp) {
        this.hp = hp;
    }
    getEnergy() {
        return this.hp;
    }
    setEnergy(hp) {
        this.hp = hp;
    }
}
