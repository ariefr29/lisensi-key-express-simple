const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt');

function authAdmin(req, res, next) {
    try {
        // Get token from cookie
        const token = req.cookies.admin_token;

        if (!token) {
            return res.redirect('/admin/login');
        }

        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.clearCookie('admin_token');
        return res.redirect('/admin/login');
    }
}

module.exports = authAdmin;
