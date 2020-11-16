import Tower from "./Tower.js";

export default class LogicGateTower extends Tower {
    constructor(x, y) {
        super("../images/not-gate.png", 'Logic Gate', x, y, "single-use", 0);
        this.range = this.size;
        this.damage = 5;
        this.remaining_damage = 100;
        this.sell = 0;
    }

    renderTowerInfo() {
        const info = document.createElement('div');
        info.innerHTML = `<p>Tower: ${this.name}</p><p>Level: ${this.level}</p><p>Kills: ${this.kills}</p><p>Damage Remaining: ${this.remaining_damage}</p>`;
        return info;
    }

    dealDamage() {
        this.remaining_damage -= this.damage;
    }
    
}