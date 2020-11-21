import Tower from "./Tower.js";

export default class MacTower extends Tower {
    constructor(x, y) {
        super("../images/MacLogo.png", 'Mac', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
    }
}