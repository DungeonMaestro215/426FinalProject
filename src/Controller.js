import KMPEnemy from "./Model/KMPEnemy.js";
import GameData from "./Model/GameData.js";
import KrisEnemy from "./Model/KrisEnemy.js";
import StottsEnemy from "./Model/StottsEnemy.js";

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
    }

    async startRound() {
        if (this.gameData.state === "ACTIVE") {
            return;
        }
        //reset game variables
        this.gameData.elapsedTime = 0;
        this.gameData.enemiesSpawned = 0;

        //increase enemy count for new round
        this.gameData.round++;
        this.gameData.maxEnemies =
            Math.floor((this.gameData.round * this.gameData.round) / 4.4) + 20;
        this.view.setRound(this.gameData.round);
        this.gameData.state = "ACTIVE";
        //start drawing and game logic loops
        this.view.toggleDraw();
        await this.updateGame();
        this.projectiles = [];
        //
        this.gameData.money +=
            140 + Math.floor(Math.pow(1.06, this.gameData.round) * 33);
        this.view.setMoney(this.gameData.money);
        if (this.gameData.state === "ACTIVE") {
            this.gameData.state = "PAUSED";
            this.view.toggleDraw();
        } else {
            throw new Error("Unexpected state after round completion");
        }
    }

    async updateGame() {
        //spawn enemies
        if(this.gameData.elapsedTime % 20) {
            // console.log(this.projectiles.length);
        }
        if (
            this.gameData.elapsedTime % 30 === 0 &&
            ++this.gameData.enemiesSpawned < this.gameData.maxEnemies
        ) {
            //randomly add either kmp or kris enemy
            let enemyRandomizer = Math.random();
            let newEnemy;
            if (enemyRandomizer < .3) {
                newEnemy = new KrisEnemy(3, 50, (e) => this.enemyReachedEndHandler(e));
            } else if (enemyRandomizer >= .3 && enemyRandomizer < .65) {
                newEnemy = new StottsEnemy(3, 50, (e) => this.enemyReachedEndHandler(e));
            } else {
                newEnemy = new KMPEnemy(3, 50, (e) => this.enemyReachedEndHandler(e));
            }
            // const newEnemy = Math.random() > 0.7 ? new KMPEnemy(3, 50, (e) => this.enemyReachedEndHandler(e)) : new KrisEnemy(3, 50, (e) => this.enemyReachedEndHandler(e));
            this.enemies.push(newEnemy);
        }

        this.towers.forEach(tower => {
            if (tower.targetType != 'single-use' &&
                this.gameData.elapsedTime % (Math.round(9 / tower.fire_rate)) === 0) {
                
                // Have this tower fire a projectile
                const projectiles = tower.createProjectile(this.enemies, this.view.map.enemyPath);
                if (projectiles != undefined) {
                    this.projectiles.push(...projectiles);
                }
            }
        });

        // if (this.gameData.elapsedTime % 9 === 0) {
        //     //cause each tower to fire 1 shot at nearest enemy
        //     for (let tower of this.towers) {
        //         const projectile = tower.createProjectile(this.enemies, this.view.map.enemyPath);
        //         if (projectile != undefined) {
        //             this.projectiles.push(projectile);
        //         }
        //     }
        // }

        // move every projectile
        this.projectiles.forEach(projectile => projectile.move());
        // Get rid of projectiles which go off screen
        this.projectiles = this.projectiles.filter(projectile => {
            return projectile.x > 0 &&
                projectile.x < this.view.canvas.width &&
                projectile.y > 0 &&
                projectile.y < this.view.canvas.height &&
                projectile.distance < projectile.range;
        });

        // Check every enemy against every projectile for collisions
        // Handle collisions and then draw enemies
        for (const enemy of this.enemies) {
            for (const projectile of this.projectiles) {
                if (projectile == undefined) continue;
                if (
                    // projectile.x >= enemy.x &&
                    // projectile.x <= enemy.x + enemy.size &&
                    // projectile.y >= enemy.y &&
                    // projectile.y <= enemy.y + enemy.size
                    projectile.x <= enemy.x + enemy.size &&
                    projectile.x + projectile.size >= enemy.x &&
                    projectile.y <= enemy.y + enemy.size &&
                    projectile.y + projectile.size >= enemy.y
                ) {
                    enemy.handleCollision(projectile);
                    enemy.shot_by = projectile.source;
                    projectile.has_collided = true;
                }
            }
            // Check every enemy against every single-use tower for collisions
            for (const tower of this.towers) {
                if (tower == undefined || tower.targetType != 'single-use') continue;
                if (
                    enemy.x <= tower.x + tower.size &&
                    enemy.x + enemy.size >= tower.x &&
                    enemy.y <= tower.y + tower.size &&
                    enemy.y + enemy.size >= tower.y
                ) {
                    enemy.handleCollision(tower);
                    enemy.shot_by = tower;
                    tower.dealDamage();
                    if (tower.remaining_damage <= 0) {
                        this.view.removeTower(tower);
                    }
                    if (tower == this.view.clickedTower) {
                        this.view.updateTowerInfo();
                    }
                }
            }

            if (enemy.getState() === "dead") {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
                this.gameData.money += enemy.getReward();
                this.view.setMoney(this.gameData.money);
                enemy.shot_by.increaseKills();
                this.view.updateTowerInfo();
            } else {
                enemy.move(this.view.map.enemyPath);
            }
        }

        // Remove projectiles which need to be removed
        this.projectiles = this.projectiles.filter(projectile => !projectile.has_collided);

        if (
            this.enemies.length > 0 ||
            this.gameData.enemiesSpawned < this.gameData.maxEnemies
        ) {
            await new Promise((resolve) => setTimeout(resolve, 32 / this.gameData.gameSpeed));
            this.gameData.elapsedTime++;
            return this.updateGame();
        } else {
            // Remove all of the single use towers
            this.towers.forEach(tower => {
                if (tower.targetType == 'single-use') { 
                    this.view.removeTower(tower) 
                }});
        }
    }


    enemyReachedEndHandler(enemy) {
        this.enemies.splice(
            this.enemies.findIndex((x) => x === enemy),
            1
        );
        if (!this.gameData.health--) {
            this.gameData.state = "LOST";
            this.view.initiateLossScreen();
        } else {
            this.view.setLives(this.gameData.health);
        }
    }

    toggleFastForward() {
        const ffbutt = document.getElementById("fastforward");
        if (this.gameData.gameSpeed == 1) {
            this.gameData.gameSpeed = 2;
            ffbutt.style.backgroundColor = 'gold';
        } else {
            this.gameData.gameSpeed = 1;
            ffbutt.style.backgroundColor = 'white';
        }
    }
}
