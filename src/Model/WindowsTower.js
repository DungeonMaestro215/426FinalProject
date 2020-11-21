import Tower from "./Tower.js";

export default class WindowsTower extends Tower {
    constructor(x, y) {
        super("../images/WindowsLogo.png", 'Wendy', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
    }
}