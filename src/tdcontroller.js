let TDController = class {
    constructor(model, view) {
        this.model = model;
        this.view = view;

        // When something happens in the view, make something happen
        view.addListener((e) => {
            // TODO
            let square = model.grid[e.row][e.col];
            if (e.action == "click") {
                square.changeBG();
            }
        });
    }
}
