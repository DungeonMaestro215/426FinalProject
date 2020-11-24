import KMPEnemy from "./Model/KMPEnemy.js";
import GameData from "./Model/GameData.js";
import KrisEnemy from "./Model/KrisEnemy.js";
import StottsEnemy from "./Model/StottsEnemy.js";
import SnoeyinkEnemy from "./Model/SnoeyinkEnemy.js";
import MunsellEnemy from "./Model/MunsellEnemy.js";
import BossEnemy from "./Model/BossEnemy.js";
import View from "./View.js";
import FirstMap from "./Model/FirstMap.js";

export default class Controller {
    view;
    gameData;
    enemies;
    towers;
    projectiles;
    loss_handlers;
    mute = false;

    constructor(map) {
        this.resetGame(new FirstMap());
        
        this.updateQuote();
        setInterval(() => this.updateQuote(), 20000);
    }

    resetGame(map) {
        this.view = new View(this, map);
        this.gameData = new GameData();
        this.enemies = [];
        this.towers = [];
        this.loss_handlers = [];
        this.projectiles = [];
        this.view.setLives(this.gameData.health);
        this.view.setRound(this.gameData.round);
        this.view.draw();
        this.view.setMoney(this.gameData.money);
    }

    async startRound() {
        if (this.gameData.state === "ACTIVE" || this.gameData.state === "LOST") {
            return;
        }
        //reset game variables
        this.gameData.elapsedTime = 0;
        this.gameData.enemiesSpawned = 0;

        //increase enemy count for new round
        const enemy_cap = 250;
        this.gameData.round++;
        this.gameData.maxEnemies =
            Math.min(Math.floor((this.gameData.round * this.gameData.round) / 4.4) + 20, enemy_cap);
        if(this.gameData.round >= 10) {
            this.gameData.maxBosses = Math.round(this.gameData.round / 10 * Math.random()) ** 2;
            this.gameData.maxEnemies *= 1.2 * Math.min(4, this.gameData.round - 9);
            this.gameData.spawnSpeed = Math.min(12,1.4 * (this.gameData.round -9));
        }
        this.view.setRound(this.gameData.round);
        this.gameData.state = "ACTIVE";
        //start drawing and game logic loops
        this.view.toggleDraw();
        await this.updateGame();
        if (
            !this.mute &&
            this.gameData.round !== 0 && 
            this.gameData.round % 5 === 0 &&
            this.gameData.health !== 0
        ) {
            let sound = new Audio('../images/doingood.mp3');
            sound.play();
        }
        this.projectiles = [];

        // If statement fixes money bug with resetting game in the middle of a round
        if (this.gameData.round) {
            this.gameData.money +=
                140 + Math.floor(Math.pow(1.06, this.gameData.round) * 33);
        }
        this.view.setMoney(this.gameData.money);
        this.view.updateTowerInfo();
        if (this.gameData.state === "ACTIVE") {
            this.gameData.state = "PAUSED";
            this.view.toggleDraw();
        } else {
           // throw new Error("Unexpected state after round completion");
        }
    }

