import KMPEnemy from "./Model/KMPEnemy.js";
import GameData from "./Model/GameData.js";
import KrisEnemy from "./Model/KrisEnemy.js";

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
            console.log(this.projectiles.length);
        }
        if (
            this.gameData.elapsedTime % 30 === 0 &&
            ++this.gameData.enemiesSpawned < this.gameData.maxEnemies
        ) {
            //randomly add either kmp or kris enemy
            const newEnemy =
                Math.random() > 0.7
                    ? new KMPEnemy(3, 50, (e) => this.enemyReachedEndHandler(e))
                    : new KrisEnemy(3, 50, (e) =>
                          this.enemyReachedEndHandler(e)
                      );
            this.enemies.push(newEnemy);
        }

        this.towers.forEach(tower => {
            if (this.gameData.elapsedTime % (9 / tower.fire_rate) === 0) {
                const projectile = tower.createProjectile(this.enemies, this.view.map.enemyPath);
                if (projectile != undefined) {
                    this.projectiles.push(projectile);
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
                projectile.y < this.view.canvas.height;
        });

        // Check every enemy against every projectile for collisions
        // Handle collisions and then draw enemies
        for (const enemy of this.enemies) {
            for (const projectile of this.projectiles) {
                if(projectile == undefined) continue;
                //todo: projectiles that can't penetrate enemies should be destroyed here
                if (
                    projectile.x >= enemy.x &&
                    projectile.x <= enemy.x + enemy.size &&
                    projectile.y >= enemy.y &&
                    projectile.y <= enemy.y + enemy.size
                ) {
                    enemy.handleCollision(projectile);
                    projectile.has_collided = true;
                }
            }
            if (enemy.getState() === "dead") {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
                this.gameData.money += enemy.getReward();
                this.view.setMoney(this.gameData.money);
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
            await new Promise((resolve) => setTimeout(resolve, 32));
            this.gameData.elapsedTime++;
            return this.updateGame();
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
}
