const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.navbar-menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

document.querySelector('.navbar__toggle').addEventListener('click', function() {
    document.querySelector('.navbar__menu').classList.toggle('active');
});

