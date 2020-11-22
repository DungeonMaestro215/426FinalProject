const backend_url = 'https://unc-td.herokuapp.com';

async function getUser() {
    let token;
    if ((token = localStorage.getItem("auth_token")) != null && token !== "null") {
        let x;
        try {
            x = await axios({
                method: 'post',
                url: backend_url + '/checkToken',
                headers: {Authorization: 'Bearer ' + token},
                data: {
                    token: token,
                }
            })
        } catch(e){
            localStorage.removeItem("auth_token");
            return;
        }
        const profile = await axios({
            method: 'get',
            url: backend_url + '/users/' + x.data,
            headers: {Authorization: 'Bearer ' + token},
        })

        const userdropdown = (username) => `
                <div class="dropdown">
                  <span id='loggedin' class='navbar-item is-vcentered'> ${username} </span>
                  <div id="myDropdown" class="dropdown-content">
                    <a href="../profile.html">My Profile</a>
                    <a href="../search.html">Search Users</a>
                    <a href="../">Play</a>
                  </div>
                </div>
            `

        document.getElementById("register").remove();
        document.getElementById("login").outerHTML = "<button id='log_out' class='button is-primary'>Log Out</button>";
        document.getElementById("log_out").addEventListener("click", logOut);
        document.querySelector(".buttons").insertAdjacentHTML("beforebegin",
            userdropdown(profile.data.username)
        );
        document.getElementById("loggedin").addEventListener("click", () => {
            console.log("sneed")
            activateUserDropdown();
        })

        function activateUserDropdown() {
            document.getElementById("myDropdown").classList.toggle("show");
        }

        window.onclick = function(event) {
            if (!event.target.matches('#loggedin')) {
                let dropdowns = document.getElementsByClassName("dropdown-content");
                for (let i = 0; i < dropdowns.length; i++) {
                    let openDropdown = dropdowns[i];
                    if (openDropdown.classList.contains('show')) {
                        openDropdown.classList.remove('show');
                    }
                }
            }
        }

        return x.data;
    }
}

async function logOut() {
    localStorage.setItem("auth_token", null);
    window.location = "./"
}