import FirstMap from "./Model/FirstMap.js";
import AnimeGirlTower from "./Model/AnimeGirlTower.js";
import MortyTower from "./Model/MortyTower.js"

export default class View {
    canvas = document.getElementById("canvas");
    enemy_canvas = document.getElementById("enemies");
    foreground = document.getElementById("foreground");

    controller;
    drawing;
    raf;
    map = new FirstMap();

    constructor() {
        //Create map object and load image to the canvas
        this.map.onLoad((img) => {
            this.ctx.drawImage(img, 0, 0, 500, 500);
        });
        this.drawing = false;
        this.enemy_ctx = this.enemy_canvas.getContext("2d");
        this.ctx = this.canvas.getContext("2d");
        //Create buttons in the UI for each type of tower
        let towerTypes = [new AnimeGirlTower(), new MortyTower()];
        for(const towerType of towerTypes){
            document.getElementById("towerSidebar").insertAdjacentHTML("beforeend",
                `<div><img height="50px" width="50px" alt="${towerType.constructor.name}" id="${towerType.constructor.name}" src="${towerType.sprite}"/></div>`
            );
            document.getElementById(towerType.constructor.name).addEventListener('click', ()=>this.toggleTowerPlacement(towerType));
        }
    }

    setRound(round) {
        document.getElementById("round").innerText = `Round: ${round}`;
    }

    setLives(lives) {
        document.getElementById("lives").innerText = `Lives: ${lives}`;
    }
    setMoney(money) {
        document.getElementById("money").innerText = `Money: ${money}`;
    }

    toggleDraw() {
       if(this.drawing = !this.drawing){
            this.draw();
       }
    }

    draw() {
        this.enemy_ctx.clearRect(
            0,
            0,
            this.enemy_canvas.width,
            this.enemy_canvas.height
        );
        for (let i = 0; i < this.controller.projectiles.length; i++) {
            this.controller.projectiles[i].draw(this.enemy_ctx);
        }
        for (let i = 0; i < this.controller.enemies.length; i++) {
            this.controller.enemies[i].draw(this.enemy_ctx);
        }
        if(!this.drawing) return;
        this.raf = window.requestAnimationFrame((t) => this.draw(t));
    }

    //"Add Tower" button logic
    placingTower = false;
    selectedTowerImage;
    //store click and mouse move listeners so they can be removed
    listener;
    guideListener;
    toggleTowerPlacement(tower) {
        //store selected tower image to assist drawing tower on mouse location
        this.selectedTowerImage = new Image();
        this.selectedTowerImage.src = tower.sprite;
        this.selectedTowerImage.size = tower.size;
        //add and remove event listeners
        if (!(this.placingTower = !this.placingTower)) {
            this.enemy_canvas.removeEventListener(
                "mousedown",
                this.listener,
            );
            window.removeEventListener("mousemove",
                this.guideListener);
        } else {
            window.addEventListener("mousemove",
                this.guideListener = e => this.renderTowerPlacementGuide(e,tower));
            this.enemy_canvas.addEventListener(
                "mousedown",
                this.listener  = (e) => this.renderTowerFromMouseEvent(e,tower)
            );
        }
    }

    /*
     * render a tower image on the canvas from the location given by a mouse event
     * towers are rendered on the background canvas behind the enemies
     */
    renderTowerFromMouseEvent = (e, tower) => {
        // Prevent clicking from highlighing anything on page
        e.preventDefault();

        // Tower costs 50
        if (this.controller.gameData.money < 50) {
            return;
        }

        // Get cursor position
        let [x, y] = getCursorPosition(this.canvas, e);

        // Can the tower be placed here?
        if (this.isTowerPlacementGuideBlocked(x, y)) {
            // If it is blocked, do nothing
            return;
        }

        // Manage monies
        this.controller.gameData.money -= 50;
        this.setMoney(this.controller.gameData.money);

        // Generate new tower

        tower = new tower.constructor;
        tower.x = x;
        tower.y = y;
        this.controller.towers.push(tower);

        // render tower
        let img = new Image();
        img.addEventListener(
            "load",
            () => {
                this.ctx.drawImage(img, x, y, tower.size, tower.size);
                // Clear tower placement guide box
                this.enemy_ctx.clearRect(x, y, tower.size, tower.size);
            },
            false
        );
        img.src = tower.sprite;
        //end tower placement state when tower has been placed
        this.toggleTowerPlacement(tower);
    };

