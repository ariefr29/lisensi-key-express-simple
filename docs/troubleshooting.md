# 🔧 Troubleshooting Guide

Common issues and their solutions for the License Server System.

---

## Server Issues

### Port Already in Use

**Error**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solution (Windows)**:
```powershell
# Find process using the port
netstat -ano | findstr :3000

# Kill the process
taskkill /PID <PID> /F
```

**Solution (Linux/Mac)**:
```bash
# Find process using the port
lsof -i :3000

# Kill the process
kill -9 <PID>
```

**Alternative**: Change the port in `.env`:
```env
PORT=3001
```

---

### Server Won't Start

**Symptoms**: Server crashes immediately or shows errors

**Checklist**:
1. Check if `.env` file exists
2. Verify all required environment variables are set
3. Ensure database file has correct permissions
4. Check Node.js version (requires v18+)

```bash
# Verify Node.js version
node --version

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for errors
npm start
```

---

## Database Issues

### Database Locked Error

**Error**: `SQLITE_BUSY: database is locked`

**Causes**:
- Another process is accessing the database
- Previous connection wasn't closed properly
- Database browser tool is open

**Solution**:
```bash
# Stop the server
# Close any DB browser tools (DB Browser for SQLite, etc.)

# Remove temporary files
rm database.sqlite-shm
rm database.sqlite-wal

# Restart server
npm start
```

---

### Migration Errors

**Error**: Tables already exist

**Solution**:
```bash
# Backup current database (if needed)
cp database.sqlite database.backup.sqlite

# Delete database
rm database.sqlite

# Run migration again
npm run migrate
npm run create-admin
```

---

### Domain Not Showing in Dashboard

**Symptoms**: Activated domains don't appear in the license details

**This was a known bug that has been fixed.** If you're still experiencing this:

1. **Update to latest version** (v1.1.0+)
2. **Verify the fix**:
   - Check `src/controllers/licenseController.js`
   - Line 74 should have `await domainModel.create(...)`
   - All database calls should have `await`

3. **Test**:
```bash
# Create a new license in admin panel
# Activate it via API
curl -X POST http://localhost:3000/api/activate \
  -H "Content-Type: application/json" \
  -d '{"license_key":"YOUR-KEY","domain":"test.com"}'

# Check in admin dashboard - domain should appear
```

---

## Authentication Issues

### Admin Login Fails

**Error**: Invalid credentials (but credentials are correct)

**Solutions**:

1. **Check password**:
```bash
# Reset admin password
rm database.sqlite
npm run migrate
npm run create-admin
```

2. **Check JWT_SECRET**:
   - Ensure `JWT_SECRET` in `.env` is set
   - Don't change it after creating sessions

3. **Clear cookies**:
   - Clear browser cookies for localhost
   - Try incognito/private browsing

---

### Session Expires Immediately

**Cause**: JWT token issues

**Solution**:
```bash
# Check .env file
cat .env | grep JWT_SECRET

# If missing or short, update it
echo "JWT_SECRET=your-long-secret-minimum-32-characters" >> .env

# Restart server
npm start
```

---

## API Issues

### License Activation Fails

**Error 404**: License not found

**Solutions**:
1. Verify license key exists in database
2. Check for typos in license key
3. Ensure license status is 'active'

**Error 403**: License suspended/expired

**Solutions**:
1. Check license status in admin dashboard
2. Reactivate if suspended
3. Extend expiration date if expired

**Error 403**: Domain limit reached

**Solutions**:
1. Check current domain count in license details
2. Increase `max_domains` if needed
3. Remove inactive domains

---

### Webhook Not Working

**Error 401**: Invalid webhook secret

**Solution**:
```bash
# Check webhook secret matches
# In .env:
cat .env | grep WEBHOOK_SECRET

# In your webhook request, header should be:
# x-webhook-secret: <same-value-as-env>
```

**No Response**:
1. Check if server is running
2. Verify webhook URL is correct
3. Check firewall rules
4. Review server logs

---

## Development Issues

### Nodemon Not Reloading

**Solution**:
```bash
# Kill nodemon process
taskkill /F /IM node.exe  # Windows
killall node              # Linux/Mac

# Restart
npm run dev
```

---

### Dependencies Won't Install

**Error**: npm install fails

**Solutions**:
```bash
# Clear npm cache
npm cache clean --force

# Delete lock file and node_modules
rm -rf node_modules package-lock.json

# Re-install
npm install

# If still fails, try specific Node version
nvm install 18
nvm use 18
npm install
```

---

## Sample App Issues

### Sample App Can't Connect to Server

**Error**: Connection refused or timeout

**Checklist**:
1. Main server is running on port 3000 (or configured port)
2. Sample app is configured with correct server URL
3. Firewall allows connections

**Solution**:
```bash
# In terminal 1: Start main server
cd lisensi-key-2
npm run dev

# In terminal 2: Start sample app
cd examples
npm install
node server.js

# Test connection
curl http://localhost:3000/api/check
```

---

## Production Issues

### High Memory Usage

**Cause**: SQLite not suitable for high traffic

**Solution**: Migrate to PostgreSQL

---

### Slow Performance

**Solutions**:
1. Add Redis caching for validation results
2. Implement database connection pooling
3. Use PM2 cluster mode
4. Add CDN for static assets

---

### SSL Certificate Issues

**Error**: Certificate expired or invalid

**Solution**:
```bash
# Renew Let's Encrypt certificate
sudo certbot renew

# Restart Nginx
sudo systemctl restart nginx
```

---

## Debugging Tips

### Enable Verbose Logging

Add to `.env`:
```env
NODE_ENV=development
DEBUG=*
```

### Check Application Logs

```bash
# If using PM2
pm2 logs license-server

# Check specific error logs
pm2 logs license-server --err

# View logs in real-time
tail -f /path/to/logs/error.log
```

### Test API Endpoints

```bash
# Test activation
curl -v -X POST http://localhost:3000/api/activate \
  -H "Content-Type: application/json" \
  -d '{"license_key":"TEST-KEY","domain":"test.com"}'

# Test validation
curl -v -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"license_key":"TEST-KEY","domain":"test.com"}'
```

---

## Getting Help

If you still can't resolve your issue:

1. **Check logs** for detailed error messages
2. **Search existing issues** in the repository
3. **Create a new issue** with:
   - Error message (full stack trace)
   - Steps to reproduce
   - Your environment (Node version, OS, etc.)
   - What you've already tried

---

## Common Error Codes

| Code | Meaning | Typical Cause |
|------|---------|---------------|
| 400 | Bad Request | Invalid JSON or missing required fields |
| 401 | Unauthorized | Invalid webhook secret |
| 403 | Forbidden | License suspended, expired, or limit reached |
| 404 | Not Found | License key doesn't exist |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side bug or database issue |

---

**Still need help?** Create an issue on GitHub with detailed information about your problem.
