import Tower from "./Tower.js";

export default class MortyTower extends Tower {
    constructor(x, y) {
        super("../images/mortytower.png", x, y, "closest",12);
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
}