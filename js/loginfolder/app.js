document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const showRegisterForm = document.getElementById('showRegisterForm');
    const showLoginForm = document.getElementById('showLoginForm');
    const registerMessage = document.getElementById('registerMessage');
    const loginMessage = document.getElementById('loginMessage');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const dashboard = document.getElementById('dashboard');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');

    showRegisterForm.addEventListener("click", function () {
        loginFormContainer.classList.add("hidden")
        registerFormContainer.classList.remove("hidden")
    })

    showLoginForm.addEventListener("click", function () {
        loginFormContainer.classList.remove("hidden")
        registerFormContainer.classList.add("hidden")
    })

    registerForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const keyword = document.getElementById('keyword').value;

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password, keyword })
        })
            .then(response => response.json())
            .then(data => {
                registerMessage.textContent = data.message;
                if (response.status === 201) {
                    registerForm.reset();
                    alert('User registered successfully! \n head to the login page to login :)');
                } else {
                    alert('User registered FAILED! \n '+ data.message);
                }
            })
            .catch(error => {
                alert('User registered FAILED! \n '+ data.message);
                console.error('Error:', error);
            });
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = document.getElementById('loginUsername').value;
        const password = document.getElementById('loginPassword').value;

        fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })
            .then(response => response.json())
            .then(data => {
                if (data.auth && data.token) {
                    localStorage.setItem('token', data.token);
                    welcomeMessage.textContent = `Welcome, ${username}!`;
                    registerFormContainer.classList.add('hidden');
                    loginFormContainer.classList.add('hidden');
                    dashboard.classList.remove('hidden');
                    window.location.href = 'index.html';
                } else {
                    loginMessage.textContent = 'Login failed';
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    logoutButton.addEventListener('click', function() {
        localStorage.removeItem('token');
        registerFormContainer.classList.add('hidden');
        loginFormContainer.classList.remove('hidden');
        dashboard.classList.add('hidden');
    });

    function checkLoginStatus() {
        const token = localStorage.getItem('token');
        if (token) {
            fetch('http://localhost:3000/dashboard', {
                method: 'GET',
                headers: {
                    'x-access-token': token
                }
            })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Welcome to your dashboard') {
                        welcomeMessage.textContent = 'Welcome back!';
                        registerFormContainer.classList.add('hidden');
                        loginFormContainer.classList.add('hidden');
                        dashboard.classList.remove('hidden');
                    } else {
                        localStorage.removeItem('token');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    localStorage.removeItem('token');
                });
        }
    }

    checkLoginStatus();
});