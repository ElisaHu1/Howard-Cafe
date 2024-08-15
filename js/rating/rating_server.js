const express = require('express');
const bodyParser = require('body-parser');
const { readReviews, writeReview } = require('./reviewHandler');

const app = express();
const port = process.env.PORT || 3001;

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
        food: req.body.food,
        rating: req.body.rating,
        review: req.body.review
    };

    writeReview(newReview, (err, message) => {
        if (err) return res.status(500).send('Failed to save review.');
        res.status(201).send(message);
    });
});

// Route to get all reviews
app.get('/api/reviews', (req, res) => {
    readReviews((err, reviews) => {
        if (err) return res.status(500).send('Failed to read reviews.');
        res.status(200).json(reviews);
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
