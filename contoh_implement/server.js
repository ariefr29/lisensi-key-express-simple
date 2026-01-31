const express = require('express');
const path = require('path');
const fs = require('fs');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3005;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Path to store the active license (simulated DB)
const LICENSE_FILE = path.join(__dirname, 'license.json');

// Helper to read stored license
function getStoredLicense() {
    try {
        const data = fs.readFileSync(LICENSE_FILE, 'utf-8');
        const obj = JSON.parse(data);
        return obj.license_key || null;
    } catch (e) {
        return null;
    }
}

// Helper to save license
function saveLicense(key) {
    const obj = { license_key: key };
    fs.writeFileSync(LICENSE_FILE, JSON.stringify(obj, null, 2));
}

// Helper to clear license
function clearLicense() {
    if (fs.existsSync(LICENSE_FILE)) fs.unlinkSync(LICENSE_FILE);
}

// Proxy activation request to main license server (assumed running on port 3001)
app.post('/activate', async (req, res) => {
    const { license_key } = req.body;
    if (!license_key) {
        return res.status(400).json({ status: 'error', message: 'License key required' });
    }
    try {
        const response = await axios.post('http://localhost:3001/api/activate', {
            license_key,
            domain: `localhost:${PORT}`
        });
        if (response.data.status === 'ok') {
            saveLicense(license_key);
        }
        res.json(response.data);
    } catch (err) {
        console.error('Activation proxy error:', err.response?.data || err.message);
        // Return the actual error from the license server if available
        if (err.response?.data) {
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ status: 'error', message: 'Unable to contact license server: ' + err.message });
    }
});

// Proxy check request to main license server using stored key
app.get('/check', async (req, res) => {
    const storedKey = getStoredLicense();
    if (!storedKey) {
        return res.status(400).json({ status: 'error', message: 'No license stored' });
    }
    try {
        const response = await axios.post('http://localhost:3001/api/check', {
            license_key: storedKey,
            domain: `localhost:${PORT}`
        });
        res.json(response.data);
    } catch (err) {
        console.error('Check proxy error:', err.response?.data || err.message);
        // Return the actual error from the license server if available
        if (err.response?.data) {
            return res.status(err.response.status).json(err.response.data);
        }
        res.status(500).json({ status: 'error', message: 'Unable to contact license server: ' + err.message });
    }
});

// Endpoint to serve premium content (simple JSON for demo)
app.get('/premium', (req, res) => {
    const storedKey = getStoredLicense();
    if (!storedKey) {
        return res.status(403).json({ status: 'error', message: 'License required' });
    }
    // In a real app you would verify again; here we assume stored key is valid
    res.json({ status: 'ok', content: '🎉 This is premium content visible only with a valid license!' });
});

app.listen(PORT, () => {
    console.log(`Sample license app listening on http://localhost:${PORT}`);
});
