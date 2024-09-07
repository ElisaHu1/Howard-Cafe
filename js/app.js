
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    const imageContainer = document.querySelector('.image-container');

    setTimeout(function() {
        loading.style.display = 'none';
        imageContainer.style.display = 'block';        
    }, 500);
});

document.addEventListener('DOMContentLoaded', function() {
    const logoutButton = document.getElementById('logoutButton');

        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('token');
            alert('Logout successfully! :)');
        });


});
