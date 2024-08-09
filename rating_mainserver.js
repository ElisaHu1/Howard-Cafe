const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3001;

const reviewsFilePath = path.join(__dirname, 'reviews.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Enable CORS for testing purposes
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

// Route to handle posting reviews
app.post('/api/reviews', (req, res) => {
    const newReview = {
        rating: req.body.rating,
        review: req.body.review
    };

    console.log('Received new review:', newReview);

    // Read existing reviews
    fs.readFile(reviewsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).send('Error reading reviews file.');
        }

        const reviews = data ? JSON.parse(data) : [];

        // Add the new review
        reviews.push(newReview);

        // Write updated reviews back to file
        fs.writeFile(reviewsFilePath, JSON.stringify(reviews, null, 2), (err) => {
            if (err) {
                console.error('Error writing reviews file:', err);
                return res.status(500).send('Error writing reviews file.');
            }

            console.log('Review saved successfully.');
            res.status(201).send('Review saved successfully.');
        });
    });
});

// Route to get all reviews
app.get('/api/reviews', (req, res) => {
    fs.readFile(reviewsFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading reviews file:', err);
            return res.status(500).send('Error reading reviews file.');
        }

        const reviews = data ? JSON.parse(data) : [];
        res.status(200).json(reviews);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
