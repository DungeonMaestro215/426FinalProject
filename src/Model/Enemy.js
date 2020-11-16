export default class Enemy {
    sprite;
    x;
    y;
    health;
    maxHealth;
    velocity = 3;
    currentNode = 0;
    size = 30;
    endCallbacks = [];
    reward = 5;
    shot_by;

    constructor(sprite, startX,startY) {
        this.sprite = sprite;
        this.x = startX;
        this.y = startY;
    }

    handleCollision(projectile){
        this.health -= projectile.damage;
    }

    addEndCallback(f){
        this.endCallbacks.push(f);
    }

    getState(){
        return this.health > 0 ? "alive" : "dead";
    }

    getVx(path){
        if(path[this.currentNode][2] === 'u' ||  path[this.currentNode][2] === 'd') return 0;
        return (path[this.currentNode][2] === 'l') ? -1 * this.velocity : this.velocity;
    }

    getVy(path){
        if(path[this.currentNode][2] === 'l' || path[this.currentNode][2] === 'r') return 0;
        return (path[this.currentNode][2] === 'u') ? -1 * this.velocity : this.velocity;
    }

    getReward() {
        return this.reward;
    }

    draw(context) {
        context.drawImage(this.sprite, this.x, this.y, this.size, this.size);
        
        // Health Bar
        const mapped_health = this.size / this.maxHealth * this.health;
        context.fillStyle = mapped_health > .25 * this.maxHealth ? 'rgba(0, 255, 0, .7)' : 'rgba(255, 0, 0, .7)';
        context.fillRect(this.x, this.y - 10, mapped_health, 5);
    }

    move(path){
        //stop if there is no next node
        if(this.currentNode >= path.length - 1){
            for(const f of this.endCallbacks) {
                f(this);
            }
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
