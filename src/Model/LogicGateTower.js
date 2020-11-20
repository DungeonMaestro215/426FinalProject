import SingleUseTower from "./SingleUseTower.js";

export default class LogicGateTower extends SingleUseTower {
    constructor(x, y) {
        super("../images/not-gate.png", 'Logic Gate', x, y);
        this.range = this.size;
        this.damage = 5;
        this.remaining_damage = 100;
        this.sell = 0;
    }
}