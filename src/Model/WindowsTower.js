import Tower from "./Tower.js";

export default class WindowsTower extends Tower {
    constructor(x, y) {
        super("../images/WindowsLogo.png", 'Wendy', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
        this.description = 'Mr. Gates would be proud. Targets the closest enemy.';
        this.get_bullet_sprite = () => Math.random() > 0.66 ? "../images/one_green.png" : "../images/zero_green.png";
        this.proj_size=25;
        this.cost = 100;
        this.special_upgrades.push({
            name: "Pro",
            description: "Major damage increase",
            cost: 2000,
            requiredLevel: 7,
            available: true,
            effect: () => {
                if(this.special_upgrades.find(x => x.name==="Pro").available) {
                    this.damage += 10;
                    this.special_upgrades.find(x => x.name==="Pro").available = false;
                    this.sprite = "../images/WindowsGreen.png";
                }
            }
        });
    }

    upgrade() {
        this.sell += this.upgrade_cost / 2;
        this.sell = Math.ceil(this.sell);
        this.upgrade_cost += this.upgrade_cost;
        this.level++;
        if (this.level === 2) {
            this.damage += .5;
        } else {
            this.damage += 1;
        }
    }
}