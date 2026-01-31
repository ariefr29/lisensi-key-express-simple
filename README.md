# 🔐 License Server System

A complete license management system built with Node.js, Express, and SQLite. This system allows you to create, manage, and validate license keys for your applications, themes, and plugins.

## ✨ Features

- 🔑 **License Key Generation** - Automatic generation of secure license keys
- 🌐 **Domain Binding** - Bind licenses to specific domains with limits
- ✅ **License Validation** - Real-time license status checking
- 🎯 **Admin Dashboard** - Beautiful web-based management interface
- 🔒 **Security** - JWT authentication, bcrypt password hashing
- 📊 **Statistics** - Track license usage and activations
- 🔗 **Webhook Support** - Auto-generate licenses from e-commerce platforms
- ⚡ **Rate Limiting** - Prevent API abuse
- 🎨 **Modern UI** - Built with TailwindCSS and Alpine.js
- 📦 **Sample Implementation** - Ready-to-use example in `contoh_implement/`

## 📋 Requirements

- Node.js v18 or higher
- npm or yarn

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` file:

```env
JWT_SECRET="your-super-secret-jwt-key-change-this"
WEBHOOK_SECRET="your-webhook-secret-change-this"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="admin123"
PORT=3000
```

⚠️ **IMPORTANT**: Change the default secrets and passwords in production!

### 3. Run Database Migration

```bash
npm run migrate
```

### 4. Create Admin User

```bash
npm run create-admin
```

### 5. Start the Server

Development mode:
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will start at `http://localhost:3000`

## 📖 Usage Guide

### Admin Dashboard

1. **Login**: Navigate to `http://localhost:3000/admin/login`
   - Username: `admin` (or your custom username)
   - Password: `admin123` (or your custom password)

2. **Dashboard**: View statistics and latest activations

3. **Create License**: 
   - Navigate to "Create License"
   - License key is auto-generated
   - Set maximum domains allowed
   - Set expiration date
   - Add optional notes

4. **Manage Licenses**:
   - View all licenses
   - Search by license key
   - Suspend/Reactivate licenses
   - Extend expiration dates
   - View activated domains

## 🔌 API Documentation

Base URL: `http://localhost:3000/api`

### 1. Activate License

**Endpoint**: `POST /api/activate`

**Description**: Bind a domain to a license and activate it.

**Request Body**:
```json
{
  "license_key": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV",
  "domain": "example.com"
}
```

**Success Response** (200):
```json
{
  "status": "ok",
  "message": "activated",
  "data": {
    "domains_used": 1,
    "max_domains": 3
  }
}
```

**Error Responses**:
- `404`: License not found
- `403`: License suspended, expired, or domain limit reached

### 2. Validate License

**Endpoint**: `POST /api/check`

**Description**: Check license status (use this periodically in your application).

**Request Body**:
```json
{
  "license_key": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV",
  "domain": "example.com"
}
```

**Success Response** (200):
```json
{
  "status": "active",
  "expire_at": "2025-12-31",
  "remaining_days": 365
}
```

**Other Responses**:
```json
{ "status": "suspended" }
{ "status": "expired" }
```

**Error Response** (403):
```json
{
  "status": "error",
  "message": "Domain not activated for this license"
}
```

## 📦 Sample Implementation

A complete working example is available in the `contoh_implement/` directory. This demonstrates how to integrate the license system into your application.

### Running the Sample

```bash
cd contoh_implement
npm install
node server.js
```

The sample app will run on `http://localhost:3005`

See `contoh_implement/README.md` and `contoh_implement/CARA_PENGGUNAAN.md` for detailed instructions.

## 🔗 Webhook Integration

**Endpoint**: `POST /webhook/create-license`

**Description**: Auto-generate license when receiving webhook from e-commerce platform.

**Headers**:
```
x-webhook-secret: your-webhook-secret
```

**Request Body**:
```json
{
  "buyer_email": "customer@example.com",
  "buyer_name": "John Doe",
  "product_id": "premium-plugin",
  "max_domains": 3
}
```

**Success Response** (200):
```json
{
  "status": "ok",
  "license_key": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV",
  "expire_at": "2025-12-31"
}
```

### Integration Examples

#### WooCommerce

1. Install a webhook plugin or use WooCommerce built-in webhooks
2. Create a webhook for "Order Completed"
3. Set URL to: `http://your-server.com/webhook/create-license`
4. Add custom header: `x-webhook-secret: your-secret`
5. Map order data to required fields

#### Easy Digital Downloads

Use the EDD Webhooks extension to send order data to the webhook endpoint.

## 💻 Client Integration Example

### JavaScript Example

```javascript
// Activation
async function activateLicense(licenseKey) {
    try {
        const response = await fetch('http://your-server.com/api/activate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                license_key: licenseKey,
                domain: window.location.hostname
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'ok') {
            localStorage.setItem('license_key', licenseKey);
            return true;
        }
        
        return false;
    } catch (error) {
        console.error('License activation failed:', error);
        return false;
    }
}

// Validation
async function checkLicense() {
    const licenseKey = localStorage.getItem('license_key');
    
    if (!licenseKey) {
        return false;
    }
    
    try {
        const response = await fetch('http://your-server.com/api/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                license_key: licenseKey,
                domain: window.location.hostname
            })
        });
        
        const data = await response.json();
        
        return data.status === 'active';
    } catch (error) {
        console.error('License check failed:', error);
        return false;
    }
}
```

