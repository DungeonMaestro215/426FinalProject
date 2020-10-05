const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const enemy_canvas = document.getElementById('enemies');
const enemy_ctx = enemy_canvas.getContext('2d');

/*
 * render the map image
 */
let img = new Image();   // Create new img element
img.addEventListener('load', function() {
    ctx.drawImage(img, 0, 0,500,500);
    }, false);
img.src = "./images/map.png"; // Set source path


/*
 * get the coordinates of the mouse on the canvas
 * stolen from https://stackoverflow.com/questions/55677/how-do-i-get-the-coordinates-of-a-mouse-click-on-a-canvas-element/18053642#18053642
 */
function getCursorPosition(canvas, event) {
    const rect = canvas.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    console.log("x: " + x + " y: " + y)
    return {x,y};
}

/*
 * bind clicks on the canvas to creating a tower
 */
enemy_canvas.addEventListener('mousedown', function(e) {
    const {x, y} = getCursorPosition(canvas, e);
    renderTower(x,y);
})

/*
 * render a tower image on the canvas at given coordinates
 */
const renderTower = (x,y) => {
    let img = new Image();   // Create new img element
    img.addEventListener('load', function() {
        ctx.drawImage(img, x, y,55,55);
    }, false);
    img.src = "./images/tower.png"; // Set source path
}

