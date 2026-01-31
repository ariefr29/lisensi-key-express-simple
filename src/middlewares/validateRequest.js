const Joi = require('joi');

// Validation schemas
const schemas = {
    activate: Joi.object({
        license_key: Joi.string().required(),
        domain: Joi.string().required()
    }),

    check: Joi.object({
        license_key: Joi.string().required(),
        domain: Joi.string().required()
    }),

    createLicense: Joi.object({
        max_domains: Joi.number().integer().min(1).required(),
        expire_at: Joi.string().isoDate().required(),
        notes: Joi.string().allow('').optional()
    }),

    webhook: Joi.object({
        buyer_email: Joi.string().email().required(),
        buyer_name: Joi.string().required(),
        product_id: Joi.string().required(),
        max_domains: Joi.number().integer().min(1).required()
    })
};

function validateRequest(schemaName) {
    return (req, res, next) => {
        const schema = schemas[schemaName];
        if (!schema) {
            return next();
        }

        const { error, value } = schema.validate(req.body);

        if (error) {
            return res.status(400).json({
                status: 'error',
                message: error.details[0].message
            });
        }

        req.validatedData = value;
        next();
    };
}

module.exports = validateRequest;
