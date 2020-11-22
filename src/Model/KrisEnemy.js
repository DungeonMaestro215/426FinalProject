import Enemy from "./Enemy.js";

export default class KrisEnemy extends Enemy {
    constructor(startX,startY, endHandler) {
        let img = new Image();   // Create new img element
        img.src = "./images/KrisJordan.png"; // Set source path
        super(img, startX, startY);
        this.addEndCallback(endHandler);
        this.health = 10;
        this.maxHealth = this.health;
        this.reward = 1;
        this.damage = 1;
    }
}