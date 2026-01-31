const express = require('express');
const router = express.Router();
const licenseController = require('../controllers/licenseController');
const validateRequest = require('../middlewares/validateRequest');

// POST /api/activate
router.post('/activate', validateRequest('activate'), licenseController.activate);

// POST /api/check
router.post('/check', validateRequest('check'), licenseController.check);

module.exports = router;
