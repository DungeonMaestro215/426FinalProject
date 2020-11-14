export default class Projectile {
    sprite;
    x;
    y;
    vx;
    vy;
    source;

    constructor(sprite, x,y,vx,vy, damage, source) {
        this.sprite = sprite;
        this.x=x;
        this.y=y;
        this.vy=vy;
        this.vx=vx;
        this.has_collided = false;
        this.damage = damage;
        this.source = source;
        this.type = 'normal';       // Placeholder for now. Can maybe be 'piercing,' 'fire,' etc...
    }

    draw = (ctx) =>  {
        // ctx.fillStyle = 'rgba(0, 0, 0, 1)';     // Color projectiles black
        // ctx.fillRect(this.x, this.y, 5, 5);
        ctx.drawImage(this.sprite, this.x, this.y, 10, 10);
    }

    move = () => {
        this.x += this.vx;
        this.y += this.vy;
    }
}