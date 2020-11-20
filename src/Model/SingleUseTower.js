import Tower from "./Tower.js";

export default class SingleUseTower extends Tower {
    constructor(sprite, name, x, y) {
        super(sprite, name, x, y, "single-use", 0);
        this.range = this.size;
        this.damage = 5;
        this.remaining_damage = 100;
        this.sell = 0;
    }

    dealDamage() {
        this.remaining_damage -= this.damage;
    }

    clickHandler() {
        return;
    }
}