    /*
     * just render the sprite of a tower at an event mouse location
     * to indicate the user is in tower placing state
     */
    renderTowerPlacementGuide = (e) => {
        this.enemy_ctx.clearRect(
            0,
            0,
            this.enemy_canvas.width,
            this.enemy_canvas.height
        );
        let [x, y] = getCursorPosition(this.canvas, e);

        const isBlocked = this.isTowerPlacementGuideBlocked(x, y);

        this.enemy_ctx.fillStyle = isBlocked ? 'rgba(255, 0, 0, .5)' : 'rgba(0, 255, 0, .5)';
        this.enemy_ctx.fillRect(x, y, this.selectedTowerImage.size, this.selectedTowerImage.size);
        this.enemy_ctx.drawImage(this.selectedTowerImage, x, y, this.selectedTowerImage.size, this.selectedTowerImage.size);
    };

    // Given (x, y) coordinate for the mouse, figure out if this spot is open or blocked
    isTowerPlacementGuideBlocked(x, y) {
        // Is the tower on screen?
        const off_screen = x < 0 || y < 0 || x + this.selectedTowerImage.size > this.canvas.width || y + this.selectedTowerImage.size > this.canvas.width;

        // Is the guide overlapping with a tower?
        const blocked_by_tower = this.controller.towers.reduce((acc, tower) => {
            if (
                x > tower.x + tower.size ||
                x + this.selectedTowerImage.size < tower.x ||
                y > tower.y + tower.size ||
                y + this.selectedTowerImage.size < tower.y
            ) {
                return acc || false;
            } else {
                return true;
            }
        }, false);

        // Is the guide overlapping with the track?
        let blocked_by_track = false;
        for (let i = 0; i < this.map.enemyPath.length - 1; i++) {
            const x1 = this.map.enemyPath[i][0];
            const y1 = this.map.enemyPath[i][1];
            const x2 = this.map.enemyPath[i+1][0];
            const y2 = this.map.enemyPath[i+1][1];

            // Check for collisions on the left, right, top, and bottom of guide
            blocked_by_track = blocked_by_track || this.lineLine(x1, y1, x2, y2, x + this.selectedTowerImage.size, y, x + this.selectedTowerImage.size, y + this.selectedTowerImage.size);
            blocked_by_track = blocked_by_track || this.lineLine(x1, y1, x2, y2, x, y, x, y + this.selectedTowerImage.size);
            blocked_by_track = blocked_by_track || this.lineLine(x1, y1, x2, y2, x, y, x + this.selectedTowerImage.size, y);
            blocked_by_track = blocked_by_track || this.lineLine(x1, y1, x2, y2, x, y + this.selectedTowerImage.size, x + this.selectedTowerImage.size, y + this.selectedTowerImage.size);
        }

        return off_screen || blocked_by_tower || blocked_by_track;
    };

    // Line intersecting a line 
    // code adapted from: http://www.jeffreythompson.org/collision-detection/line-rect.php
    lineLine(x1, y1, x2, y2, x3, y3, x4, y4) {
        const uA = ((x4-x3)*(y1-y3) - (y4-y3)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));
        const uB = ((x2-x1)*(y1-y3) - (y2-y1)*(x1-x3)) / ((y4-y3)*(x2-x1) - (x4-x3)*(y2-y1));

        // if uA and uB are between 0-1, lines are colliding
        if (uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1) {
            return true;
        } else {
            return false;
        }
    }

    initiateLossScreen() {
        const foreground_ctx = this.foreground.getContext("2d");
        let start_time = 0;
        let die_raf;
        const die = (timestamp) => {
            let o = 0;
            if (start_time === 0) {
                start_time = timestamp;
            } else {
                o = (timestamp - start_time) / 1000;
            }
            if (o > 0.8) {
                return;
            }
            foreground_ctx.clearRect(0, 0, 500, 500);
            foreground_ctx.fillStyle = "rgba(0,0,0," + o + ")";
            foreground_ctx.fillRect(0, 0, 500, 500);
            foreground_ctx.font = o * 66 + "px serif";
            foreground_ctx.textAlign = "center";
            foreground_ctx.textBaseline = "middle";
            foreground_ctx.fillStyle = "rgb(199,10,0)";
            if (o > 0.2) {
                foreground_ctx.fillText(
                    "YOU DIED",
                    this.foreground.width / 2,
                    this.foreground.height / 2
                );
            }
            die_raf = window.requestAnimationFrame(die);
        };
        window.requestAnimationFrame(die);
    }
}

/*
 * get the coordinates of the mouse on the canvas
 * stolen from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/18053642#18053642
 */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return [x, y];
}
