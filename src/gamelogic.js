let kmp_img = new Image();   // Create new img element
kmp_img.src = "./images/kmp.png"; // Set source path

const steering_nodes = [
    [3,60,'r'],
    [140,60,'d'],
    [140,140,'r'],
    [280,140,'u'],
    [280,60,'r'],
    [424,60,'r'],
];


let kmp = {
    x: 3,
    y: 50,
    vx: 0.5,
    vy: 0,
    node: 0,
    draw: function() {
        enemy_ctx.drawImage(kmp_img, this.x,this.y,20,20);
    }
}
let raf;

function draw() {
    enemy_ctx.clearRect(0,0, enemy_canvas.width, enemy_canvas.height);
    kmp.draw();
    if(kmp.node >= steering_nodes.length - 1){
        window.cancelAnimationFrame(raf);
        return;
    }
    switch(steering_nodes[kmp.node][2]){
        case 'u':
            if(kmp.y <= steering_nodes[kmp.node+1][1]) {
                kmp.node++;
            } else {
                kmp.y--;
            }
            break;
        case 'd':
            if(kmp.y >= steering_nodes[kmp.node+1][1]) {
                kmp.node++;
            } else {
                kmp.y++;
            }
            break;
        case 'l':
            if(kmp.x <= steering_nodes[kmp.node+1][0]) {
                kmp.node++;
            } else {
                kmp.x--;
            }
            break;
        case 'r':
            if(kmp.x >= steering_nodes[kmp.node+1][0]) {
                kmp.node++;
            } else {
                kmp.x++;
            }
            break;
    }
    raf = window.requestAnimationFrame(draw);
}
enemy_canvas.addEventListener('mouseover', function(e) {
    raf = window.requestAnimationFrame(draw);
});

enemy_canvas.addEventListener('mouseout', function(e) {
    window.cancelAnimationFrame(raf);
});

kmp.draw();

