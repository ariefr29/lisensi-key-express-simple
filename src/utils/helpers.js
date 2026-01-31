const crypto = require('crypto');

/**
 * Generate license key in format: XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX
 * Using uppercase alphanumeric characters
 */
function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    function randomChars(length) {
        let result = '';
        const bytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            result += chars[bytes[i] % chars.length];
        }
        return result;
    }

    const part1 = randomChars(8);
    const part2 = randomChars(4);
    const part3 = randomChars(4);
    const part4 = randomChars(4);
    const part5 = randomChars(12);

    return `${part1}-${part2}-${part3}-${part4}-${part5}`;
}

/**
 * Sanitize domain input
 * Remove protocol and trailing slashes
 */
function sanitizeDomain(domain) {
    return domain
        .replace(/^https?:\/\//, '')
        .replace(/^www\./, '')
        .replace(/\/$/, '')
        .toLowerCase()
        .trim();
}

/**
 * Calculate remaining days until expiry
 */
function calculateRemainingDays(expireAt) {
    const now = new Date();
    const expiry = new Date(expireAt);
    const diffTime = expiry - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Check if license is expired
 */
function isExpired(expireAt) {
    const now = new Date();
    const expiry = new Date(expireAt);
    return now > expiry;
}

/**
 * Log events with timestamp
 */
function logEvent(event, data) {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${event}:`, JSON.stringify(data));
}

module.exports = {
    generateLicenseKey,
    sanitizeDomain,
    calculateRemainingDays,
    isExpired,
    logEvent
};
