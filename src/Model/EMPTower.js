import Projectile from "./Projectile.js";
import Tower from "./Tower.js";

export default class EMPTower extends Tower {
    constructor(x, y) {
        super("../images/teslacoil.png", 'Tesla Coil', x, y, "AOE", 10);
        this.range = 100;
        this.damage = 1;
        this.fire_rate = .5;
        this.bullet_v = 5;
    }

    createProjectile(enemies) {
        if (enemies.length < 1) {
            return;
        }

        // Are there enemies in tower range?
        const [target, min_d] = this.selectTarget(enemies);
        if (target == undefined) {
            return;
        }

        // Fire Several projectiles in a circle around the tower
        const num_projectiles = 8;
        const proj_angle = 2 * Math.PI / num_projectiles;
        const bullet_vxs = [];
        const bullet_vys = [];
        for (let i = 0; i < num_projectiles; i++) {
            const bullet_vx = this.bullet_v * Math.cos(i * proj_angle);
            const bullet_vy = this.bullet_v * Math.sin(i * proj_angle);
            bullet_vxs.push(bullet_vx);
            bullet_vys.push(bullet_vy);
        }

        const proj_size = 25;
        const proj_img = new Image();
        proj_img.src = "../images/lightning.png";

        // Generate one projectile for each direction
        return bullet_vxs.map((vx, idx) => {
            return new Projectile(proj_img, proj_size, this.x + this.size / 3, this.y, vx, bullet_vys[idx], this.damage, this.range, this);
        });
    }

    upgrade() {
        this.upgradeCounter++;
        if (this.upgradeCounter >= 1) {
            this.upgrade_cost += 20;
        }
        this.level++;
        this.damage += 1;
        // Fix weird issues with decimals
        // this.damage = Math.round(this.damage * 10) / 10;

    }
}