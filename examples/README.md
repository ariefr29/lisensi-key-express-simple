# 📦 Sample Implementation - License Integration Example

A minimal Node.js/Express application demonstrating how to integrate the License Server into your application.

## 🌟 Features

- ✅ Activate license keys
- ✅ Validate license status
- ✅ Store activated licenses locally
- ✅ Protect premium content
- ✅ Simple, clean UI

---

## 📋 Prerequisites

- **Main License Server** must be running (default port: 3000)
- **Node.js** v18+ and npm installed

---

## 🚀 Quick Start

### 1. Start Main License Server

In the root directory:

```bash
cd ..
npm run dev
```

Server will run at `http://localhost:3000`

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Sample App

```bash
node server.js
```

Sample app will run at `http://localhost:3005`

### 4. Open in Browser

Navigate to `http://localhost:3005`

---

## 💻 Usage

### Create a License Key

1. Open admin dashboard: `http://localhost:3000/admin/dashboard`
2. Login with admin credentials
3. Navigate to **Licenses** → **Create License**
4. Set configuration:
   - **Max Domains**: e.g., `3`
   - **Expire Date**: Choose future date
   - **Notes**: Optional description
5. Click **Create** and copy the generated license key

### Activate License in Sample App

1. Open sample app: `http://localhost:3005`
2. Paste license key in the input field
3. Click **Activate**
4. If valid, premium content will appear

### Check License Status

Click **Refresh Status** button to verify current license status.

---

## 🔌 API Endpoints

### POST `/activate`

Activate a license key.

**Request**:
```json
{
  "license_key": "YOUR-LICENSE-KEY"
}
```

**Response**:
```json
{
  "status": "ok",
  "message": "License activated successfully"
}
```

### GET `/check`

Check stored license status.

**Response**:
```json
{
  "status": "active",
  "expire_at": "2025-12-31",
  "remaining_days": 365
}
```

### GET `/premium`

Access premium content (requires valid license).

**Response**:
```json
{
  "status": "ok",
  "message": "Welcome to premium content!"
}
```

---

## 📁 File Structure

```
examples/
├── public/              # Frontend files
│   ├── index.html      # Main UI
│   ├── styles.css      # Styling
│   └── client.js       # Frontend logic
├── server.js           # Express server
├── package.json        # Dependencies
└── README.md           # This file
```

---

## 🧪 Testing Scenarios

### Scenario 1: Valid License

1. Create license with future expiry date
2. Activate in sample app
3. **Expected**: Premium content displayed

### Scenario 2: Expired License

1. Create license with past expiry date
2. Try to activate
3. **Expected**: Error message "License has expired"

### Scenario 3: Suspended License

1. Activate valid license
2. Suspend license in admin dashboard
3. Click "Refresh Status" in sample app
4. **Expected**: Premium content hidden, error displayed

### Scenario 4: Domain Limit

1. Create license with `max_domains: 1`
2. Activate successfully
3. Try activating from different domain
4. **Expected**: Error "Domain limit reached"

---

## 🛠️ Configuration

### Change Server Port

Edit `server.js`:

```javascript
const PORT = 3005; // Change to your preferred port
```

### Change Main Server URL

Edit `server.js`:

```javascript
const LICENSE_SERVER_URL = 'http://localhost:3000'; // Change to your server
```

---

## 🔧 Troubleshooting

### Port Conflict

If port 3005 is in use, change the `PORT` variable in `server.js`.

### Connection Refused

Ensure main license server is running at `http://localhost:3000`.

### CORS Errors

The main server allows cross-origin requests by default. If you still encounter issues, check firewall settings.

---

## 📝 Integration Guide

### For Your Application

1. **Install Dependencies**:
```bash
npm install axios express
```

2. **Activation Logic**:
```javascript
const axios = require('axios');

async function activateLicense(licenseKey) {
    const response = await axios.post('http://your-server.com/api/activate', {
        license_key: licenseKey,
        domain: window.location.hostname
    });

    if (response.data.status === 'ok') {
        localStorage.setItem('license', licenseKey);
        return true;
    }
    return false;
}
```

3. **Validation Logic**:
```javascript
async function checkLicense() {
    const licenseKey = localStorage.getItem('license');

    const response = await axios.post('http://your-server.com/api/check', {
        license_key: licenseKey,
        domain: window.location.hostname
    });

    return response.data.status === 'active';
}
```

4. **Protect Content**:
```javascript
async function init() {
    const isValid = await checkLicense();

    if (isValid) {
        // Show premium features
        showPremiumContent();
    } else {
        // Show activation form
        showActivationForm();
    }
}
```

---

## 🎯 Best Practices

1. **Cache Validation Results**: Don't check license on every page load (use 24-hour cache)
2. **Handle Errors Gracefully**: Show user-friendly error messages
3. **Implement Retry Logic**: Network requests can fail
4. **Secure Storage**: Use secure methods to store license keys
5. **Regular Checks**: Verify license status periodically (daily/weekly)

---

## 📚 Additional Resources

- [Main Documentation](../README.md)
- [API Documentation](../docs/api.md)
- [Deployment Guide](../docs/deployment.md)
- [Troubleshooting](../docs/troubleshooting.md)

---

## 🤝 Support

Having issues? Check the [troubleshooting guide](../docs/troubleshooting.md) or create an issue on GitHub.

---

**Version**: 1.0.0
**License**: ISC
**Author**: Devlogor
