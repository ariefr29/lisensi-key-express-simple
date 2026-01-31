# 🚀 Deployment Guide

## Production Checklist

Before deploying to production, ensure you complete these steps:

- [ ] Change `JWT_SECRET` to a strong, unique value
- [ ] Change `WEBHOOK_SECRET` to a strong, unique value
- [ ] Change default admin password
- [ ] Set `NODE_ENV=production`
- [ ] Configure database backups
- [ ] Setup HTTPS/SSL certificates
- [ ] Configure firewall rules
- [ ] Setup monitoring and logging
- [ ] Test all endpoints

---

## Deployment Options

### 1. VPS Deployment (Ubuntu/Debian)

#### Prerequisites
- Ubuntu 20.04 or later
- Root or sudo access
- Domain name (optional but recommended)

#### Step 1: Install Node.js

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### Step 2: Clone and Setup Project

```bash
# Clone repository
git clone <your-repo-url>
cd lisensi-key-2

# Install dependencies
npm install

# Setup environment
cp .env.example .env
nano .env  # Edit with your production values
```

#### Step 3: Run Database Migration

```bash
npm run migrate
npm run create-admin
```

#### Step 4: Install and Configure PM2

```bash
# Install PM2 globally
sudo npm install -g pm2

# Start application
pm2 start server.js --name license-server

# Setup auto-restart on system reboot
pm2 startup
pm2 save

# Monitor application
pm2 logs license-server
pm2 status
```

#### Step 5: Configure Nginx Reverse Proxy

```bash
# Install Nginx
sudo apt-get update
sudo apt-get install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/license-server
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:

```bash
sudo ln -s /etc/nginx/sites-available/license-server /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Step 6: Setup SSL with Let's Encrypt

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Obtain SSL certificate
sudo certbot --nginx -d your-domain.com

# Auto-renewal is configured automatically
```

---

### 2. Render.com Deployment

1. **Create New Web Service**
   - Connect your GitHub repository
   - Select the branch to deploy

2. **Configure Build Settings**
   - Build Command: `npm install && npm run migrate && npm run create-admin`
   - Start Command: `npm start`

3. **Add Environment Variables**
   - Go to Environment tab
   - Add all variables from `.env.example`
   - Set `NODE_ENV=production`

4. **Deploy**
   - Render will automatically deploy your app
   - Access via the provided URL

---

### 3. Railway.app Deployment

1. **New Project**
   - Click "Deploy from GitHub"
   - Select your repository

2. **Configure Environment**
   - Add environment variables
   - Railway auto-detects Node.js

3. **Deploy**
   - Railway automatically builds and deploys
   - Access via the provided URL

---

### 4. DigitalOcean App Platform

1. **Create App**
   - Connect to GitHub
   - Select repository and branch

2. **Configure App**
   - Detected as Node.js app
   - Build Command: `npm install && npm run migrate`
   - Run Command: `npm start`

3. **Add Environment Variables**
   - Configure in App settings
   - Add all required variables

4. **Deploy**
   - Click "Deploy"
   - Access via provided URL

---

## Post-Deployment Tasks

### 1. Database Backup Strategy

Create a backup script:

```bash
#!/bin/bash
# backup-db.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/path/to/backups"
DB_FILE="/path/to/database.sqlite"

mkdir -p $BACKUP_DIR
cp $DB_FILE $BACKUP_DIR/database_$DATE.sqlite

# Keep only last 30 backups
ls -t $BACKUP_DIR/database_*.sqlite | tail -n +31 | xargs rm -f
```

Add to crontab (daily at 2 AM):
```bash
crontab -e
# Add this line:
0 2 * * * /path/to/backup-db.sh
```

### 2. Monitoring Setup

Install PM2 monitoring:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 3. Firewall Configuration

```bash
# Allow SSH
sudo ufw allow 22

# Allow HTTP/HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Enable firewall
sudo ufw enable
```

### 4. Security Hardening

```bash
# Disable password authentication (use SSH keys only)
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd

# Setup fail2ban
sudo apt-get install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

---

## Environment Variables Reference

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Security (CHANGE THESE!)
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
WEBHOOK_SECRET=your-webhook-secret-minimum-32-characters

# Admin Credentials (for initial setup only)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=change-this-strong-password
```

---

## Troubleshooting

### Application Won't Start

```bash
# Check logs
pm2 logs license-server

# Restart application
pm2 restart license-server

# Check if port is in use
sudo netstat -tulpn | grep :3000
```

### Database Issues

```bash
# Check database file permissions
ls -la database.sqlite

# Fix permissions if needed
chmod 644 database.sqlite
```

### Nginx Issues

```bash
# Test configuration
sudo nginx -t

# Check error logs
sudo tail -f /var/log/nginx/error.log

# Restart Nginx
sudo systemctl restart nginx
```

---

## Scaling Considerations

### For High Traffic

1. **Use PostgreSQL** instead of SQLite
   - Better concurrent write handling
   - More suitable for production

2. **Add Redis for Caching**
   - Cache license validation results
   - Reduce database load

3. **Load Balancing**
   - Deploy multiple instances
   - Use Nginx load balancer

4. **CDN Integration**
   - Serve static assets via CDN
   - Reduce server load

---

## Maintenance

### Regular Tasks

1. **Weekly**: Review logs for errors
2. **Monthly**: Update dependencies (`npm update`)
3. **Quarterly**: Review and rotate secrets
4. **As needed**: Database cleanup and optimization

### Update Procedure

```bash
# Pull latest code
git pull origin main

# Install new dependencies
npm install

# Run migrations (if any)
npm run migrate

# Restart application
pm2 restart license-server
```
