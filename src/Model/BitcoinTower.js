import Projectile from "./Projectile.js";
import Tower from "./Tower.js";

export default class BitcoinTower extends Tower {
    constructor(x, y) {
        super("../images/bitcoinMiner.png", 'Bitcoin Rig', x, y, "miner", 5);
        this.range = this.size;
        this.damage = 5;
        this.fire_rate = .1;
        this.description = 'Farms some coin for ya, but watch out... Those professors have some grubby mitts.';
        this.cost = 250;
    }

    // Create a bitcoin
    createProjectile() {
        let bullet_vx = 0;
        let bullet_vy = -this.bullet_v;

        const proj_size = 10;
        const proj_img = new Image();
        proj_img.src = "../images/bitcoin.png"; 
        return [new Projectile(proj_img, proj_size, this.x + this.size / 2, this.y + this.size / 2,
            bullet_vx, bullet_vy, this.damage / 5, this.range / 2, this)];
    }

    upgrade() {
        this.sell += this.upgrade_cost / 2;
        this.sell = Math.ceil(this.sell);
        this.upgrade_cost *= 2;
        this.level++;
        this.damage += 5;
    }

    renderTowerInfo() {
        const info = document.createElement('div');
        info.innerHTML = `<p>Tower: ${this.name}</p><p>Level: ${this.level}</p><p>Bitcoin Value: ${this.damage}</p>`;
        return info;
    }

    renderSalesPitch() {
        const info = document.createElement('div');
        info.innerHTML = `<p>Tower: ${this.name}</p><p>Cost: ${this.cost}</p><p>Rate: ${this.fire_rate}</p><p>Bitcoin Value: ${this.damage}</p>`;
        return info;
    }
}