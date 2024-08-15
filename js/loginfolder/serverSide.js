const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 

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
            return res.status(500).json({ message: 'User registration failed' });
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

        const token = jwt.sign({ id: user.id }, SECRET_KEY, { expiresIn: 86400 });
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

// Protected route
app.get('/dashboard', verifyToken, (req, res) => {
    res.status(200).json({ message: 'Welcome to your dashboard' });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});