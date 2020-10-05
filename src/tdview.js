let TDView = class {
    constructor(model) {
        this.model = model;
        this.listeners = [];
        this.div = document.createElement("div");

        let grid = document.createElement("div");
        grid.setAttribute("class", "grid");

        let square_click_handler = (e) => {
            // TODO
            let square = e.target;
            console.log(square);
            this.updateListeners({
                action: "click",
                row: square.data_model.row,
                col: square.data_model.col
            });
        }

        for (let i = 0; i < model.grid_size; i++) {
            let row = document.createElement("div");
            row.setAttribute("class", "row");
            for (let j = 0; j < model.grid_size; j++) {
                let square_view = new SquareView(model.grid[i][j]);
                square_view.div.addEventListener("click", square_click_handler);
                row.appendChild(square_view.div);
            }
            grid.appendChild(row);
        }

        this.div.appendChild(grid);

        // When model updates, do something to this view
        this.model.addListener((e) => {
            // TODO
        });
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

let SquareView = class {
    constructor(square_model) {
        this.div = document.createElement("div");
        this.div.setAttribute("class", "square");
        this.div.data_model = square_model;
        this.div.innerHTML = square_model.bg;

        // When model updates, do something to this view.
        square_model.addListener(() => {
            this.update();
        });
    }
    
    update() {
        let square_model = this.div.data_model;
        this.div.innerHTML = square_model.bg;
    }

}
