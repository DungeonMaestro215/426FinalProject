import Enemy from "./Enemy.js";

let img = new Image();   // Create new img element
img.src = "./images/Stotts.png"; // Set source path

export default class StottsEnemy extends Enemy {
    constructor(startX, startY, endHandler) {
        super(img, startX, startY);
        this.addEndCallback(endHandler);
        this.health = 20;
        this.maxHealth = this.health;
        this.reward = 2;
        this.damage = 2;
    }
}