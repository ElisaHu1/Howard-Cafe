const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3001;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Route to handle POST requests
app.post('/api/reviews', (req, res) => {
    const newReview = req.body;

    // Read the current reviews from the file
    fs.readFile('reviews.json', (err, data) => {
        if (err) {
            res.status(500).send('Error reading from reviews file.');
            return;
        }

        // Parse the existing reviews
        let reviews = [];
        try {
            reviews = JSON.parse(data.toString());
        } catch (parseErr) {
            res.status(500).send('Error parsing reviews data.');
            return;
        }

        // Add the new review
        reviews.push(newReview);

        // Write the updated reviews back to the file
        fs.writeFile('reviews.json', JSON.stringify(reviews, null, 2), (writeErr) => {
            if (writeErr) {
                res.status(500).send('Error writing to reviews file.');
                return;
            }

            res.send('Review submitted successfully');
        });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
