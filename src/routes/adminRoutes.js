const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authAdmin = require('../middlewares/authAdmin');

// Public routes
router.get('/login', adminController.showLogin);
router.post('/login', adminController.login);

// Protected routes
router.get('/logout', authAdmin, adminController.logout);
router.get('/dashboard', authAdmin, adminController.dashboard);
router.get('/documentation', authAdmin, adminController.showDocumentation);

// License management
router.get('/licenses', authAdmin, adminController.listLicenses);
router.get('/licenses/create', authAdmin, adminController.showCreateLicense);
router.post('/licenses/create', authAdmin, adminController.createLicense);
router.get('/licenses/:id', authAdmin, adminController.showLicenseDetail);
router.post('/licenses/:id/suspend', authAdmin, adminController.suspendLicense);
router.post('/licenses/:id/reactivate', authAdmin, adminController.reactivateLicense);
router.post('/licenses/:id/extend', authAdmin, adminController.extendLicense);

module.exports = router;
