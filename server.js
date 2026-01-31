require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const rateLimit = require('express-rate-limit');

// Import routes
const adminRoutes = require('./src/routes/adminRoutes');
const licenseRoutes = require('./src/routes/licenseRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// Rate limiting
const apiActivateLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: { status: 'error', message: 'Too many activation requests' }
});

const apiCheckLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60,
    message: { status: 'error', message: 'Too many validation requests' }
});

const adminLimit = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 20,
    message: 'Too many requests'
});

// Apply rate limits
app.use('/api/activate', apiActivateLimit);
app.use('/api/check', apiCheckLimit);
app.use('/admin', adminLimit);

// Routes
app.use('/api', licenseRoutes);
app.use('/webhook', webhookRoutes);
app.use('/admin', adminRoutes);

// Root redirect
app.get('/', (req, res) => {
    res.redirect('/admin/dashboard');
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// Error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error'
    });
});

// Start server
app.listen(PORT, () => {
    console.log('╔══════════════════════════════════════════════╗');
    console.log('║                                              ║');
    console.log('║       LICENSE SERVER SYSTEM v1.0             ║');
    console.log('║                                              ║');
    console.log('╚══════════════════════════════════════════════╝');
    console.log('');
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`✅ Admin Panel: http://localhost:${PORT}/admin/dashboard`);
    console.log(`✅ API Base URL: http://localhost:${PORT}/api`);
    console.log(`✅ Webhook URL: http://localhost:${PORT}/webhook`);
    console.log('');
    console.log('📝 Press Ctrl+C to stop');
    console.log('');
});

module.exports = app;
