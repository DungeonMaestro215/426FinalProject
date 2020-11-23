import Controller from "./Controller.js";
import FirstMap from "./Model/FirstMap.js";
import SecondMap from "./Model/SecondMap.js";
import ThirdMap from "./Model/ThirdMap.js";
import View from "./View.js";

const backend_url = 'https://unc-td.herokuapp.com';

window.onload = async () => {
    const controller = new Controller();
    document.getElementById("first-map").addEventListener("click", () => controller.resetGame(new FirstMap()));
    document.getElementById("second-map").addEventListener("click", () => controller.resetGame(new SecondMap()));
    document.getElementById("third-map").addEventListener("click", () => controller.resetGame(new ThirdMap()));
    document
        .getElementById("fastForward")
        .addEventListener("click", controller.toggleFastForward.bind(controller));
    document
        .getElementById("roundStart")
        .addEventListener("click", controller.startRound.bind(controller));
    document
        .getElementById("mute")
        .addEventListener("click", controller.muteSound.bind(controller));

    generateLeaderboard();
    const user = await getUser();
    controller.loss_handlers.push((score) => writeScore(user,score));
}



async function writeScore(user_id, score){
    if(user_id == null) return;
    let token;
    if((token = localStorage.getItem("auth_token")) != null) {
        axios({
            method: 'post',
            url: backend_url + '/users/' + user_id + '/scores',
            headers: {"Authorization": "Bearer " + token, "Content-Type": "Application/JSON"},
            data: score
        });
    }
}


async function generateLeaderboard() {
    const leaderboard = await axios({
        type: "GET",
        url: backend_url + "/scores?limit=20"
    })
    for(const score of leaderboard.data){
        document.getElementById('leaderboard').insertAdjacentHTML('beforeend', `<p>${score.username + " " + score.score + " " + score.timestamp.split("T")[0]}</p>`)

    }
    const modal = document.getElementById("leaderboard_modal");
    //modal.classList.add("is-active")
    document.getElementById("leaderboard_close").addEventListener("click", () => modal.classList.remove("is-active") );
    document.querySelector(".modal-background").addEventListener("click", () => modal.classList.remove("is-active") );
    document.getElementById('leaderboard_toggle').addEventListener("click", () => modal.classList.add("is-active"));
}