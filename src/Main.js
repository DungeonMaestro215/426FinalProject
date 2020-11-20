import Controller from "./Controller.js";
import View from "./View.js";

const backend_url = 'https://unc-td.herokuapp.com';
//const backend_url = 'http://192.168.1.10:8080';

window.onload = async () => {
    let view = new View();
    let controller = new Controller(view);
    view.controller = controller;
    view.draw();
    view.setMoney(controller.gameData.money);
    document
        .getElementById("fastforward")
        .addEventListener("click", controller.toggleFastForward.bind(controller));
    document
        .getElementById("roundStart")
        .addEventListener("click", controller.startRound.bind(controller));
    
    generateLeaderboard();
    const user = await getUser();
    //writeScore(user, 20);
    controller.loss_handlers.push((score) => writeScore(user,score));
}

async function getUser() {
    let token;
    if((token = localStorage.getItem("auth_token")) != null) {
        const x = await axios({
            method: 'post',
            url: backend_url + '/checkToken',
            headers: {Authorization: 'Bearer ' + token},
            data: {
                token: token,
            }
        })
        const profile = await axios({
            method: 'get',
            url: backend_url + '/users/' + x.data,
            headers: {Authorization: 'Bearer ' + token},
        })
        document.getElementById("register").remove();
        document.getElementById("login").outerHTML = ("<span id='loggedin' class='navbar-item'>Logged in as " + profile.data.username + " </span>");
        document.getElementById("loggedin").insertAdjacentHTML("afterend", "<button id='log_out' class='button is-primary'>Log Out</button>")
        document.getElementById("log_out").addEventListener("click",logOut);
        return x.data;
    }
}

async function logOut() {
    localStorage.setItem("auth_token", null);
    window.location = "./"
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
        document.getElementById('leaderboard').insertAdjacentHTML('beforeend', `<p>${score.username + " " + score.score + " " + score.timestamp}</p>`)

    }
    const modal = document.getElementById("leaderboard_modal");
    //modal.classList.add("is-active")
    document.getElementById("leaderboard_close").addEventListener("click", () => modal.classList.remove("is-active") );
    document.querySelector(".modal-background").addEventListener("click", () => modal.classList.remove("is-active") );
    document.getElementById('leaderboard_toggle').addEventListener("click", () => modal.classList.add("is-active"));
}