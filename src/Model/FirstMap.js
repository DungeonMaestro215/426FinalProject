import GameMap from "./GameMap.js";

const steering_nodes = [
    [3,70,'r'], [150,70,'d'], [150,140,'r'], [300,140,'u'],
    [300,70,'r'], [424,70,'d'], [424,340,'l'], [320,340,'u'],
    [320,260,'l'], [150,260,'d'], [150,310,'l'], [65,310,'d'],
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