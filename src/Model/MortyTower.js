import Tower from "./Tower.js";

export default class MortyTower extends Tower {
    constructor(x, y) {
        super("../images/mortytower.png", x, y, "closest");
    }
}