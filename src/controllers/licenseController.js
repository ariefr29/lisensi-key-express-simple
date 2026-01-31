const licenseModel = require('../models/licenseModel');
const domainModel = require('../models/domainModel');
const { sanitizeDomain, calculateRemainingDays, isExpired, logEvent } = require('../utils/helpers');

const licenseController = {
    /**
     * POST /api/activate
     * Activate license and bind domain
     */
    async activate(req, res) {
        try {
            const { license_key, domain: rawDomain } = req.validatedData;
            const domain = sanitizeDomain(rawDomain);

            // Find license
            const license = await licenseModel.findByKey(license_key);

            if (!license) {
                logEvent('ACTIVATION_FAILED', { license_key, domain, reason: 'License not found' });
                return res.status(404).json({
                    status: 'error',
                    message: 'License key not found'
                });
            }

            // Check if license is active
            if (license.status !== 'active') {
                logEvent('ACTIVATION_FAILED', { license_key, domain, reason: 'License suspended' });
                return res.status(403).json({
                    status: 'error',
                    message: 'License is suspended'
                });
            }

            // Check if license is expired
            if (isExpired(license.expire_at)) {
                logEvent('ACTIVATION_FAILED', { license_key, domain, reason: 'License expired' });
                return res.status(403).json({
                    status: 'error',
                    message: 'License has expired'
                });
            }

            // Check if domain already exists
            const existingDomain = await domainModel.findByLicenseAndDomain(license.id, domain);

            if (existingDomain) {
                // Domain already activated
                const domainsUsed = await domainModel.countByLicenseId(license.id);
                logEvent('ACTIVATION_SUCCESS', { license_key, domain, status: 'already_activated' });

                return res.json({
                    status: 'ok',
                    message: 'activated',
                    data: {
                        domains_used: domainsUsed,
                        max_domains: license.max_domains
                    }
                });
            }

            // Check domain limit
            const domainsUsed = await domainModel.countByLicenseId(license.id);

            if (domainsUsed >= license.max_domains) {
                logEvent('ACTIVATION_FAILED', { license_key, domain, reason: 'Domain limit reached' });
                return res.status(403).json({
                    status: 'error',
                    message: 'Domain limit reached'
                });
            }

            // Create new domain binding
            await domainModel.create(license.id, domain);
            const newDomainsUsed = domainsUsed + 1;

            logEvent('ACTIVATION_SUCCESS', { license_key, domain, domains_used: newDomainsUsed });

            return res.json({
                status: 'ok',
                message: 'activated',
                data: {
                    domains_used: newDomainsUsed,
                    max_domains: license.max_domains
                }
            });

        } catch (error) {
            console.error('Activation error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    },

    /**
     * POST /api/check
     * Validate license status
     */
    async check(req, res) {
        try {
            const { license_key, domain: rawDomain } = req.validatedData;
            const domain = sanitizeDomain(rawDomain);

            // Find license
            const license = await licenseModel.findByKey(license_key);

            if (!license) {
                logEvent('VALIDATION_FAILED', { license_key, domain, reason: 'License not found' });
                return res.status(404).json({
                    status: 'error',
                    message: 'License not found'
                });
            }

            // Check if domain is bound to this license
            const boundDomain = await domainModel.findByLicenseAndDomain(license.id, domain);

            if (!boundDomain) {
                logEvent('VALIDATION_FAILED', { license_key, domain, reason: 'Domain not activated' });
                return res.status(403).json({
                    status: 'error',
                    message: 'Domain not activated for this license'
                });
            }

            // Update last check time
            await domainModel.updateLastCheckByDomain(license.id, domain);

            // Check license status
            if (license.status === 'suspended') {
                logEvent('VALIDATION_CHECK', { license_key, domain, status: 'suspended' });
                return res.json({
                    status: 'suspended'
                });
            }

            // Check expiry
            if (isExpired(license.expire_at)) {
                logEvent('VALIDATION_CHECK', { license_key, domain, status: 'expired' });
                return res.json({
                    status: 'expired'
                });
            }

            // License is active
            const remainingDays = calculateRemainingDays(license.expire_at);
            logEvent('VALIDATION_CHECK', { license_key, domain, status: 'active', remaining_days: remainingDays });

            return res.json({
                status: 'active',
                expire_at: license.expire_at.split('T')[0],
                remaining_days: remainingDays
            });

        } catch (error) {
            console.error('Check error:', error);
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = licenseController;
