import KMPEnemy from "./Model/KMPEnemy.js";
import FirstMap from "./Model/FirstMap.js";
import Projectile from "./Model/Projectile.js";

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

let enemies = [];
let towers = [];
let projectiles = [];
const bullet_v = 10

//spawn an enemy periodically
const spawn = async () => {
    for(let i = 0; i < 25; i++){
        enemies.push(new KMPEnemy(3,50,20));
        await new Promise(resolve => setTimeout(resolve, 4000));
    }
}
spawn();


//main game animation loop
function draw(timestamp) {
    enemy_ctx.clearRect(0,0, enemy_canvas.width, enemy_canvas.height);
    //dumb way to make this tower shooting logic happen on a timer
    if(Math.round(timestamp*1000) % 100 > 88) {
        for(let tower of towers){
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

    // move and draw every enemy
    for(const enemy of enemies) {
        enemy.draw(enemy_ctx);
        enemy.move(map.enemyPath)
        //todo: check for collisions here and probably kill the enemy 😳
/*        if(projectile.x >= enemy.x && projectile.x <= enemy.x + 20
            && projectile.y >= enemy.y && projectile.y <= enemy.y + 20){
            console.log("collision")
        }*/
    }
    raf = window.requestAnimationFrame(draw);
}

/*
 * start and stop animation when cursor enters/leaves the canvas
 */
enemy_canvas.addEventListener('mouseover', function(e) {
    raf = window.requestAnimationFrame(draw);
});

enemy_canvas.addEventListener('mouseout', function(e) {
    window.cancelAnimationFrame(raf);
});

/*
 * bind clicks on the canvas to creating a tower
 */
enemy_canvas.addEventListener('mousedown', function(e) {
    renderTower(...getCursorPosition(canvas, e));
})

/*
 * render a tower image on the canvas at given coordinates
 * towers are rendered on the background canvas behind the enemies
 */
const renderTower = (x,y) => {
    towers.push({x:x,y:y})
    let img = new Image();   // Create new img element
    img.addEventListener('load', function() {
        ctx.drawImage(img, x, y,55,55);
    }, false);
    img.src = "./images/tower.png"; // Set source path
}

/*
 * get the coordinates of the mouse on the canvas
 * stolen from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/18053642#18053642
 */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return [x,y];
}


