import Tower from "./Tower.js";

export default class MortyTower extends Tower {
    constructor(x, y) {
        super("../images/mortytower.png", x, y, "closest",12);
    }

    /*
     * overriding default Tower enemy selection logic
     */
    selectTarget(enemies) {
        let target = enemies[0];
        let dx = target.x - this.x;
        let dy = target.y - this.y;
        const min_d = Math.sqrt(dx ** 2 + dy ** 2);
        return [target, min_d];
    }
}