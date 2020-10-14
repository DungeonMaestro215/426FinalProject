//Render a "death" screen on the foreground canvas
export const initiateLossScreen = (foreground) => {
    const foreground_ctx = foreground.getContext('2d');
    let start_time = 0;
    let die_raf;
    const die = (timestamp) => {
        let o = 0;
        if(start_time === 0) {
            start_time = timestamp;
        } else {
            o = (timestamp-start_time)/1000;
        }
        if(o > 0.8) {
            o = 0.8;
            return;
        }
        foreground_ctx.clearRect(0,0,500,500);
        foreground_ctx.fillStyle = 'rgba(0,0,0,' + o + ')';
        foreground_ctx.fillRect(0,0, 500,500);
        foreground_ctx.font = (o * 66) + 'px serif';
        foreground_ctx.textAlign = 'center';
        foreground_ctx.textBaseline = 'middle';
        foreground_ctx.fillStyle = 'rgb(199,10,0)';
        if(o > 0.2) {
            foreground_ctx.fillText('YOU DIED', foreground.width/2, foreground.height/2);
        }
        die_raf = window.requestAnimationFrame(die)
    }
    window.requestAnimationFrame(die);
}
