export class Grid {
    private w : number;
    private h : number;

    public constructor(w:number, h:number) {
        this.w = w;
        this.h = h;
    }

    public getW() : number {
        return this.w;
    }

    public setW(w : number) : void {
        this.w = w;
    }

    public getH() : number {
        return this.h;
    }

    public setH(h : number) : void {
        this.h = h;
    }
}