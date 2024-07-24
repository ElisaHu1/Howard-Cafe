document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const logoutButton = document.getElementById('logoutButton');
    const registerMessage = document.getElementById('registerMessage');
    const loginMessage = document.getElementById('loginMessage');
    const welcomeMessage = document.getElementById('welcomeMessage');
    const dashboard = document.getElementById('dashboard');
    const registerFormContainer = document.getElementById('registerFormContainer');
    const loginFormContainer = document.getElementById('loginFormContainer');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const loginUsername = document.getElementById('loginUsername');
    const loginPassword = document.getElementById('loginPassword');

    if (localStorage.getItem('rememberMe') === 'true') {
        loginUsername.value = localStorage.getItem('username') || '';
        loginPassword.value = localStorage.getItem('password') || ''; 
        rememberMeCheckbox.checked = true;
    }

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
                if (data.message === 'User registered successfully') {
                    registerForm.reset();
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    });

    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const username = loginUsername.value;
        const password = loginPassword.value;

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

                    if (rememberMeCheckbox.checked) {
                        localStorage.setItem('rememberMe', 'true');
                        localStorage.setItem('username', username);
                        localStorage.setItem('password', password); 
                    } else {
                        localStorage.setItem('rememberMe', 'false');
                        localStorage.removeItem('username');
                        localStorage.removeItem('password');
                    }


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
        registerFormContainer.classList.remove('hidden');
        loginFormContainer.classList.remove('hidden');
        dashboard.classList.add('hidden');


        window.location.href = 'index.html';
    });

    function toggleAuthButton() {
        const authButton = document.getElementById('authButton');
        const token = localStorage.getItem('token');

        if (token) {
            authButton.innerHTML = '<a href="#" id="logoutButton" class="button">Log Out</a>';
            document.getElementById('logoutButton').addEventListener('click', function() {
                localStorage.removeItem('token');
                toggleAuthButton();
                window.location.href = 'index.html'; 
            });
        } else {
            authButton.innerHTML = '<a href="login.html" class="button">Log In</a>';
        }
    }

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
                    toggleAuthButton();
                })
                .catch(error => {
                    console.error('Error:', error);
                    localStorage.removeItem('token');
                    toggleAuthButton();
                });
        } else {
            toggleAuthButton();
        }
    }

    checkLoginStatus();
});
