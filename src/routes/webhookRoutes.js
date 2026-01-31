const express = require('express');
const router = express.Router();
const webhookController = require('../controllers/webhookController');
const validateRequest = require('../middlewares/validateRequest');

// POST /webhook/create-license
router.post('/create-license', validateRequest('webhook'), webhookController.createLicense);

module.exports = router;
