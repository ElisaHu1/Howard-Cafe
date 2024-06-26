const loginContainer = document.querySelector('.login-container');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');

registerLink.addEventListener('click', ()=> {

    loginContainer.classList.add('active');

});