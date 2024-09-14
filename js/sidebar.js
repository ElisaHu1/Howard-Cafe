// load sidebar.html, and insert it into the #sidebar-container

document.addEventListener('DOMContentLoaded', function () {
    fetch('../pages/sidebar.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('sidebar-container').innerHTML = data;

            // after sidebar is loaded, execute login/logout logic
            const loginButton = document.querySelector(".btn")
            const logoutButton = document.getElementById("logoutButton")

            const isLoggedIn = localStorage.getItem('token');
            if(isLoggedIn) {
                loginButton.classList.add('hidden')
                logoutButton.classList.remove('hidden')
            } else {
                loginButton.classList.remove('hidden')
                logoutButton.classList.add('hidden')
            }

            document.getElementById('logoutButton').addEventListener('click', function () {
                localStorage.removeItem('token')
            })
        })
})