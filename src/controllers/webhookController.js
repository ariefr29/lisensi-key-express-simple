require('dotenv').config();
const { generateLicenseKey, logEvent } = require('../utils/helpers');
const licenseModel = require('../models/licenseModel');

const webhookController = {
    /**
     * POST /webhook/create-license
     * Auto-generate license from external ecommerce
     */
    async createLicense(req, res) {
        try {
            // Validate webhook secret
            const secret = req.headers['x-webhook-secret'];
            const expectedSecret = process.env.WEBHOOK_SECRET;

            if (!secret || secret !== expectedSecret) {
                logEvent('WEBHOOK_FAILED', { reason: 'Invalid or missing secret' });
                return res.status(401).json({
                    status: 'error',
                    message: 'Unauthorized'
                });
            }

            const { buyer_email, buyer_name, product_id, max_domains } = req.validatedData;

            // Generate license key
            const license_key = generateLicenseKey();

            // Set expiry to +1 year from now
            const expireAt = new Date();
            expireAt.setFullYear(expireAt.getFullYear() + 1);

            // Create license
            const notes = `Auto-generated for ${buyer_name} (${buyer_email}) - Product: ${product_id}`;

            const licenseId = licenseModel.create({
                license_key,
                max_domains,
                expire_at: expireAt.toISOString(),
                status: 'active',
                notes
            });

            logEvent('WEBHOOK_LICENSE_CREATED', {
                license_id: licenseId,
                license_key,
                buyer_email,
                product_id,
                max_domains
            });

            return res.json({
                status: 'ok',
                license_key,
                expire_at: expireAt.toISOString().split('T')[0]
            });

        } catch (error) {
            console.error('Webhook error:', error);
            logEvent('WEBHOOK_ERROR', { error: error.message });
            return res.status(500).json({
                status: 'error',
                message: 'Internal server error'
            });
        }
    }
};

module.exports = webhookController;
