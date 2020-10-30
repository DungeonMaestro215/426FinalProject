import KMPEnemy from "./Model/KMPEnemy.js";
import Projectile from "./Model/Projectile.js";
import GameData from "./Model/GameData.js";
import KrisEnemy from "./Model/KrisEnemy.js";

const bullet_v = 10;

export default class Controller {
    view;
    gameData;
    enemies;
    towers;
    projectiles;

    constructor(view) {
        this.view = view;
        this.gameData = new GameData();
        this.enemies = [];
        this.towers = [];
        this.projectiles = [];
        this.view.setLives(this.gameData.health);
        this.view.setRound(this.gameData.round);
        this.view.setCash(this.gameData.cash);
    }

    async startRound() {
        if(this.gameData.state === "ACTIVE"){
            return;
        }
        console.log(this);
        this.gameData.elapsedTime = 0;
        this.gameData.enemiesSpawned = 0;
        this.gameData.round++;
        this.gameData.maxEnemies = Math.floor((this.gameData.round * this.gameData.round) / 4.4) + 20;
        this.view.setRound(this.gameData.round);
        this.gameData.state = "ACTIVE";
        this.view.toggleDraw();
        await this.updateGame();
        this.projectiles = [];
        if(this.gameData.state === "ACTIVE") {
            this.gameData.state = "PAUSED";
            this.view.toggleDraw();
        } else {
            throw new Error("Unexpected state after round completion")
        }
    }

    async updateGame(){
        //spawn enemies
        if(this.gameData.elapsedTime % 30 === 0 && ++this.gameData.enemiesSpawned < this.gameData.maxEnemies) {
            const newEnemy = Math.random() > 0.7 ? new KMPEnemy(3,50, e => this.enemyReachedEndHandler(e)) :
                new KrisEnemy(3,50, e => this.enemyReachedEndHandler(e))
            this.enemies.push(newEnemy);
        }

        if(this.gameData.elapsedTime % 9 === 0) {
            //cause each tower to fire 1 shot at nearest enemy
            this.fireTowers();
        }

        // move every projectile
        // todo: remove projectiles from the array that go beyond the canvas bounds so they don't keep taking up wam
        for(let i = 0; i < this.projectiles.length; i++) {
            let projectile = this.projectiles[i];
            projectile.x+=projectile.vx;
            projectile.y+=projectile.vy;
        }

        // Check every enemy against every projectile for collisions
        // Handle collisions and then draw enemies
        for(const enemy of this.enemies) {
            for(const projectile of this.projectiles) {
                //todo: projectiles that can't penetrate enemies should be destroyed here
                if(projectile.x >= enemy.x && projectile.x <= enemy.x + 20
                    && projectile.y >= enemy.y && projectile.y <= enemy.y + 20){
                    enemy.handleCollision();
                }
            }
            if(enemy.getState() === "dead"){
                this.enemies.splice(this.enemies.indexOf(enemy),1);
            } else {
                enemy.move(this.view.map.enemyPath)
            }
        }

        if(this.enemies.length > 0 || this.gameData.enemiesSpawned < this.gameData.maxEnemies) {
            await new Promise(resolve => setTimeout(resolve, 32));
            this.gameData.elapsedTime++;
            return this.updateGame();
        }
    }

    fireTowers(){
        for(let tower of this.towers){
            if(this.enemies.length < 1){
                break;
            }
            let min_d = Number.MAX_SAFE_INTEGER;
            let target = this.enemies[0];

            //Select closest enemy
            for(let enemy of this.enemies){
                let dx = enemy.x - tower.x;
                let dy = enemy.y - tower.y;
                let d = Math.sqrt(dx**2 + dy**2);
                if(d < min_d) {
                    min_d = d;
                    target = enemy;
                }
            }

            //predict where the target is gonna be when the projectile gets there
            let adx = (target.x + target.getVx(this.view.map.enemyPath) * 1.33 * (min_d/bullet_v) ) - tower.x;
            let ady = (target.y + target.getVy(this.view.map.enemyPath) * 1.33 * (min_d/bullet_v) ) - tower.y
            let atan = Math.atan(ady/adx);

            //shoot projectile
            this.projectiles.push(new Projectile(
                tower.x, tower.y, bullet_v * Math.cos(atan) * Math.sign(adx), bullet_v * Math.sin(atan) * Math.sign(adx)
            ))
        }
    }

    enemyReachedEndHandler(enemy) {
        this.enemies.splice(this.enemies.findIndex(x => x === enemy),1);
        if(!this.gameData.health--){
            this.gameData.state = "LOST";
            this.view.initiateLossScreen();
        } else {
            this.view.setLives(this.gameData.health)
        }
        console.log(this.gameData.health);
    }
}






