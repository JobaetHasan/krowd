const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');


dotenv.config();

const app = express();
app.use(express.json());  // To parse JSON requests

// CORS middleware ব্যবহার করুন
app.use(cors());


// MySQL database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Test MySQL connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err.stack);
        return;
    }
    console.log('Connected to MySQL');
});

// Signup API without bcrypt
app.post('/api/signup', (req, res) => {
    const { username, email, password } = req.body;

    // Directly insert password without hashing
    const query = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
    db.query(query, [username, email, password], (err, results) => {
        if (err) {
            console.error('Error during signup:', err.stack);
            return res.status(500).json({ message: 'Error during signup' });
        }
        res.status(201).json({ message: 'Signup successful', username });
    });
});

/// Login API
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        // Compare passwords directly without bcrypt
        const user = results[0];
        if (user.password === password) {
            res.status(200).json({ message: 'Login successful', username: user.username });
        } else {
            res.status(400).json({ message: 'Invalid email or password' });
        }
    });
});


/// 

// Create Campaign API
app.post('/api/create-campaign', (req, res) => {
    const { title, description, goal } = req.body;
    const fundraiser = req.body.fundraiser; 

    // Validate required fields
    if (!title || !description || !goal) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Insert campaign data into the database
    const query = 'INSERT INTO campaigns (fundraiser,title, description, target_amount) VALUES (?,?, ?, ?)';
    db.query(query, [fundraiser,title, description, goal], (err, results) => {
        if (err) {
            console.error('Error inserting campaign:', err.stack);
            return res.status(500).json({ message: 'Error creating campaign' });
        }
        res.status(201).json({ message: 'Campaign created successfully!', campaignId: results.insertId });
    });


    



});


// Get all campaigns API
app.get('/api/campaigns', (req, res) => {

    const query = 'SELECT * FROM campaigns ORDER BY created_at DESC';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching campaigns:', err.stack);
            return res.status(500).json({ message: 'Error fetching campaigns' });
        }
        res.status(200).json(results); // Return all campaigns
    });
});




// Handle donation submission
app.post('/api/donations', (req, res) => {
    const { campaignId, donorName, contactInfo, amount } = req.body;

    if (!campaignId || !donorName || !contactInfo || !amount) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    const query = 'INSERT INTO donations (campaign_id, donor_name, contact_info, amount) VALUES (?, ?, ?, ?)';
    const values = [campaignId, donorName, contactInfo, amount];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ message: 'Error saving donation.' });
        }

        res.status(200).json({ message: 'Donation saved successfully.' });
    });
});






// Start server
const PORT = process.env.PORT || 5500;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
