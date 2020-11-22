import Tower from "./Tower.js";

export default class MacTower extends Tower {
    constructor(x, y) {
        super("../images/MacLogo.png", 'Mac', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
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
}