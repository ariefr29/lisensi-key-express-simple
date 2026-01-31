require('dotenv').config();
const bcrypt = require('bcryptjs');
const adminModel = require('../src/models/adminModel');

async function createAdmin() {
    const username = process.env.ADMIN_USERNAME || 'admin';
    const password = process.env.ADMIN_PASSWORD || 'admin123';

    try {
        // Check if admin already exists
        const exists = await adminModel.exists();
        if (exists) {
            console.log('❌ Admin user already exists!');
            console.log('ℹ️  If you want to create a new admin, please delete the existing one from the database first.');
            process.exit(1);
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);

        // Create admin
        const adminId = await adminModel.create(username, passwordHash);

        console.log('');
        console.log('╔══════════════════════════════════════════════╗');
        console.log('║                                              ║');
        console.log('║       ADMIN USER CREATED SUCCESSFULLY        ║');
        console.log('║                                              ║');
        console.log('╚══════════════════════════════════════════════╝');
        console.log('');
        console.log(`✅ Admin ID: ${adminId}`);
        console.log(`✅ Username: ${username}`);
        console.log(`✅ Password: ${password}`);
        console.log('');
        console.log('⚠️  IMPORTANT: Please change the default password after first login!');
        console.log('');
        console.log(`📝 Login at: http://localhost:${process.env.PORT || 3000}/admin/login`);
        console.log('');

        process.exit(0);

    } catch (error) {
        console.error('❌ Error creating admin:', error.message);
        process.exit(1);
    }
}

createAdmin();
