let model = null;
let view = null;
let control = null;

window.onload = () => {
    // Setup MVC
    model = new TDModel(3);
    view = new TDView(model);
    control = new TDController(model, view);

    // Load into DOM
    document.querySelector('#root').append(view.div);
};