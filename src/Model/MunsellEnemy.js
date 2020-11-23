import Enemy from "./Enemy.js";

let img = new Image();   // Create new img element
img.src = "./images/Munsell.png"; // Set source path

export default class MunsellEnemy extends Enemy {
    constructor(startX, startY, endHandler) {
        super(img, startX, startY);
        this.addEndCallback(endHandler);
        this.health = 50;
        this.maxHealth = this.health;
        this.reward = 5;
        this.damage = 5;
    }
}