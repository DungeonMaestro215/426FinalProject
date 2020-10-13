import KMPEnemy from "./Model/KMPEnemy.js";
import FirstMap from "./Model/FirstMap.js";
import Projectile from "./Model/Projectile.js";
import GameData from "./Model/GameData.js";

//Establish DOM links
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const enemy_canvas = document.getElementById('enemies');
const enemy_ctx = enemy_canvas.getContext('2d');
let raf;

//Create map object and load image to the canvas
let map = new FirstMap();
map.onLoad(function(img) {
    ctx.drawImage(img, 0, 0,500,500);
})



let gameData = new GameData();

document.getElementById("round").innerText = `Round: ${gameData.round}`;

let startRound = async () => {
    gameData.round++;
    document.getElementById("round").innerText = `Round: ${gameData.round}`;
    if(gameData.state === "ACTIVE"){
        return;
    }
    //alert("start");
    gameData.state = "ACTIVE";
    raf = window.requestAnimationFrame(draw);
    await spawn();
    gameData.state = "PAUSED";
}

document.getElementById("roundStart").addEventListener('click', startRound);


let enemies = [];
let towers = [];
let projectiles = [];
const bullet_v = 10

//spawn an enemy periodically
const spawn = async () => {
    for(let i = 0; i < 225; i++){
        enemies.push(new KMPEnemy(3,50,20));
        await new Promise(resolve => setTimeout(resolve, 200));
    }
}


//main game animation loop
function draw(timestamp) {
    enemy_ctx.clearRect(0,0, enemy_canvas.width, enemy_canvas.height);
    //dumb way to make this tower shooting logic happen on a timer
    //TODO: create a good timing mechanism to control tower attack speed
    if(Math.round(timestamp*1000) % 100 > 88) {
        for(let tower of towers){
            if(enemies.length < 1){
                break;
            }
            let min_d = Number.MAX_SAFE_INTEGER;
            let target = enemies[0];

            //Select closest enemy
            for(let enemy of enemies){
                let dx = enemy.x - tower.x;
                let dy = enemy.y - tower.y;
                let d = Math.sqrt(dx**2 + dy**2);
                if(d < min_d) {
                    min_d = d;
                    target = enemy;
                }
            }

            //sorta predict where the target is gonna be when the projectile gets there
            // but not very well haha
            let adx = (target.x + target.getVx(map.enemyPath) * 1.33 * (min_d/bullet_v) ) - tower.x;
            let ady = (target.y + target.getVy(map.enemyPath) * 1.33 * (min_d/bullet_v) ) - tower.y
            let atan = Math.atan(ady/adx);

            //shoot boolet
            projectiles.push(new Projectile(
                tower.x, tower.y, bullet_v * Math.cos(atan) * Math.sign(adx), bullet_v * Math.sin(atan) * Math.sign(adx)
            ))
        }
    }

    // move and draw every projectile
    // todo: remove projectiles from the array that go beyond the canvas bounds so they don't keep taking up wam
    for(let i = 0; i < projectiles.length; i++) {
        let projectile = projectiles[i];
        projectile.x+=projectile.vx;
        projectile.y+=projectile.vy;
        projectile.draw(enemy_ctx);
    }

    // Check every enemy against every projectile for collisions
    // Handle collisions and then draw enemies
    for(const enemy of enemies) {
        for(const projectile of projectiles) {
            //todo: projectiles that can't penetrate enemies should be destroyed here
            if(projectile.x >= enemy.x && projectile.x <= enemy.x + 20
                && projectile.y >= enemy.y && projectile.y <= enemy.y + 20){
                console.log("collision");
                enemy.handleCollision();
            }
        }
        if(enemy.getState() === "dead"){
            enemies.splice(enemies.indexOf(enemy),1);
        } else {
            enemy.draw(enemy_ctx);
            enemy.move(map.enemyPath)
        }
    }
    raf = window.requestAnimationFrame(draw);
}

//"Add Tower" button logic
let placingTower = false;
const toggleTowerPlacement = () => {
    if(!(placingTower = !placingTower)) {
        enemy_canvas.removeEventListener('mousedown', renderTowerFromMouseEvent);
    } else {
        enemy_canvas.addEventListener('mousedown', renderTowerFromMouseEvent);
    }
}
document.getElementById('addTower').addEventListener('click', toggleTowerPlacement);


/*
 * render a tower image on the canvas from the location given by a mouse event
 * towers are rendered on the background canvas behind the enemies
 */
const renderTowerFromMouseEvent = (e) => {
    let [x,y] = getCursorPosition(canvas, e);
    towers.push({x:x,y:y})

    // render tower
    let img = new Image();
    img.addEventListener('load', function() {
        ctx.drawImage(img, x, y,55,55);
    }, false);
    img.src = "./images/tower.png";
}

/*
 * get the coordinates of the mouse on the canvas
 * stolen from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/18053642#18053642
 */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    return [x,y];
}


