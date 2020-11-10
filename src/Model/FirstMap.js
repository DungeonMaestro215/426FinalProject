import GameMap from "./GameMap.js";

const steering_nodes = [
    [3,60,'r'], [140,60,'d'], [140,130,'r'], [280,140,'u'],
    [280,60,'r'], [424,60,'d'], [424,340,'l'], [310,340,'u'],
    [310,260,'l'], [150,260,'d'], [150,310,'l'], [65,310,'d'],
    [65,405,'r'], [456,405,'d'], [500,500,'d'],
];

/*
 * Contains the image file and enemy pathing data for this shitty map I drew
 */
export default class FirstMap extends GameMap {
    constructor() {
        super("./images/map.png", steering_nodes);
    }
}