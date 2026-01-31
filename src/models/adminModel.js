const db = require('../config/db');

const adminModel = {
    // Find admin by username
    async findByUsername(username) {
        return await db.prepare('SELECT * FROM admin WHERE username = ?').get([username]);
    },

    // Create new admin
    async create(username, passwordHash) {
        const result = await db.prepare('INSERT INTO admin (username, password_hash) VALUES (?, ?)').run([username, passwordHash]);
        return result.lastID;
    },

    // Check if admin exists
    async exists() {
        const result = await db.prepare('SELECT COUNT(*) as count FROM admin').get([]);
        return result.count > 0;
    }
};

module.exports = adminModel;
