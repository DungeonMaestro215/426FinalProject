import Tower from "./Tower.js";

export default class LinuxTower extends Tower {
    constructor(x, y) {
        super("../images/LinuxTransparent.png", 'Tux', x, y, "closest",12);
        this.damage = 5;
        this.cost = 200;
        this.fire_rate = 1;
    }

    /*
     * overriding default Tower enemy selection logic
     * Selects the tower that is furthest along and within its range
     */
    selectTarget(enemies) {
        let target, min_d;

        for (let i = 0; i < enemies.length; i++) {
            let dx = enemies[i].x - this.x;
            let dy = enemies[i].y - this.y;
            min_d = Math.sqrt(dx ** 2 + dy ** 2);
            if (min_d < this.range) {
                target = enemies[i];
                break;
            }
        }
        return [target, min_d];
    }

    upgrade() {
        this.level++;
        this.upgrade_cost *= 4;
        this.damage += 1;
        this.fire_rate += .5;
        // Fix weird issues with decimals
        // this.damage = Math.round(this.damage * 10) / 10;
    }
    
}