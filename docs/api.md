# 📚 API Documentation

## Base URL

```
http://localhost:3000/api
```

For production, replace with your server domain.

## Authentication

Admin routes require JWT authentication via HTTP-only cookies. Public API endpoints (`/activate` and `/check`) do not require authentication.

## Endpoints

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

- **404 Not Found**:
  ```json
  {
    "status": "error",
    "message": "License key not found"
  }
  ```

- **403 Forbidden** (License Suspended):
  ```json
  {
    "status": "error",
    "message": "License is suspended"
  }
  ```

- **403 Forbidden** (License Expired):
  ```json
  {
    "status": "error",
    "message": "License has expired"
  }
  ```

- **403 Forbidden** (Domain Limit):
  ```json
  {
    "status": "error",
    "message": "Domain limit reached"
  }
  ```

---

### 2. Validate License

**Endpoint**: `POST /api/check`

**Description**: Check license status. Use this periodically in your application to verify license validity.

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

**Other Status Responses**:

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

---

### 3. Webhook - Auto Generate License

**Endpoint**: `POST /webhook/create-license`

**Description**: Automatically generate a license when receiving a webhook from e-commerce platforms.

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

**Error Response** (401):
```json
{
  "status": "error",
  "message": "Invalid webhook secret"
}
```

---

## Rate Limiting

To prevent abuse, the API implements rate limiting:

- **Activation Endpoint**: 30 requests per minute
- **Validation Endpoint**: 60 requests per minute
- **Admin Endpoints**: 20 requests per minute

When rate limit is exceeded, you'll receive:
```json
{
  "status": "error",
  "message": "Too many requests"
}
```

---

## Integration Examples

### JavaScript/Node.js

```javascript
// Activate License
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

// Validate License
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

### PHP/WordPress

```php
<?php
// Activate License
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

// Validate License (Daily Cron Job)
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

---

## Webhook Integration

### WooCommerce

1. Install a webhook plugin or use WooCommerce built-in webhooks
2. Create a webhook for "Order Completed"
3. Set URL to: `http://your-server.com/webhook/create-license`
4. Add custom header: `x-webhook-secret: your-secret`
5. Map order data to required fields

### Easy Digital Downloads

Use the EDD Webhooks extension to send order data to the webhook endpoint.

---

## Error Handling Best Practices

1. **Always check response status** before processing data
2. **Implement retry logic** for network failures (max 3 retries)
3. **Cache validation results** to reduce API calls (recommended: 24 hours)
4. **Handle rate limiting** by implementing exponential backoff
5. **Log errors** for debugging purposes

Example with retry logic:

```javascript
async function checkLicenseWithRetry(maxRetries = 3) {
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await checkLicense();
        } catch (error) {
            if (i === maxRetries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
    }
}
```
