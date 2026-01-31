const db = require('../config/db');

const licenseModel = {
    // Create new license
    async create(data) {
        const now = new Date().toISOString();
        const result = await db.prepare(`
      INSERT INTO license (license_key, max_domains, expire_at, status, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run([
            data.license_key,
            data.max_domains,
            data.expire_at,
            data.status || 'active',
            data.notes || null,
            now,
            now
        ]);
        return result.lastID;
    },

    // Find license by key
    async findByKey(licenseKey) {
        return await db.prepare('SELECT * FROM license WHERE license_key = ?').get([licenseKey]);
    },

    // Find license by ID
    async findById(id) {
        return await db.prepare('SELECT * FROM license WHERE id = ?').get([id]);
    },

    // Get all licenses with pagination
    async getAll(limit = 20, offset = 0) {
        return await db.prepare('SELECT * FROM license ORDER BY created_at DESC LIMIT ? OFFSET ?').all([limit, offset]);
    },

    // Search licenses by key
    async search(keyword, limit = 20) {
        return await db.prepare('SELECT * FROM license WHERE license_key LIKE ? ORDER BY created_at DESC LIMIT ?').all([`%${keyword}%`, limit]);
    },

    // Count all licenses
    async count() {
        const result = await db.prepare('SELECT COUNT(*) as count FROM license').get([]);
        return result.count;
    },

    // Count by status
    async countByStatus(status) {
        const result = await db.prepare('SELECT COUNT(*) as count FROM license WHERE status = ?').get([status]);
        return result.count;
    },

    // Update license status
    async updateStatus(id, status) {
        const result = await db.prepare('UPDATE license SET status = ?, updated_at = ? WHERE id = ?').run([status, new Date().toISOString(), id]);
        return result.changes > 0;
    },

    // Update license expiry
    async updateExpiry(id, expireAt) {
        const result = await db.prepare('UPDATE license SET expire_at = ?, updated_at = ? WHERE id = ?').run([expireAt, new Date().toISOString(), id]);
        return result.changes > 0;
    },

    // Update license
    async update(id, data) {
        const result = await db.prepare(`
      UPDATE license 
      SET max_domains = ?, expire_at = ?, status = ?, notes = ?, updated_at = ?
      WHERE id = ?
    `).run([
            data.max_domains,
            data.expire_at,
            data.status,
            data.notes,
            new Date().toISOString(),
            id
        ]);
        return result.changes > 0;
    },

    // Delete license
    async delete(id) {
        const result = await db.prepare('DELETE FROM license WHERE id = ?').run([id]);
        return result.changes > 0;
    },

    // Get dashboard stats
    async getStats() {
        const total = await this.count();
        const active = await this.countByStatus('active');
        const suspended = await this.countByStatus('suspended');
        const expired = await this.countByStatus('expired');

        return {
            total,
            active,
            suspended,
            expired
        };
    }
};

module.exports = licenseModel;
