import Projectile from "./Projectile.js";

const bullet_v = 10;

export default class Tower {
    sprite;
    x;
    y;
    targetType;

    constructor(sprite, x, y, targetType) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.targetType = targetType;
    }

    fire(target, min_d, enemyPath) {
        //predict where the target is gonna be when the projectile gets there
        let adx =
            target.x +
            target.getVx(enemyPath) *
            1.33 *
            (min_d / bullet_v) -
            this.x;
        let ady =
            target.y +
            target.getVy(enemyPath) *
            1.33 *
            (min_d / bullet_v) -
            this.y;
        let atan = Math.atan(ady / adx);

        //shoot projectile
        let bullet_vx = bullet_v * Math.cos(atan) * Math.sign(adx);
        let bullet_vy = bullet_v * Math.sin(atan) * Math.sign(adx);

        return new Projectile(this.x, this.y, bullet_vx, bullet_vy);
    }
}