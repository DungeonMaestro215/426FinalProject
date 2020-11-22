import Tower from "./Tower.js";

export default class WindowsTower extends Tower {
    constructor(x, y) {
        super("../images/WindowsLogo.png", 'Wendy', x, y, "first", 10);
        this.range = 200;
        this.fire_rate = 2;
        this.description = 'Mr. Gates would be proud.';
        this.get_bullet_sprite = () => Math.random() > 0.66 ? "../images/one_green.png" : "../images/zero_green.png";
        this.proj_size=25;
    }
}