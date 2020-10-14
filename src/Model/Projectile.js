export default class Projectile {
    x;
    y;
    vx;
    vy;

    constructor(x,y,vx,vy) {
        this.x=x;
        this.y=y;
        this.vy=vy;
        this.vx=vx;
    }

    draw = (ctx) =>  {
        ctx.fillRect(this.x, this.y, 5, 5);
    }

    move = () => {
        this.x += this.vx;
        this.y += this.vy;
    }
}