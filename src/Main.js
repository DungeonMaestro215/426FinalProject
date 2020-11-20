import Controller from "./Controller.js";
import View from "./View.js";

window.onload = () => {
    let view = new View();
    let controller = new Controller(view);
    view.controller = controller;
    view.draw();
    view.setMoney(controller.gameData.money);
    document
        .getElementById("roundStart")
        .addEventListener("click", controller.startRound.bind(controller));
    document
        .getElementById("fastforward")
        .addEventListener("click", controller.toggleFastForward.bind(controller));
}
