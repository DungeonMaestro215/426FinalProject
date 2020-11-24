import Enemy from "./Enemy.js";

let img = new Image();   // Create new img element
img.src = "./images/KrisJordan.png"; // Set source path

export default class KrisEnemy extends Enemy {
    constructor(startX,startY, endHandler) {
        super(img, startX, startY);
        this.addEndCallback(endHandler);
        this.health = 10;
        this.maxHealth = this.health;
        this.reward = 1;
        this.damage = 1;
    }
}