/*
 * Class to store map data
 */

export default class GameMap {
    image;
    enemyPath;
    constructor(imagePath, enemyPath) {
        this.image = new Image();
        this.image.src = imagePath;
        this.enemyPath = enemyPath;
    }
    onLoad(f) {
        this.image.addEventListener('load', f.bind(this, this.image), false);
    }
}