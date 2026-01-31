const db = require('../config/db');

const domainModel = {
    // Create new domain binding
    async create(licenseId, domain) {
        const now = new Date().toISOString();
        const result = await db.prepare(`
      INSERT INTO domain (license_id, domain, last_check_at, created_at)
      VALUES (?, ?, ?, ?)
    `).run([licenseId, domain, now, now]);
        return result.lastID;
    },

    // Find domain by license and domain name
    async findByLicenseAndDomain(licenseId, domain) {
        return await db.prepare('SELECT * FROM domain WHERE license_id = ? AND domain = ?').get([licenseId, domain]);
    },

    // Get all domains for a license
    async getByLicenseId(licenseId) {
        return await db.prepare('SELECT * FROM domain WHERE license_id = ? ORDER BY created_at DESC').all([licenseId]);
    },

    // Count domains for a license
    async countByLicenseId(licenseId) {
        const result = await db.prepare('SELECT COUNT(*) as count FROM domain WHERE license_id = ?').get([licenseId]);
        return result.count;
    },

    // Update last check time
    async updateLastCheck(id) {
        const result = await db.prepare('UPDATE domain SET last_check_at = ? WHERE id = ?').run([new Date().toISOString(), id]);
        return result.changes > 0;
    },

    // Update last check by license and domain
    async updateLastCheckByDomain(licenseId, domain) {
        const result = await db.prepare('UPDATE domain SET last_check_at = ? WHERE license_id = ? AND domain = ?').run([new Date().toISOString(), licenseId, domain]);
        return result.changes > 0;
    },

    // Delete domain
    async delete(id) {
        const result = await db.prepare('DELETE FROM domain WHERE id = ?').run([id]);
        return result.changes > 0;
    },

    // Get latest activations (for dashboard)
    async getLatest(limit = 10) {
        return await db.prepare(`
      SELECT d.*, l.license_key 
      FROM domain d 
      JOIN license l ON d.license_id = l.id 
      ORDER BY d.created_at DESC 
      LIMIT ?
    `).all([limit]);
    }
};

module.exports = domainModel;