## 🏗️ System Architecture

```
┌─────────────────┐
│  Client App     │
│ (WP/Theme/Web)  │
└────────┬────────┘
         │
         │ HTTP API
         ▼
┌─────────────────────────────────┐
│   License Server (Express.js)   │
│  ┌──────────┐  ┌──────────┐    │
│  │   API    │  │  Admin   │    │
│  │ Routes   │  │Dashboard │    │
│  └──────────┘  └──────────┘    │
│                                 │
│  ┌──────────────────────────┐  │
│  │   Business Logic         │  │
│  │   (Controllers/Models)   │  │
│  └──────────────────────────┘  │
└──────────────┬──────────────────┘
               │
               ▼
        ┌─────────────┐
        │   SQLite    │
        │  Database   │
        └─────────────┘
```

## 📁 Project Structure

```
├── contoh_implement/          # Sample implementation
│   ├── public/               # Frontend files
│   ├── server.js             # Sample server
│   ├── package.json
│   ├── README.md
│   └── CARA_PENGGUNAAN.md
├── migrations/
│   ├── create_tables.sql     # Database schema
│   └── run.js                # Migration runner
├── scripts/
│   └── createAdmin.js        # Admin creation script
├── src/
│   ├── config/
│   │   ├── db.js            # Database connection
│   │   └── jwt.js           # JWT configuration
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── licenseController.js
│   │   └── webhookController.js
│   ├── middlewares/
│   │   ├── authAdmin.js
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── adminModel.js
│   │   ├── domainModel.js
│   │   └── licenseModel.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── licenseRoutes.js
│   │   └── webhookRoutes.js
│   ├── utils/
│   │   └── helpers.js       # Utility functions
│   └── views/               # EJS templates
├── .env                     # Environment variables
├── .gitignore
├── DOCUMENTATION.md         # Detailed documentation
├── package.json
├── server.js               # Main application entry
└── README.md
```

## 🔒 Security Features

- ✅ JWT-based admin authentication
- ✅ HTTP-only cookies for session management
- ✅ Bcrypt password hashing
- ✅ Rate limiting on all endpoints
- ✅ Input validation with Joi
- ✅ SQL injection protection (prepared statements)
- ✅ Webhook secret verification

## 🐛 Bug Fixes & Improvements

### Critical Fixes Applied

**Missing `await` Keywords** - Fixed 8 critical async/await issues:
- ✅ `licenseModel.findByKey()` - 2 instances
- ✅ `domainModel.findByLicenseAndDomain()` - 2 instances
- ✅ `domainModel.countByLicenseId()` - 2 instances
- ✅ `domainModel.create()` - 1 instance (CRITICAL)
- ✅ `domainModel.updateLastCheckByDomain()` - 1 instance

**Impact**: These fixes ensure:
- Domain activations are properly saved to database
- License validation returns correct data
- Dashboard displays accurate domain information
- Domain counts are calculated correctly

## 🚢 Deployment

### Render.com

1. Create new Web Service
2. Connect your repository
3. Set build command: `npm install && npm run migrate && npm run create-admin`
4. Set start command: `npm start`
5. Add environment variables from `.env`

### Railway.app

1. New Project → Deploy from GitHub
2. Add environment variables
3. Railway will auto-detect Node.js and deploy

### VPS (Ubuntu/Debian)

```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <your-repo>
cd lisensi-key-2
npm install
npm run migrate
npm run create-admin

# Install PM2
sudo npm install -g pm2

# Start with PM2
pm2 start server.js --name license-server
pm2 save
pm2 startup
```

## 📊 Database Schema

### Admin Table
- id (Primary Key)
- username (Unique)
- password_hash

### License Table
- id (Primary Key)
- license_key (Unique)
- max_domains
- expire_at
- status (active/suspended/expired)
- notes
- created_at
- updated_at

### Domain Table
- id (Primary Key)
- license_id (Foreign Key)
- domain
- activated_at
- last_check_at
- created_at

## 🛠️ Troubleshooting

### "Admin already exists" error
Delete the database file and re-run migrations:
```bash
rm database.sqlite
npm run migrate
npm run create-admin
```

### Port already in use
Change the PORT in `.env` file or kill the process using the port.

### Database locked error
Close any database browser tools and restart the server.

### Domain not showing in dashboard
This issue has been fixed. Make sure you're running the latest version with all async/await fixes applied.

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Author

Devlogor

## 🤝 Support

For issues and questions, please create an issue in the repository.

---

**Version**: 1.1.0  
**Last Updated**: 2025-11-26  
**Status**: ✅ Production Ready

Made with ❤️ using Node.js, Express, and SQLite
