import Enemy from "./Enemy.js";


/*
 * Example of an Enemy subclass
 * Provides sprite to the Enemy constructor along with size info and health for this type of enemy
 */
let kmp_img = new Image();   // Create new img element
kmp_img.src = "./images/kmp.png"; // Set source path

export default class KMPEnemy extends Enemy {
    constructor(startX,startY, endHandler) {
        super(kmp_img, startX, startY);
        this.addEndCallback(endHandler);
        this.setHealth(50);
        this.reward = 3;
        this.damage = 3;
    }
}