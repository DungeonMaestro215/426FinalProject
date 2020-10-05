let TDModel = class {
    constructor(grid_size) {
        this.grid_size = grid_size;
        this.grid = [];
        this.listeners = [];

        // Initialize off LEDs
        for (let i = 0; i < grid_size; i++) {
            this.grid[i] = [];
            for (let j = 0; j < grid_size; j++) {
                this.grid[i][j] = new Square(i, j);
            }
        }
    }

    addListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx == -1) {
            this.listeners.push(listener);
        }
    }

    removeListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx != -1) {
            this.listeners.splice(idx, 1);
        }
    }

    updateListeners(event) {
        this.listeners.forEach((l) => l(event));
    }

};

let Square = class {
    constructor(row, col) {
        this.bg = 0;
        this.row = row;
        this.col = col;
        this.listeners = [];
    }

    changeBG() {
        // TODO
        this.bg++;
        this.updateListeners(this);
    }

    addListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx == -1) {
            this.listeners.push(listener);
        }
    }

    removeListener(listener) {
        let idx = this.listeners.findIndex((l) => l == listener);
        if (idx != -1) {
            this.listeners.splice(idx, 1);
        }
    }

    updateListeners(event) {
        this.listeners.forEach((l) => l(event));
    }

}