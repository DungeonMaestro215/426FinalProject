import Enemy from "./Enemy.js";


/*
 * Example of an Enemy subclass
 * Provides sprite to the Enemy constructor along with size info and health for this type of enemy
 */
export default class BossEnemy extends Enemy {
    constructor(startX,startY, endHandler) {
        // let kmp_img = new Image();   // Create new img element
        // kmp_img.src = "./images/kmp.gif"; // Set source path
        let kmp_imgs = [];
        for (let i = 0; i < 12; i++) {
            kmp_imgs[i] = new Image();
            kmp_imgs[i].src = `./images/KMP_Boss/kmp${i}.png`;
        }
        super(kmp_imgs, startX, startY);
        this.addEndCallback(endHandler);
        this.health = 900;
        this.maxHealth = this.health;
        this.size = 100;
        this.reward = 100;
        this.damage = 20;
        this.currentFrame = 0;
    }

    draw(context) {
        context.drawImage(this.sprite[this.currentFrame], this.x - this.size/2, this.y - this.size/2, this.size, this.size);
        if (++this.currentFrame >= 12) {
            this.currentFrame = 0;
        }
        
        // Health Bar
        const mapped_health = this.size / this.maxHealth * this.health;
        context.fillStyle = mapped_health > .25 * this.size ? 'rgba(0, 255, 0, .7)' : 'rgba(255, 0, 0, .7)';
        context.fillRect(this.x - this.size/2, this.y - 10 - this.size/2, mapped_health, 5);
    }
}