    async updateGame() {
        if(this.gameData.elapsedTime % 30 == 0) {
            this.view.updateTowerInfo();
        }

        //spawn enemies
        const startX = this.view.map.enemyPath[0][0];
        const startY = this.view.map.enemyPath[0][1];
        if (
            this.gameData.elapsedTime % Math.ceil(30/this.gameData.spawnSpeed) === 0 &&
            ++this.gameData.enemiesSpawned < this.gameData.maxEnemies - this.gameData.maxBosses
        ) {
            //randomly add professor enemies
            let enemyRandomizer = Math.random();
            let newEnemy;
            if (enemyRandomizer < .2) {
                newEnemy = new KrisEnemy(startX, startY, (e) => this.enemyReachedEndHandler(e));
            } else if (enemyRandomizer < .4) {
                newEnemy = new StottsEnemy(startX, startY, (e) => this.enemyReachedEndHandler(e));
            } else if (enemyRandomizer < .6) {
                newEnemy = new KMPEnemy(startX, startY, (e) => this.enemyReachedEndHandler(e));
            } else if (enemyRandomizer < .8) {
                newEnemy = new SnoeyinkEnemy(startX, startY, (e) => this.enemyReachedEndHandler(e));
            } else {
                newEnemy = new MunsellEnemy(startX, startY, (e) => this.enemyReachedEndHandler(e));
            }
            // Increase enemy health as game progresses
            newEnemy.setHealth(25 * Math.floor(this.gameData.round / 10));
            this.enemies.push(newEnemy);
        }

        // Spawn Bosses
        if (
            this.gameData.elapsedTime % Math.ceil(30/this.gameData.spawnSpeed) === 0 &&
            this.gameData.enemiesSpawned < this.gameData.maxEnemies &&
            this.gameData.enemiesSpawned >= this.gameData.maxEnemies - this.gameData.maxBosses
        ) {
            this.gameData.enemiesSpawned++;
            const boss = new BossEnemy(startX, startY, (e) => this.enemyReachedEndHandler(e));
            boss.setHealth(25 * Math.floor(this.gameData.round / 10));
            this.enemies.push();
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

        // move every projectile
        this.projectiles.forEach(projectile => projectile.move());
        // Get rid of projectiles which go off screen or go out of range
        this.projectiles = this.projectiles.filter(projectile => {
            // This is when bitcoins become game monies
            if (projectile.source.targetType == "miner" && projectile.distance < projectile.range) {
                this.gameData.money += projectile.damage;
                this.view.setMoney(this.gameData.money);
                // this.view.updateTowerInfo();
            }
            return projectile.x > 0 &&
                projectile.x < this.view.canvas.width &&
                projectile.y > 0 &&
                projectile.y < this.view.canvas.height &&
                projectile.distance < projectile.range;
        });

        // Check every enemy against every projectile for collisions
        // Handle collisions and then draw enemies
        for (const enemy of this.enemies) {
            for (let i = 0; i < this.projectiles.length; i++) {
                const projectile = this.projectiles[i];
                if (projectile == undefined) continue;
                if (
                    projectile.x <= enemy.x + enemy.size/2 &&
                    projectile.x + projectile.size >= enemy.x - enemy.size/2 &&
                    projectile.y <= enemy.y + enemy.size/2 &&
                    projectile.y + projectile.size >= enemy.y - enemy.size/2
                ) {
                    enemy.handleCollision(projectile);
                    enemy.shot_by = projectile.source;
                    this.projectiles.splice(i,1);
                    i--;
                }
            }
            // Check every enemy against every single-use tower for collisions
            for (const tower of this.towers) {
                if (tower == undefined || tower.targetType != 'single-use') continue;
                if (
                    enemy.x - enemy.size/2 <= tower.x + tower.size &&
                    enemy.x + enemy.size/2 >= tower.x &&
                    enemy.y - enemy.size/2 <= tower.y + tower.size &&
                    enemy.y + enemy.size/2 >= tower.y
                ) {
                    enemy.handleCollision(tower);
                    enemy.shot_by = tower;
                    tower.dealDamage();
                    if (tower.remaining_damage <= 0) {
                        this.view.removeTower(tower);
                    }
                }
            }

            if (enemy.getState() === "dead") {
                this.enemies.splice(this.enemies.indexOf(enemy), 1);
                this.gameData.money += enemy.getReward();
                this.view.setMoney(this.gameData.money);
                enemy.shot_by.increaseKills();
            } else {
                enemy.move(this.view.map.enemyPath);
            }
        }

        // Remove projectiles which need to be removed
        //this.projectiles = this.projectiles.filter(projectile => !projectile.has_collided);

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
                    this.view.removeTower(tower);
                }});
        }
    }

    enemyReachedEndHandler(enemy) {
        this.enemies.splice(
            this.enemies.findIndex((x) => x === enemy),
            1
        );
        //enemy.damage = 50;
        this.gameData.health = this.gameData.health - enemy.damage <= 0 ? 0 : this.gameData.health - enemy.damage // how much damage each enemy deals
        this.view.setLives(this.gameData.health);
        if (this.gameData.health === 0) {
            if(this.gameData.state !== "LOST"){
                this.view.initiateLossScreen();
                this.loss_handlers.forEach(f => f(this.gameData.round));
                if (!this.mute) {
                    let sound = new Audio('../images/Fatality.mp3');
                    sound.play();
                }
            }
            this.gameData.state = "LOST";
        }
    }

    toggleFastForward() {
        if (!this.mute) {
            let sound = new Audio('../images/zoom.mp3');
            sound.play();
        }
        const ffbutt = document.getElementById("fastForward");
        if (this.gameData.gameSpeed == 1) {
            this.gameData.gameSpeed = 3;
            ffbutt.style.backgroundColor = '#041148';
            ffbutt.style.color = '#d2defc'
        } else {
            this.gameData.gameSpeed = 1;
            ffbutt.style.backgroundColor = 'white';
            ffbutt.style.color = 'black';
        }
    }

    muteSound() {
        if (this.mute = !this.mute) {
            document.getElementById("mute").innerHTML = '<img width="50px" height="50px" src="./images/soundoff.png">';
        } else {
            document.getElementById("mute").innerHTML = '<img width="50px" height="50px" src="./images/soundon.png">';
        }
    }

    // Quotes
    getQuotes() {
        if (!this.quotes) {
            this.quotes = axios({
                method: 'get',
                url: 'https://type.fit/api/quotes'
            })
        }
        return this.quotes;
    }
    updateQuote() {
        const quote_wrapper = document.getElementById("quote-wrapper");
        const quote_div = document.getElementById("quote");
        const author_div = document.getElementById("author");

        this.getQuotes().then((quotes) => {
            const rand = Math.round(Math.random() * quotes.data.length);
            const quote = quotes.data[rand];
            quote_div.innerHTML = `<p>${quote.text}</p>`;
            if (quote.author) {
                author_div.innerHTML = `<p>-${quote.author}</p>`;
            } else {
                author_div.innerHTML = `<p>-Anonymous</p>`;
            }
        });
    }
}
