import Enemy from "./Enemy.js";

let img = new Image();   // Create new img element
img.src = "./images/Snoeyink.png"; // Set source path

export default class SnoeyinkEnemy extends Enemy {
    constructor(startX, startY, endHandler) {
        super(img, startX, startY);
        this.addEndCallback(endHandler);
        this.health = 40;
        this.maxHealth = this.health;
        this.reward = 4;
        this.damage = 4;
    }
}