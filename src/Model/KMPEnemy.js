import Enemy from "./Enemy.js";


/*
 * Example of an Enemy subclass
 * Provides sprite to the Enemy constructor along with size info and health for this type of enemy
 */
export default class KMPEnemy extends Enemy {
    constructor(startX,startY, endHandler) {
        let kmp_img = new Image();   // Create new img element
        kmp_img.src = "./images/kmp.png"; // Set source path
        super(kmp_img, startX, startY);
        this.addEndCallback(endHandler);
        this.size = 30;
        this.health = 50;
        this.maxHealth = this.health;
        this.reward = 3;
        this.damage = 3;
    }
}