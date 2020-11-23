export default class Projectile {
    sprite;
    x;
    y;
    vx;
    vy;
    source;
    size;
    distance = 0;
    angle = 0;
    range;

    constructor(sprite, size, x,y,vx,vy, damage, range, source) {
        this.sprite = sprite;
        this.size = size;
        this.x=x;
        this.y=y;
        this.vy=vy;
        this.vx=vx;
        this.angle = Math.atan(vy/vx);
        this.has_collided = false;
        this.damage = damage;
        this.range = range;
        this.source = source;
        this.type = 'normal';       // Placeholder for now. Can maybe be 'piercing,' 'fire,' etc...
    }

    draw = (ctx) =>  {
        ctx.drawImage(this.sprite, this.x, this.y, this.size, this.size);
    }

    move = () => {
        this.x += this.vx;
        this.y += this.vy;
        this.distance += Math.sqrt(this.vx**2 + this.vy**2);
    }
}