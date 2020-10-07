import Enemy from "./Enemy.js";


/*
 * Example of an Enemy subclass
 * Provides sprite to the Enemy constructor
 */
export default class KMPEnemy extends Enemy {
    constructor(startX,startY) {
        let kmp_img = new Image();   // Create new img element
        kmp_img.src = "./images/kmp.png"; // Set source path
        super(kmp_img, startX, startY);
        this.size = 20;
    }
}