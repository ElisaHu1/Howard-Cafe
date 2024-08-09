const stars = document.querySelectorAll(".star");
const rating = document.getElementById("rating");
const reviewText = document.getElementById("review");
const submitBtn = document.getElementById("submit");
const reviewsContainer = document.getElementById("reviews");

// Add event listeners to stars
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

// Add event listener to the submit button
submitBtn.addEventListener("click", () => {
    const review = reviewText.value.trim();
    const userRating = parseInt(rating.innerText);

    if (!userRating || !review) {
        alert("Please select a rating and provide a review before submitting.");
        return;
    }

    const newReview = {
        rating: userRating,
        review: review
    };

    // Send the review to the server
    fetch('http://localhost:3001/api/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReview)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Failed to save review');
        }
        return response.text();
    })
    .then(data => {
        console.log(data);
        // Optionally update the UI or clear the form
        reviewText.value = "";
        rating.innerText = "0";
        stars.forEach((s) => s.classList.remove("one", "two", "three", "four", "five", "selected"));
        alert('Review submitted successfully!');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Failed to submit review.');
    });
});

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
