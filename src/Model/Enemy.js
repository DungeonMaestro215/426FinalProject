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
    damage;

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
        switch (path[this.currentNode][2]) {
            case 'u':
            case 'd':
                return 0;
            case 'l':
                return -1 * this.velocity;
            case 'r':
                return this.velocity;
            case 'ul':
            case 'dl':
                return -Math.sqrt(2) * this.velocity;
            case 'ur':
            case 'dr':
                return Math.sqrt(2) * this.velocity;
        }
    }

    getVy(path){
        switch (path[this.currentNode][2]) {
            case 'l':
            case 'r':
                return 0;
            case 'u':
                return -1 * this.velocity;
            case 'd':
                return this.velocity;
            case 'ul':
            case 'ur':
                return -Math.sqrt(2) * this.velocity;
            case 'dl':
            case 'dr':
                return Math.sqrt(2) * this.velocity;
        }
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
            case 'dl':
            case 'ul':
            case 'l':
                if(this.x <= path[this.currentNode+1][0]) {
                    this.currentNode++;
                } else {
                    this.x+=this.getVx(path);
                    this.y+=this.getVy(path);
                }
                break;
            case 'dr':
            case 'ur':
            case 'r':
                if(this.x >= path[this.currentNode+1][0]) {
                    this.currentNode++;
                } else {
                    this.x+=this.getVx(path);
                    this.y+=this.getVy(path);
                }
                break;
        }
    }
}
