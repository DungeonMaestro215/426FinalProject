import Projectile from "./Projectile.js";

export default class Tower {
    sprite;
    name;
    cost = 50;
    upgrade_cost = 75;
    sell = 20;
    size = 55;
    x;
    y;
    targetType;
    bullet_v = 10;
    range = 150;
    level = 1;
    damage = .5;
    fire_rate = 1;
    kills = 0;
    proj_size = 10
    special_upgrades = [];
    description = '';
    moneySpent = 0;
    get_bullet_sprite = () => "../images/bubble.webp";

    constructor(sprite, name, x, y, targetType, bulletVelocity) {
        this.sprite = sprite;
        this.name = name;
        this.x = x;
        this.y = y;
        this.targetType = targetType;
        this.bullet_v = bulletVelocity;
    }

    applyUpgrade(upgrade) {
        upgrade.effect();
    }

    //logic tower uses to choose which enemy to shoot at
    selectTarget(enemies) {
        let min_d = Number.MAX_SAFE_INTEGER;
        let target;

        for (let enemy of enemies) {
            let dx = enemy.x - this.x - this.size/2;
            let dy = enemy.y - this.y - this.size/2;
            let d = Math.sqrt(dx ** 2 + dy ** 2);
            if (d < min_d && d < this.range) {
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
        if (target == undefined) {
            return;
        }

        //predict where the target is gonna be when the projectile gets there
        let adx =
            (target.x - target.size)+
            (target.getVx(enemyPath)) *
            (min_d / this.bullet_v) -
            this.x;
        let ady =
            (target.y - target.size)+
            target.getVy(enemyPath) *
            (min_d / this.bullet_v) -
            this.y;
        let atan = Math.atan(ady / adx);

        //assign velocities
        let bullet_vx = this.bullet_v * Math.cos(atan) * Math.sign(adx);
        let bullet_vy = this.bullet_v * Math.sin(atan) * Math.sign(adx);

        const proj_img = new Image();
        proj_img.src = this.get_bullet_sprite();
        return [new Projectile(proj_img, this.proj_size, this.x + this.size / 2, this.y + this.size / 2, bullet_vx, bullet_vy, this.damage, Number.MAX_SAFE_INTEGER, this)];
    }

    upgrade() {
        this.sell += this.upgrade_cost / 2;
        this.sell = Math.ceil(this.sell);
        this.upgrade_cost += this.upgrade_cost;
        this.level++;
        this.damage += 1;
    }

    clickHandler(x, y) {
        return x > this.x &&
            x < this.x + this.size &&
            y > this.y &&
            y < this.y + this.size;
    }

    drawRange(ctx) {
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255, 255, 255, .5)';
        ctx.arc(this.x + this.size / 2, this.y + this.size / 2, this.range, 0, 2 * Math.PI, false);
        ctx.fill();
    }

    renderTowerInfo() {
        const info = document.createElement('div');
        info.innerHTML = `<p>Tower: ${this.name}</p><p>Level: ${this.level}</p><p>Eliminations: ${this.kills}</p><p>Damage: ${this.damage}</p>`;
        return info;
    }

    renderSalesPitch() {
        const info = document.createElement('div');
        info.innerHTML = `<p>Tower: ${this.name}</p><p>Cost: ${this.cost}</p><p>Damage: ${this.damage}</p><p>Fire Rate: ${this.fire_rate}</p><p>Desc: ${this.description}</p>`;
        return info;
    }

    increaseKills() {
        this.kills++;
    }
}