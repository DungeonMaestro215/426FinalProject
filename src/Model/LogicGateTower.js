import SingleUseTower from "./SingleUseTower.js";

export default class LogicGateTower extends SingleUseTower {
    constructor(x, y) {
        super("../images/not-gate.png", 'Inverter', x, y);
        this.range = this.size;
        this.damage = 5;
        this.remaining_damage = 100;
        this.sell = 0;
        this.description = 'Single use tower to eliminate those pesky professors. Place on the track.';
    }
}