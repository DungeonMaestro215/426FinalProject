import GameMap from "./GameMap.js";

const steering_nodes = [
    [430, 3, 'd'], [430, 35, 'dl'], [393, 75, 'l'], [110, 75, 'dl'], [70, 109, 'd'], 
    [70, 217, 'dr'], [110, 255, 'r'], [393, 255, 'dr'], [430, 290, 'd'], [430, 397, 'dl'], 
    [393, 430, 'l'], [110, 430, 'dl'], [70, 475, 'd'], [70, 500, 'd']
];

export default class SecondMap extends GameMap {
    constructor() {
        super("./images/map2.png", steering_nodes);
    }
}