import Controller from "./Controller.js";
import FirstMap from "./Model/FirstMap.js";
import SecondMap from "./Model/SecondMap.js";
import ThirdMap from "./Model/ThirdMap.js";
import View from "./View.js";


window.onload = () => {
    const controller = new Controller();
    document.getElementById("first-map").addEventListener("click", () => controller.resetGame(new FirstMap()));
    document.getElementById("second-map").addEventListener("click", () => controller.resetGame(new SecondMap()));
    document.getElementById("third-map").addEventListener("click", () => controller.resetGame(new ThirdMap()));
    document
        .getElementById("roundStart")
        .addEventListener("click", controller.startRound.bind(controller));
    document
        .getElementById("fastForward")
        .addEventListener("click", controller.toggleFastForward.bind(controller));
}