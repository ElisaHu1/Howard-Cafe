const loginContainer = document.querySelector('.login-container');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

const loginFormContainer = document.getElementById('loginFormContainer');
const registerFormContainer = document.getElementById('registerFormContainer');

registerLink.addEventListener('click', ()=> {

    loginContainer.classList.add('active');

});

document.getElementById('showRegisterForm').addEventListener('click', () => {
    loginFormContainer.classList.add('hidden');
    registerFormContainer.classList.remove('hidden');
});

document.getElementById('showLoginForm').addEventListener('click', () => {
    registerFormContainer.classList.add('hidden');
    loginFormContainer.classList.remove('hidden');
});
