export default class Enemy {
    sprite;
    x;
    y;
    velocity = 1;
    currentNode = 0;
    size = 20;

    constructor(sprite, startX,startY) {
        this.sprite = sprite;
        this.x = startX;
        this.y = startY;
    }

    getVx(path){
        if(path[this.currentNode][2] === 'u' ||  path[this.currentNode][2] === 'd') return 0;
        return (path[this.currentNode][2] === 'l') ? -1 * this.velocity : this.velocity;
    }

    getVy(path){
        if(path[this.currentNode][2] === 'l' || path[this.currentNode][2] === 'r') return 0;
        return (path[this.currentNode][2] === 'u') ? -1 * this.velocity : this.velocity;
    }

    draw(context) {
        context.drawImage(this.sprite, this.x, this.y, this.size, this.size);
    }

    move(path){
        //stop if there is no next node
        if(this.currentNode >= path.length - 1){
            return;
        }

        // use the direction of the current node to determine how to change position
        switch(path[this.currentNode][2]){
            case 'u':
                //check if we've reached the current node's position
                if(this.y <= path[this.currentNode+1][1]) {
                    //go to next node
                    this.currentNode++;
                } else {
                    //move
                    this.y-=this.velocity;
                }
                break;
            case 'd':
                if(this.y >= path[this.currentNode+1][1]) {
                    this.currentNode++;
                } else {
                    this.y+=this.velocity;
                }
                break;
            case 'l':
                if(this.x <= path[this.currentNode+1][0]) {
                    this.currentNode++;
                } else {
                    this.x-=this.velocity;
                }
                break;
            case 'r':
                if(this.x >= path[this.currentNode+1][0]) {
                    this.currentNode++;
                } else {
                    this.x+=this.velocity;
                }
                break;
        }
    }
}