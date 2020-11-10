export default class Projectile {
    x;
    y;
    vx;
    vy;

    constructor(x,y,vx,vy, damage) {
        this.x=x;
        this.y=y;
        this.vy=vy;
        this.vx=vx;
        this.has_collided = false;
        this.damage = damage;
        this.type = 'normal';       // Placeholder for now. Can maybe be 'piercing,' 'fire,' etc...
    }

    draw = (ctx) =>  {
        ctx.fillStyle = 'rgba(0, 0, 0, 1)';     // Color projectiles black
        ctx.fillRect(this.x, this.y, 5, 5);
    }

    move = () => {
        this.x += this.vx;
        this.y += this.vy;
    }
}