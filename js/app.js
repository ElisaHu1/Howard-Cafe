const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.menu');

menu.addEventListener('click', function() {
    menu.classList.toggle('is-active');
    menuLinks.classList.toggle('active');
});

window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    const imageContainer = document.querySelector('.image-container');

    setTimeout(function() {
        loading.style.display = 'none';
        imageContainer.style.display = 'block'; // Show the image container
    }, 2000); // Hide loading screen after 2 seconds
});
