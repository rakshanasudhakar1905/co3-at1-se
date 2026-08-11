CREATE DATABASE IF NOT EXISTS museum_db;

USE museum_db;


CREATE TABLE IF NOT EXISTS artifacts (

    id INT AUTO_INCREMENT PRIMARY KEY,

    name VARCHAR(150) NOT NULL,

    category VARCHAR(100) NOT NULL,

    material VARCHAR(100) NOT NULL,

    condition_status
        ENUM('Good', 'Moderate', 'Poor')
        DEFAULT 'Good',

    created_at
        TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);


INSERT INTO artifacts
(name, category, material, condition_status)
VALUES

(
    'Ancient Bronze Statue',
    'Sculpture',
    'Bronze',
    'Good'
),

(
    'Historic Ceramic Vase',
    'Pottery',
    'Ceramic',
    'Moderate'
),

(
    'Old Manuscript',
    'Document',
    'Paper',
    'Poor'
),

(
    'Royal Gold Coin',
    'Coin',
    'Gold',
    'Good'
),

(
    'Traditional Wooden Mask',
    'Sculpture',
    'Wood',
    'Moderate'
),

(
    'Ancient Stone Inscription',
    'Archaeological',
    'Stone',
    'Good'
),

(
    'Historical Textile',
    'Textile',
    'Cotton',
    'Poor'
),

(
    'Bronze Warrior Figure',
    'Sculpture',
    'Bronze',
    'Good'
);
