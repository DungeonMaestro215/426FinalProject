import Enemy from "./Enemy.js";

export default class MunsellEnemy extends Enemy {
    constructor(startX, startY, endHandler) {
        let img = new Image();   // Create new img element
        img.src = "./images/Munsell.png"; // Set source path
        super(img, startX, startY);
        this.addEndCallback(endHandler);
        this.size = 30;
        this.health = 50;
        this.maxHealth = this.health;
        this.reward = 5;
        this.damage = 5;
    }
}