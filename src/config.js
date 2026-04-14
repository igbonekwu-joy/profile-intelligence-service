const dotenv = require('dotenv');

dotenv.config();

module.exports = {
    PORT: process.env.PORT || 5000,
    GENDERIZE_API_URL: process.env.GENDERIZE_API_URL
}