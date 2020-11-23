import GameMap from "./GameMap.js";

const steering_nodes = [
    [250, 5, 'dl'], [100, 170, 'dr'], [325, 390, 'l'],
    [150, 385, 'dr'], [290, 500, 'd']
];

export default class ThirdMap extends GameMap {
    constructor() {
        super("./images/map3.png", steering_nodes);
    }
}