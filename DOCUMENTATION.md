# 📚 License Server System - Dokumentasi Lengkap

## 🎯 Overview

Sistem manajemen license key berbasis web dengan fitur lengkap untuk:
- ✅ Generate & manage license keys
- ✅ Domain binding & validation
- ✅ API untuk aktivasi & validasi
- ✅ Webhook integration
- ✅ Admin dashboard (dark theme)
- ✅ Bahasa Indonesia

## 📂 Struktur Project

```
lisensi-key-2/
├── src/
│   ├── config/              # Konfigurasi (DB, JWT)
│   ├── controllers/         # Business logic
│   ├── middlewares/         # Auth & validation
│   ├── models/              # Database models
│   ├── routes/              # API & admin routes
│   ├── utils/               # Helper functions
│   └── views/               # EJS templates
│       ├── pages/           # Halaman-halaman
│       │   ├── login.ejs
│       │   ├── dashboard.ejs
│       │   ├── license_list.ejs
│       │   ├── license_create.ejs
│       │   ├── license_detail.ejs
│       │   └── documentation.ejs
│       ├── partials/        # Komponen reusable
│       │   ├── head.ejs
│       │   ├── styles.ejs
│       │   └── components/
│       │       └── sidebar.ejs
│       └── layout.ejs
├── migrations/              # Database migrations
├── scripts/                 # Utility scripts
├── server.js               # Entry point
└── package.json
```

## 🚀 Quick Start

### 1. Installation

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env dengan konfigurasi Anda

# Run migrations
npm run migrate

# Create admin user
npm run create-admin

# Start server
npm run dev
```

### 2. Default Credentials

```
Username: admin
Password: admin123
```

### 3. Access Points

```
Admin Panel: http://localhost:3001/admin/dashboard
API Base:    http://localhost:3001/api
Webhook:     http://localhost:3001/webhook
```

## 🎨 Views Structure (Clean Code)

### Prinsip yang Diterapkan:

**1. DRY (Don't Repeat Yourself)**
- Sidebar hanya didefinisikan 1x
- Menu items menggunakan loop
- Stats cards menggunakan config array

**2. KISS (Keep It Simple, Stupid)**
- Setiap file punya 1 tanggung jawab
- Struktur folder intuitif
- Naming yang jelas

**3. Bahasa Indonesia**
- UI labels: Bahasa Indonesia
- Istilah teknis: English (Dashboard, License Key, API)

### Struktur Views:

```
views/
├── pages/              # Semua halaman aplikasi
├── partials/           # Komponen reusable
│   ├── head.ejs       # HTML head
│   ├── styles.ejs     # Custom CSS
│   └── components/
│       └── sidebar.ejs # Navigation
└── layout.ejs         # Layout wrapper
```

## 🔌 API Documentation

### 1. Aktivasi License

**Endpoint:** `POST /api/activate`

**Request:**
```json
{
  "license_key": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV",
  "domain": "example.com"
}
```

**Response:**
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

### 2. Validasi License

**Endpoint:** `POST /api/check`

**Request:**
```json
{
  "license_key": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV",
  "domain": "example.com"
}
```

**Response:**
```json
{
  "status": "active",
  "expire_at": "2025-12-31",
  "remaining_days": 365
}
```

### 3. Webhook (Auto Generate)

**Endpoint:** `POST /webhook/create-license`

**Headers:**
```
x-webhook-secret: your-webhook-secret
```

**Request:**
```json
{
  "buyer_email": "customer@example.com",
  "buyer_name": "John Doe",
  "product_id": "premium-plugin",
  "max_domains": 3
}
```

**Response:**
```json
{
  "status": "ok",
  "license_key": "ABCD1234-5678-90EF-GHIJ-KLMNOPQRSTUV",
  "expire_at": "2025-12-31"
}
```

## 💻 Contoh Implementasi

### PHP/WordPress

```php
<?php
// Aktivasi License
function activate_license($license_key) {
    $response = wp_remote_post('http://your-server.com/api/activate', [
        'body' => json_encode([
            'license_key' => $license_key,
            'domain' => $_SERVER['HTTP_HOST']
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    return $body['status'] === 'ok';
}

// Validasi License (Cron Job Harian)
add_action('daily_license_check', 'check_license_status');

function check_license_status() {
    $license_key = get_option('license_key');
    
    $response = wp_remote_post('http://your-server.com/api/check', [
        'body' => json_encode([
            'license_key' => $license_key,
            'domain' => $_SERVER['HTTP_HOST']
        ]),
        'headers' => ['Content-Type' => 'application/json']
    ]);
    
    $body = json_decode(wp_remote_retrieve_body($response), true);
    update_option('license_status', $body['status']);
}
?>
```

### JavaScript/Node.js

```javascript
// Aktivasi License
async function activateLicense(licenseKey) {
    const response = await fetch('http://your-server.com/api/activate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            license_key: licenseKey,
            domain: window.location.hostname
        })
    });
    
    const data = await response.json();
    return data.status === 'ok';
}

// Check License Status
async function checkLicense() {
    const licenseKey = localStorage.getItem('license_key');
    
    const response = await fetch('http://your-server.com/api/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            license_key: licenseKey,
            domain: window.location.hostname
        })
    });
    
    const data = await response.json();
    return data.status === 'active';
}
```

## 🛠️ Admin Dashboard Features

### 1. Dashboard
- Statistics cards (Total, Aktif, Ditangguhkan, Kadaluarsa)
- Latest activations table
- Real-time data

### 2. License Management
- List all licenses dengan search & pagination
- Create new license dengan auto-generated key
- View license details
- Suspend/Reactivate license
- Extend expiry date
- View activated domains

### 3. Documentation
- Complete API documentation
- Code examples (PHP & JavaScript)
- Error handling guide
- Best practices

## 🔒 Security Features

- ✅ JWT-based authentication
- ✅ HTTP-only cookies
- ✅ Bcrypt password hashing
- ✅ Rate limiting (API & Admin)
- ✅ Webhook secret validation
- ✅ SQL injection prevention
- ✅ Input validation (Joi)

## 📊 Database Schema

### Tables:

**admin**
- id, username, password_hash, created_at

**license**
- id, license_key, max_domains, expire_at, status, notes, created_at

**domain**
- id, license_id, domain, last_check_at, created_at

## 🎨 UI/UX Features

- ✅ Dark theme (modern & professional)
- ✅ Responsive design
- ✅ Smooth transitions & animations
- ✅ Color-coded status badges
- ✅ Empty states
- ✅ Loading feedback
- ✅ Bahasa Indonesia

## 📝 Environment Variables

```env
# Server
PORT=3001

