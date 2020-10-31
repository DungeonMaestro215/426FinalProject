import FirstMap from "./Model/FirstMap.js";

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
        document
            .getElementById("addTower")
            .addEventListener("click", this.toggleTowerPlacement.bind(this));
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
    toggleTowerPlacement() {
        if (!(this.placingTower = !this.placingTower)) {
            this.enemy_canvas.removeEventListener(
                "mousedown",
                this.renderTowerFromMouseEvent
            );
        } else {
            this.enemy_canvas.addEventListener(
                "mousedown",
                this.renderTowerFromMouseEvent
            );
        }
    }

    /*
     * render a tower image on the canvas from the location given by a mouse event
     * towers are rendered on the background canvas behind the enemies
     */
    renderTowerFromMouseEvent = (e) => {
        if (this.controller.gameData.money < 50) {
            return;
        }

        this.controller.gameData.money -= 50;
        this.setMoney(this.controller.gameData.money);
        let [x, y] = getCursorPosition(this.canvas, e);
        this.controller.towers.push({ x: x, y: y });
        // render tower
        let img = new Image();
        img.addEventListener(
            "load",
            () => {
                this.ctx.drawImage(img, x, y, 55, 55);
            },
            false
        );
        img.src = "./images/tower.png";
    };

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
