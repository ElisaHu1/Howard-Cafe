document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-button');
    const menuToggle = document.getElementById('mobile-menu');
    const menu = document.getElementById('menu');

    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling; // Get the content div next to the clicked button

            // Toggle the active class on the clicked button
            this.classList.toggle('active');

            // Close all other content sections except the one clicked
            menuButtons.forEach(otherButton => {
                if (otherButton !== this) {
                    otherButton.classList.remove('active');
                    otherButton.nextElementSibling.style.display = 'none';
                }
            });

            // Toggle the display of the content div
            if (content.style.display === 'block') {
                content.style.display = 'none';
            } else {
                content.style.display = 'block';
            }
        });
    });

    menuToggle.addEventListener('click', function() {
        menuToggle.classList.toggle('is-active');
        menu.classList.toggle('active');
    });
});
