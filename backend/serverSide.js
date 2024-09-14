const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const fs = require("fs");

const app = express();
const PORT = 3000;
const SECRET_KEY = 'your_secret_key';
const VALID_KEYWORD = 'your_keyword'; 
const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'adminpassword'; 

app.use(cors()); 
app.use(bodyParser.json());


const db = new sqlite3.Database('./users.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        // Create users table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE,
            password TEXT
        )`, (err) => {
            if (err) {
                console.error('Error creating users table:', err.message);
            } else {
                // Insert admin user if not already present
                const hashedPassword = bcrypt.hashSync(ADMIN_PASSWORD, 8);
                db.run(`INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)`, [ADMIN_USERNAME, hashedPassword], (err) => {
                    if (err) {
                        console.error('Error creating admin user:', err.message);
                    } else {
                        console.log('Admin user created or already exists.');
                    }
                });
            }
        });
    }
});

// Register endpoint
app.post('/register', (req, res) => {
    const { username, password, keyword } = req.body;

    if (keyword !== VALID_KEYWORD) {
        return res.status(400).json({ message: 'Invalid keyword' });
    }

    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run(`INSERT INTO users (username, password) VALUES (?, ?)`, [username, hashedPassword], (err) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT' && err.errno === 19) {
                return res.status(409).json({ message: 'Username is already taken' });
            }
            console.error("database error: ", err)
            return res.status(500).json({ message: 'internal service error' });
        }
        res.status(201).json({ message: 'User registered successfully' });
    });
});

// Login endpoint
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get(`SELECT * FROM users WHERE username = ?`, [username], (err, user) => {
        if (err || !user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) {
            return res.status(401).json({ message: 'Invalid password' });
        }

        const token = jwt.sign({ id: user.username }, SECRET_KEY, { expiresIn: 86400 });
        res.status(200).json({ auth: true, token });
    });
});

// Middleware to verify token
function verifyToken(req, res, next) {
    const token = req.headers['x-access-token'];
    if (!token) {
        return res.status(403).json({ message: 'No token provided' });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(500).json({ message: 'Failed to authenticate token' });
        }

        req.userId = decoded.id;
        next();
    });
}
// New route to serve reviews JSON file
app.get('/getReviews', (req, res) => {
    fs.readFile('reviews.json', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading reviews file' });
        }
        res.status(200).json(JSON.parse(data));
    });
});

app.post('/submitReview', verifyToken, (req, res) => {
    const { dish, rating, comment } = req.body;
    const user = req.userId;

    console.log("DEBUG: Received review submission:", { dish, rating, comment, user });

    fs.readFile('reviews.json', (err, data) => {
        if (err) {
            console.error("DEBUG: Error reading reviews.json:", err);
            throw err;
        }

        console.log("DEBUG: Successfully read reviews.json");

        let reviews = JSON.parse(data);

        const dishReviews = reviews.find(r => r.dish === dish);

        if (dishReviews) {
            dishReviews.comments.push({ user, rating, comment });
            console.log("DEBUG: Appended review to existing dish:", dish);
        } else {
            reviews.push({ dish, comments: [{ user, rating, comment }] });
            console.log("DEBUG: Created new dish entry:", dish);
        }

        fs.writeFile('reviews.json', JSON.stringify(reviews, null, 2), err => {
            if (err) {
                console.error("DEBUG: Error writing to reviews.json:", err);
                throw err;
            }
            console.log("DEBUG: Successfully wrote to reviews.json");
            res.status(200).send('Review submitted successfully!');
        });
    });
});

// Protected route
app.get('/dashboard', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to your dashboard' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});