const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRES_IN } = require('../config/jwt');
const adminModel = require('../models/adminModel');
const licenseModel = require('../models/licenseModel');
const domainModel = require('../models/domainModel');
const { generateLicenseKey, logEvent } = require('../utils/helpers');

const adminController = {
    /**
     * GET /admin/login
     * Show login page
     */
    showLogin(req, res) {
        // Check if already logged in
        const token = req.cookies.admin_token;
        if (token) {
            try {
                jwt.verify(token, JWT_SECRET);
                return res.redirect('/admin/dashboard');
            } catch (err) {
                // Invalid token, continue to login
            }
        }

        res.render('pages/login', { error: null });
    },

    /**
     * POST /admin/login
     * Process login
     */
    async login(req, res) {
        try {
            const { username, password } = req.body;

            // Find admin
            const admin = await adminModel.findByUsername(username);

            if (!admin) {
                return res.render('pages/login', { error: 'Username atau password salah' });
            }

            // Verify password
            const isValid = await bcrypt.compare(password, admin.password_hash);

            if (!isValid) {
                logEvent('LOGIN_FAILED', { username });
                return res.render('pages/login', { error: 'Username atau password salah' });
            }

            // Create JWT token
            const token = jwt.sign(
                { id: admin.id, username: admin.username },
                JWT_SECRET,
                { expiresIn: JWT_EXPIRES_IN }
            );

            // Set cookie
            res.cookie('admin_token', token, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000 // 24 hours
            });

            logEvent('LOGIN_SUCCESS', { username });
            res.redirect('/admin/dashboard');

        } catch (error) {
            console.error('Login error:', error);
            res.render('pages/login', { error: 'Terjadi kesalahan' });
        }
    },

    /**
     * GET /admin/logout
     * Logout admin
     */
    logout(req, res) {
        res.clearCookie('admin_token');
        res.redirect('/admin/login');
    },

    /**
     * GET /admin/dashboard
     * Show dashboard
     */
    async dashboard(req, res) {
        try {
            const stats = await licenseModel.getStats();
            const latestActivations = await domainModel.getLatest(10);

            res.render('pages/dashboard', {
                admin: req.admin,
                stats,
                latestActivations
            });
        } catch (error) {
            console.error('Dashboard error:', error);
            res.status(500).send('Error loading dashboard');
        }
    },

    /**
     * GET /admin/documentation
     * Show API documentation
     */
    async showDocumentation(req, res) {
        try {
            const protocol = req.protocol;
            const host = req.get('host');
            const baseUrl = `${protocol}://${host}`;

            res.render('pages/documentation', {
                admin: req.admin,
                baseUrl
            });
        } catch (error) {
            console.error('Documentation error:', error);
            res.status(500).send('Error loading documentation');
        }
    },

    /**
     * GET /admin/licenses
     * List all licenses
     */
    async listLicenses(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = 20;
            const offset = (page - 1) * limit;
            const search = req.query.search || '';

            let licenses;
            let total;

            if (search) {
                licenses = await licenseModel.search(search, limit);
                total = licenses.length;
            } else {
                licenses = await licenseModel.getAll(limit, offset);
                total = await licenseModel.count();
            }

            // Get domain counts for each license
            const licensesWithDomains = await Promise.all(licenses.map(async (license) => {
                const domainCount = await domainModel.countByLicenseId(license.id);
                return { ...license, domainCount };
            }));

            const totalPages = Math.ceil(total / limit);

            res.render('pages/license_list', {
                admin: req.admin,
                licenses: licensesWithDomains,
                currentPage: page,
                totalPages,
                search
            });
        } catch (error) {
            console.error('List licenses error:', error);
            res.status(500).send('Error loading licenses');
        }
    },

    /**
     * GET /admin/licenses/create
     * Show create license form
     */
    showCreateLicense(req, res) {
        const generatedKey = generateLicenseKey();
        res.render('pages/license_create', {
            admin: req.admin,
            generatedKey,
            error: null
        });
    },

    /**
     * POST /admin/licenses/create
     * Create new license
     */
    async createLicense(req, res) {
        try {
            const { license_key, max_domains, expire_at, notes } = req.body;

            // Validate
            if (!license_key || !max_domains || !expire_at) {
                return res.render('pages/license_create', {
                    admin: req.admin,
                    generatedKey: license_key,
                    error: 'Semua field wajib diisi'
                });
            }

            // Check if license key already exists
            const existing = await licenseModel.findByKey(license_key);
            if (existing) {
                return res.render('pages/license_create', {
                    admin: req.admin,
                    generatedKey: generateLicenseKey(),
                    error: 'License key sudah ada'
                });
            }

            // Create license
            const licenseId = await licenseModel.create({
                license_key,
                max_domains: parseInt(max_domains),
                expire_at: new Date(expire_at).toISOString(),
                status: 'active',
                notes: notes || null
            });

            logEvent('LICENSE_CREATED', { license_id: licenseId, license_key });
            res.redirect('/admin/licenses/' + licenseId);

        } catch (error) {
            console.error('Create license error:', error);
            res.render('pages/license_create', {
                admin: req.admin,
                generatedKey: generateLicenseKey(),
                error: 'Error membuat license'
            });
        }
    },

    /**
     * GET /admin/licenses/:id
     * Show license detail
     */
    async showLicenseDetail(req, res) {
        try {
            const id = parseInt(req.params.id);
            const license = await licenseModel.findById(id);

            if (!license) {
                return res.status(404).send('License tidak ditemukan');
            }

            const domains = await domainModel.getByLicenseId(id);

            res.render('pages/license_detail', {
                admin: req.admin,
                license,
                domains
            });
        } catch (error) {
            console.error('License detail error:', error);
            res.status(500).send('Error loading license');
        }
    },

    /**
     * POST /admin/licenses/:id/suspend
     * Suspend license
     */
    async suspendLicense(req, res) {
        try {
            const id = parseInt(req.params.id);
            await licenseModel.updateStatus(id, 'suspended');
            logEvent('LICENSE_SUSPENDED', { license_id: id });
            res.redirect('/admin/licenses/' + id);
        } catch (error) {
            console.error('Suspend license error:', error);
            res.status(500).send('Error suspending license');
        }
    },

    /**
     * POST /admin/licenses/:id/reactivate
     * Reactivate license
     */
    async reactivateLicense(req, res) {
        try {
            const id = parseInt(req.params.id);
            await licenseModel.updateStatus(id, 'active');
            logEvent('LICENSE_REACTIVATED', { license_id: id });
            res.redirect('/admin/licenses/' + id);
        } catch (error) {
            console.error('Reactivate license error:', error);
            res.status(500).send('Error reactivating license');
        }
    },

    /**
     * POST /admin/licenses/:id/extend
     * Extend license expiry
     */
    async extendLicense(req, res) {
        try {
            const id = parseInt(req.params.id);
            const { expire_at } = req.body;

            await licenseModel.updateExpiry(id, new Date(expire_at).toISOString());
            logEvent('LICENSE_EXTENDED', { license_id: id, new_expiry: expire_at });
            res.redirect('/admin/licenses/' + id);
        } catch (error) {
            console.error('Extend license error:', error);
            res.status(500).send('Error extending license');
        }
    }
};

module.exports = adminController;
