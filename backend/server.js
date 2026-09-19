const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_real_estate_key_2026';

// Helper to generate reference number
const generateRefNumber = () => {
    return 'REF-' + Math.floor(10000 + Math.random() * 90000);
};

// Middleware to protect routes
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) return res.status(401).json({ error: 'Access denied, token missing!' });
    
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Token is invalid or expired' });
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---

// Admin Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [username]);
        if (rows.length === 0) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const admin = rows[0];
        const validPassword = await bcrypt.compare(password, admin.password_hash);
        
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }
        
        const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '12h' });
        res.json({ token, username: admin.username });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// --- PROPERTY ROUTES ---

// Get all properties (Public route)
app.get('/api/properties', async (req, res) => {
    try {
        const { search } = req.query;
        let query = 'SELECT * FROM properties';
        const params = [];

        if (search) {
            query += ' WHERE location LIKE ? OR reference_number LIKE ?';
            params.push(`%${search}%`, `%${search}%`);
        }

        query += ' ORDER BY created_at DESC';

        const [rows] = await db.query(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error fetching properties:', error);
        res.status(500).json({ error: 'Failed to fetch properties' });
    }
});

// Add a new property (Protected route)
app.post('/api/properties', authenticateToken, async (req, res) => {
    try {
        const {
            property_type, purpose, plot_number, floor_number,
            area_sqft, covered_area, location, is_near_masjid, is_near_market
        } = req.body;

        const reference_number = generateRefNumber();

        const query = `
            INSERT INTO properties 
            (reference_number, property_type, purpose, plot_number, floor_number, area_sqft, covered_area, location, is_near_masjid, is_near_market) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        const values = [
            reference_number, property_type, purpose, plot_number, floor_number || null,
            area_sqft, covered_area || null, location, is_near_masjid || false, is_near_market || false
        ];

        const [result] = await db.query(query, values);

        res.status(201).json({ 
            message: 'Property added successfully', 
            id: result.insertId,
            reference_number 
        });
    } catch (error) {
        console.error('Error adding property:', error);
        res.status(500).json({ error: 'Failed to add property' });
    }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
