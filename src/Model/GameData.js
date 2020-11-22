export default class GameData {
    constructor(){
        this.round=0;
        this.state="PAUSED";
        this.health=200;
        this.elapsedTime = 0;
        this.enemiesSpawned = 0;
        this.maxEnemies = 0;
        this.money = 250;
        this.gameSpeed = 1;
        this.spawnSpeed = 1;
    }
}