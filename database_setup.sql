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

CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert the default admin with the password 'project@2026'
INSERT IGNORE INTO admins (username, password_hash) VALUES ('admin', '$2b$10$rb7VMEsaUd5f4s3qztwpDuxgjjCuStPhxDRLI79xI/V9OMms2rgVi');
