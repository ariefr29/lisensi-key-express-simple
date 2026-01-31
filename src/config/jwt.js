require('dotenv').config();

module.exports = {
    JWT_SECRET: process.env.JWT_SECRET || 'default-secret-change-this',
    JWT_EXPIRES_IN: '24h'
};
