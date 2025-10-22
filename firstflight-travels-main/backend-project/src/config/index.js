require('dotenv').config();

const config = {
    mongoURI: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/firstflight',
    port: process.env.PORT || 3000,
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key'
};

module.exports = config;