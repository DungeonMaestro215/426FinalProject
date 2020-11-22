import Tower from "./Tower.js";

export default class LinuxTower extends Tower {
    constructor(x, y) {
        super("../images/LinuxTransparent.png", 'Tux', x, y, "closest",12);
        this.damage = 5;
        this.cost = 200;
        this.fire_rate = 1;
        this.get_bullet_sprite = () => Math.random() > 0.66 ? "../images/one_green.png" : "../images/zero_green.png";
        this.proj_size=25;
        this.special_upgrades.push({
            name: "Install Gentoo",
            description: "A secret compiler flag allows this penguin to penetrate enemy armor.",
            cost: 1000,
            requiredLevel: 4,
            available: true,
            effect: () => {
                if(this.special_upgrades.find(x => x.name==="Install Gentoo").available){
                    this.get_bullet_sprite = () => Math.random() > 0.66 ? "../images/one.png" : "../images/zero.png";
                    this.sprite = "../images/GentooLinux.png"
                    this.armor_penetration = true;
                    this.special_upgrades.find(x => x.name==="Install Gentoo").available = false;
                }
            }
        })
    }

    /*
     * overriding default Tower enemy selection logic
     * Selects the tower that is furthest along and within its range
     */
    selectTarget(enemies) {
        let target, min_d;

        for (let i = 0; i < enemies.length; i++) {
            let dx = enemies[i].x - this.x;
            let dy = enemies[i].y - this.y;
            min_d = Math.sqrt(dx ** 2 + dy ** 2);
            if (min_d < this.range) {
                target = enemies[i];
                break;
            }
        }
        return [target, min_d];
    }

    upgrade() {
        this.level++;
        this.upgrade_cost *= 4;
        this.damage += 1;
        this.fire_rate += .5;
        // Fix weird issues with decimals
        // this.damage = Math.round(this.damage * 10) / 10;
    }
    
}