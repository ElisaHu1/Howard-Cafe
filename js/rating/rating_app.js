const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");
// Get the dish input element
const foodInput = document.getElementById("foodInput");
const foodName = document.querySelector(".container").getAttribute("data-dish");

const ratingContainer = document.getElementById('ratingsContainer');
const container = document.querySelector('.container');

loadReviews(ratingContainer);


stars.forEach((star) => {
    star.addEventListener("click", () => {
        const value = parseInt(star.getAttribute("data-value"));
        rating.innerText = value;

        // Remove all existing classes from stars
        stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five"));

        // Add the appropriate class to each star based on the selected star's value
        stars.forEach((s, index) => {
            if (index < value) {
                s.classList.add(getStarColorClass(value));
            }
        });

        // Remove "selected" class from all stars
        stars.forEach((s) => s.classList.remove("selected"));
        // Add "selected" class to the clicked star
        star.classList.add("selected");
    });
});

submitBtn.addEventListener("click", () => {
    const comment = reviewText.value.trim();
    const userRating = parseInt(rating.innerText);
    const dish = foodInput.value.trim();  // Get the dish name from input

    if (!userRating || !comment || !dish) {  // Include dish name validation
        alert("Please select a rating, provide a dish name, and a comment before submitting.");
        return;
    }

    const newReview = {
        dish: dish,  // Use the dish name from input
        rating: userRating,
        comment: comment
    };

    // Send the comment to the server
    fetch('http://localhost:3000/submitReview', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-access-token': localStorage.getItem('token')
        },
        body: JSON.stringify(newReview)
    })
    .then(response => {
        if (response.status === 403) {
            throw new Error('You need to login to submit comment');
        }
        else if (!response.ok) {
            throw new Error('Failed to save comment, contact admin');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        // Optionally update the UI or clear the form
        foodInput.value = "";  // Clear the dish input
        reviewText.value = "";
        rating.innerText = "0";
        stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five", "selected"));
        alert('Review submitted successfully! \nWe will comment it as soon as possible :)');
    })
    .catch(error => {
        console.error('Error:', error);
        alert(error);
    });
});

if (isTokenValid()) {
    container.classList.remove('hidden');
}

// Function to determine the class name for the star based on the rating value
function getStarColorClass(value) {
    switch (value) {
        case 1:
            return "one";
        case 2:
            return "two";
        case 3:
            return "three";
        case 4:
            return "four";
        case 5:
            return "five";
        default:
            return "";
    }
}

function loadReviews(container) {
    fetch('http://localhost:3000/getReviews')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(reviews => {
            container.innerHTML = '<h2>Menu Reviews</h2>';
            reviews.forEach(review => {
                const dishReview = document.createElement('div');
                dishReview.innerHTML = `<h3>${review.dish}</h3>`;
                review.comments.forEach(comment => {
                    dishReview.innerHTML += `
                        <p><strong>${comment.user}:</strong> ${comment.rating} stars - ${comment.comment}</p>
                    `;
                });
                container.appendChild(dishReview);
            });
        })
        .catch(error => {
            console.error('Error fetching reviews:', error);
            container.innerHTML = 'Failed to load reviews.';
        });
}


function isTokenValid() {
    const token = localStorage.getItem('token');
    return token !== null && token !== '';
}

