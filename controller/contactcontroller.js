const fs = require('fs');
const path = require('path');

// Get contact information from JSON file
exports.getContactInfo = async () => {
    try {
        const filePath = path.join(__dirname, '../data/contact.json');
        const fileData = fs.readFileSync(filePath, 'utf8');
        const contactInfo = JSON.parse(fileData);
        return contactInfo || {
            phone: "+91 9876543210",
            email: "info@hotel.com",
            address: "Your Hotel Address, City, State, PIN Code"
        };
    } catch (error) {
        console.error('Error reading contact.json:', error);
        return {
            phone: "+91 9876543210",
            email: "info@hotel.com",
            address: "Your Hotel Address, City, State, PIN Code"
        };
    }
};
