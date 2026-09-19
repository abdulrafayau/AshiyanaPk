CREATE DATABASE IF NOT EXISTS real_estate_db;
USE real_estate_db;

CREATE TABLE IF NOT EXISTS properties (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reference_number VARCHAR(20) UNIQUE NOT NULL,
    property_type ENUM('House', 'Flat') NOT NULL,
    purpose ENUM('Sale', 'Rent') NOT NULL,
    plot_number VARCHAR(50),
    floor_number INT,
    area_sqft FLOAT,
    covered_area FLOAT,
    location VARCHAR(255),
    is_near_masjid BOOLEAN DEFAULT FALSE,
    is_near_market BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
