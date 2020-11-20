import Enemy from "./Enemy.js";

export default class StottsEnemy extends Enemy {
    constructor(startX,startY) {
        let stotts_img = new Image();   // Create new img element
        stotts_img.src = "./images/Stotts.png"; // Set source path
        super(stotts_img, startX, startY);
        this.size = 20;
        this.health = 1;
    }
}