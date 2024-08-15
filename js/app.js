
window.addEventListener('load', function() {
    const loading = document.getElementById('loading');
    const imageContainer = document.querySelector('.image-container');

    setTimeout(function() {
        loading.style.display = 'none';
        imageContainer.style.display = 'block';        
    }, 500);
});

