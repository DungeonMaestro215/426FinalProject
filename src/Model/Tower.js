import Projectile from "./Projectile.js";



export default class Tower {
    sprite;
    x;
    y;
    targetType;
    bullet_v = 10;

    constructor(sprite, x, y, targetType, bulletVelocity) {
        this.sprite = sprite;
        this.x = x;
        this.y = y;
        this.targetType = targetType;
        this.bullet_v = bulletVelocity;
    }

    //logic tower uses to choose which enemy to shoot at
    selectTarget(enemies) {
        let min_d = Number.MAX_SAFE_INTEGER;
        let target = enemies[0];

        for (let enemy of enemies) {
            let dx = enemy.x - this.x;
            let dy = enemy.y - this.y;
            let d = Math.sqrt(dx ** 2 + dy ** 2);
            if (d < min_d) {
                min_d = d;
                target = enemy;
            }
        }

        return [target, min_d];
    }

    //returns a projectile object aimed at enemy chosen by the tower
    createProjectile(enemies, enemyPath) {
        if (enemies.length < 1) {
            return;
        }

        // Which enemy should the tower shoot at?
        const [target, min_d] = this.selectTarget(enemies);

        //predict where the target is gonna be when the projectile gets there
        let adx =
            target.x +
            target.getVx(enemyPath) *
            1.33 *
            (min_d / this.bullet_v) -
            this.x;
        let ady =
            target.y +
            target.getVy(enemyPath) *
            1.33 *
            (min_d / this.bullet_v) -
            this.y;
        let atan = Math.atan(ady / adx);

        //assign velocities
        let bullet_vx = this.bullet_v * Math.cos(atan) * Math.sign(adx);
        let bullet_vy = this.bullet_v * Math.sin(atan) * Math.sign(adx);

        return new Projectile(this.x, this.y, bullet_vx, bullet_vy);
    }
}