# Security
JWT_SECRET=your-super-secret-jwt-key-change-this
WEBHOOK_SECRET=your-webhook-secret-key

# Admin (untuk create-admin script)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
```

## 🚀 Deployment

### Production Checklist:

1. ✅ Change JWT_SECRET & WEBHOOK_SECRET
2. ✅ Change admin password
3. ✅ Set NODE_ENV=production
4. ✅ Use process manager (PM2)
5. ✅ Setup reverse proxy (Nginx)
6. ✅ Enable HTTPS
7. ✅ Setup database backups
8. ✅ Configure firewall

### PM2 Example:

```bash
# Install PM2
npm install -g pm2

# Start app
pm2 start server.js --name license-server

# Auto-restart on reboot
pm2 startup
pm2 save
```

## 🔧 Troubleshooting

### Port sudah digunakan:
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3001
kill -9 <PID>
```

### Database locked:
```bash
# Stop server
# Delete .sqlite-shm and .sqlite-wal files
# Restart server
```

### Migration error:
```bash
# Delete database.sqlite
# Run migration again
npm run migrate
npm run create-admin
```

## 📈 Performance Tips

1. **Rate Limiting**: Sudah diimplementasikan (15 req/15min untuk API)
2. **Database Indexing**: Sudah ada di license_key dan domain
3. **Caching**: Bisa tambahkan Redis untuk session
4. **CDN**: TailwindCSS & Alpine.js sudah dari CDN

## 🧪 Testing

### Manual Testing:

1. **Login**: Test dengan credentials yang benar/salah
2. **Dashboard**: Verifikasi stats muncul dengan benar
3. **Create License**: Test form validation
4. **API**: Test dengan Postman/curl
5. **Webhook**: Test dengan mock requests

## 📚 Additional Resources

- **Spec**: Lihat `spec.md` untuk spesifikasi lengkap
- **README**: Lihat `README.md` untuk setup guide
- **Refactoring**: Lihat `VIEWS-REFACTORING.md` untuk detail struktur views

## 🎯 Best Practices

### Development:
- ✅ Follow Clean Code principles (DRY, KISS)
- ✅ Use meaningful variable names
- ✅ Add comments untuk logic kompleks
- ✅ Test sebelum commit

### Security:
- ✅ Never commit .env file
- ✅ Always validate user input
- ✅ Use prepared statements (SQL injection prevention)
- ✅ Keep dependencies updated

### UI/UX:
- ✅ Consistent spacing & typography
- ✅ Clear error messages
- ✅ Loading states
- ✅ Empty states
- ✅ Responsive design

## 📞 Support

Untuk bantuan lebih lanjut:
- Email: support@example.com
- Documentation: http://localhost:3001/admin/documentation

---

## ✅ Changelog

### v1.0.0 (Current)
- ✅ Complete license management system
- ✅ API untuk aktivasi & validasi
- ✅ Webhook integration
- ✅ Admin dashboard dengan dark theme
- ✅ Bahasa Indonesia
- ✅ Clean Code structure (DRY, KISS)
- ✅ Comprehensive documentation

---

**License Server System v1.0** - Ready for Production! 🚀

Developed with ❤️ using Node.js, Express, SQLite, EJS, TailwindCSS, and Alpine.js
