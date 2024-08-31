document.addEventListener('DOMContentLoaded', function() {
    const menuButtons = document.querySelectorAll('.menu-button')[0];
    const menuToggle = document.getElementById('mobile-menu');
    const menu = document.getElementById('menu');
    // todo: get id of food name, rating and description as const
    const dish = document.getElementById('dish').value;
    const rating = document.getElementById('rating').value;
    const comment = document.getElementById('comment').value;

    // todo: delete for each loop, compass the fetch in the demo
    menuButtons.forEach(button => {
        button.addEventListener('click', function() {
            const content = this.nextElementSibling;
            this.classList.toggle('active');


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


//        fetch('http://localhost:3000/submitReview', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//                 'x-access-token': localStorage.getItem('token') // Add token for authorization
//             },
//             body: JSON.stringify({ dish, rating, comment })
//         })
//             .then(response => {
//                 if (response.status === 200) {
//                     return response.text();
//                 } else if (response.status === 401) {
//                     throw new Error('Unauthorized: You need to log in to submit a review.');
//                 } else {
//                     throw new Error('Something went wrong. Please try again.');
//                 }
//             })
//             .then(message => {
//                 // Hide the message containers initially
//                 menuContainer.style.display = 'none';
//                 ratingContainer.style.display = 'none';
//
//                 // Show the success message
//                 const reviewMessageElement = document.getElementById('reviewMessage');
//                 reviewMessageElement.style.display = 'block';
//                 reviewMessageElement.innerText = message;
//
//                 // Clear the form inputs
//                 document.getElementById('reviewForm').reset();
//
//                 // Refresh the reviews
//                 clearReviews(menuContainer); // Clear the existing reviews
//                 loadReviews(menuContainer);  // Load the updated reviews
//             })
//             .catch(error => {
//                 const reviewMessageElement = document.getElementById('reviewMessage');
//                 reviewMessageElement.style.display = 'block';
//                 reviewMessageElement.innerText = error.message;
//             });
