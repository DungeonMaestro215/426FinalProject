import Tower from "./Tower.js";

export default class MacTower extends Tower {
    constructor(x, y) {
        super("../images/MacLogo.png", 'Mac', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
        this.cost = 150;
        this.damage = 1;
        this.description = 'Clearly the worst OS. Targets the closest enemy.';
        this.get_bullet_sprite = () => Math.random() > 0.66 ? "../images/one_green.png" : "../images/zero_green.png";
        this.proj_size=25;
        this.special_upgrades.push({
            name: "ARM Instruction Set",
            description: "Optimizations allowed by the new instruction set increase tower attack speed by 15%.",
            cost: 1000,
            requiredLevel: 5,
            available: true,
            effect: () => {
                if(this.special_upgrades.find(x => x.name==="ARM Instruction Set").available){
                    this.fire_rate *= 1.15;
                    this.special_upgrades.find(x => x.name==="ARM Instruction Set").available = false;
                }
            }
        });
    }

    upgrade() {
        this.sell += this.upgrade_cost / 2;
        this.sell = Math.ceil(this.sell);
        this.upgrade_cost += this.upgrade_cost;
        this.level++;
        this.damage += 1;
    }
}