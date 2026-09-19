const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Helper to generate reference number
const generateRefNumber = () => {
    return 'REF-' + Math.floor(10000 + Math.random() * 90000);
};

// --- API ROUTES ---

// Get all properties (with optional search query)
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

// Add a new property
app.post('/api/properties', async (req, res) => {
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
