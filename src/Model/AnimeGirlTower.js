import Tower from "./Tower.js";

export default class AnimeGirlTower extends Tower {
    constructor(x, y) {
        super("../images/animegirltower.png", 'AnimeGirl', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
    }
}