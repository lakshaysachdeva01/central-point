const fs = require('fs');
const path = require('path');

// Get all venues from JSON file
exports.getVenues = async () => {
    try {
        const filePath = path.join(__dirname, '../data/venues.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const venues = JSON.parse(fileData);
        return venues || [];
    } catch (error) {
        console.error('Error reading venues.json:', error);
        return [];
    }
};

// Get venue details by slug
exports.getVenueDetails = async (slug) => {
    try {
        const venues = await exports.getVenues();
        const venue = venues.find(v => v.slug === slug);
        return venue || null;
    } catch (error) {
        console.error('Error getting venue details:', error);
        return null;
    }
};

