const fs = require('fs');
const path = require('path');

// Get all stays from JSON file
exports.getStays = async () => {
    try {
        const filePath = path.join(__dirname, '../data/stays.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const stays = JSON.parse(fileData);
        return stays || [];
    } catch (error) {
        console.error('Error reading stays.json:', error);
        return [];
    }
};

// Get stay details by slug
exports.getStayDetails = async (slug) => {
    try {
        const stays = await exports.getStays();
        const stay = stays.find(s => s.slug === slug);
        return stay || null;
    } catch (error) {
        console.error('Error getting stay details:', error);
        return null;
    }
};

