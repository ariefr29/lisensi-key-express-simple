# 💻 Development Guide

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **npm**: v8 or higher
- **Git**: For version control

### Initial Setup

```bash
# Clone the repository
git clone <repository-url>
cd lisensi-key-2

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your local configuration

# Run database migrations
npm run migrate

# Create admin user
npm run create-admin

# Start development server
npm run dev
```

The server will start at `http://localhost:3000`

---

## Project Structure

```
lisensi-key-2/
├── docs/                   # Documentation
├── examples/               # Sample implementations
├── migrations/             # Database migrations
├── scripts/                # Utility scripts
├── src/                    # Source code
│   ├── config/            # Configuration files
│   ├── controllers/       # Business logic
│   ├── middlewares/       # Express middlewares
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   ├── utils/             # Helper functions
│   └── views/             # EJS templates
├── .env                   # Environment variables (not in git)
├── .gitignore            # Git ignore rules
├── package.json          # Dependencies and scripts
└── server.js             # Application entry point
```

---

## Available Scripts

```bash
# Development
npm run dev          # Start development server with nodemon (auto-reload)

# Production
npm start            # Start production server

# Database
npm run migrate      # Run database migrations
npm run create-admin # Create admin user (interactive)

# Code Quality
npm run lint         # Run ESLint to check code quality
npm run format       # Format code with Prettier
```

---

## Code Architecture

### MVC Pattern

The application follows the Model-View-Controller pattern:

**Models** (`src/models/`)
- Handle database operations
- Data validation
- Business logic related to data

**Controllers** (`src/controllers/`)
- Handle HTTP requests
- Call model methods
- Return responses

**Views** (`src/views/`)
- EJS templates for admin dashboard
- Partials for reusable components

### Routing

Routes are organized by feature:

```
src/routes/
├── adminRoutes.js     # Admin dashboard routes
├── licenseRoutes.js   # Public API routes
└── webhookRoutes.js   # Webhook endpoints
```

### Middleware

Custom middlewares in `src/middlewares/`:

- `authAdmin.js` - JWT authentication for admin
- `validateRequest.js` - Request validation using Joi

---

## Database

### Schema

**admin** table:
```sql
CREATE TABLE admin (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**license** table:
```sql
CREATE TABLE license (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_key TEXT UNIQUE NOT NULL,
    max_domains INTEGER NOT NULL,
    expire_at DATE,
    status TEXT DEFAULT 'active',
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

**domain** table:
```sql
CREATE TABLE domain (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    license_id INTEGER NOT NULL,
    domain TEXT NOT NULL,
    activated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    last_check_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (license_id) REFERENCES license(id),
    UNIQUE(license_id, domain)
);
```

### Migrations

To add a new migration:

1. Create SQL file in `migrations/`
2. Update `migrations/run.js` to include new migration
3. Run `npm run migrate`

---

## Adding New Features

### Example: Adding a New API Endpoint

1. **Create Model Method** (`src/models/yourModel.js`):
```javascript
const db = require('../config/db');

async function getSomething(id) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM table WHERE id = ?', [id], (err, row) => {
            if (err) reject(err);
            else resolve(row);
        });
    });
}

module.exports = { getSomething };
```

2. **Create Controller** (`src/controllers/yourController.js`):
```javascript
const yourModel = require('../models/yourModel');

async function handleGetSomething(req, res) {
    try {
        const data = await yourModel.getSomething(req.params.id);
        res.json({ status: 'ok', data });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 'error', message: 'Server error' });
    }
}

module.exports = { handleGetSomething };
```

3. **Create Route** (`src/routes/yourRoutes.js`):
```javascript
const express = require('express');
const router = express.Router();
const yourController = require('../controllers/yourController');

router.get('/something/:id', yourController.handleGetSomething);

module.exports = router;
```

4. **Register in Server** (`server.js`):
```javascript
const yourRoutes = require('./src/routes/yourRoutes');
app.use('/api', yourRoutes);
```

---

## Testing

### Manual Testing

1. **Test API Endpoints**:
```bash
# Activate license
curl -X POST http://localhost:3000/api/activate \
  -H "Content-Type: application/json" \
  -d '{"license_key":"YOUR-KEY","domain":"test.com"}'

# Check license
curl -X POST http://localhost:3000/api/check \
  -H "Content-Type: application/json" \
  -d '{"license_key":"YOUR-KEY","domain":"test.com"}'
```

2. **Test Admin Dashboard**:
   - Navigate to `http://localhost:3000/admin/login`
   - Login with admin credentials
   - Test all CRUD operations

### Automated Testing (Future)

Framework recommendations:
- **Jest** for unit testing
- **Supertest** for API testing
- **Puppeteer** for E2E testing

---

## Code Style Guidelines

### JavaScript

- Use **async/await** instead of callbacks
- Use **const** and **let**, avoid **var**
- Use arrow functions for callbacks
- Add error handling with try/catch
- Comment complex logic

### Naming Conventions

- **Files**: camelCase (e.g., `licenseController.js`)
- **Functions**: camelCase (e.g., `activateLicense`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `JWT_SECRET`)
- **Database**: snake_case (e.g., `license_key`)

### Example:

```javascript
// Good
async function activateLicense(licenseKey, domain) {
    try {
        const license = await licenseModel.findByKey(licenseKey);
        // ... logic
    } catch (error) {
        console.error('Error activating license:', error);
        throw error;
    }
}

// Avoid
function activate_license(license_key, domain, callback) {
    licenseModel.findByKey(license_key, function(err, license) {
        // ... callback hell
    });
}
```

---

## Debugging

### Enable Debug Logs

Add to `.env`:
```env
DEBUG=license-server:*
```

### Common Issues

**Database Locked**:
- Close any DB browser tools
- Delete `.sqlite-shm` and `.sqlite-wal` files
- Restart server

**Port Already in Use**:
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :3000
kill -9 <PID>
```

**Missing Dependencies**:
```bash
rm -rf node_modules package-lock.json
npm install
```

---

## Git Workflow

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### Commit Messages

Format: `type: description`

Types:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Add tests
- `chore:` Maintenance

Example:
```bash
git commit -m "feat: add license expiration notification"
git commit -m "fix: correct domain count query"
git commit -m "docs: update API documentation"
```

---

## Contributing

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines on:
- Code of conduct
- Pull request process
- Code review checklist

---

## Performance Best Practices

1. **Database**:
   - Use indexes on frequently queried fields
   - Limit query results with pagination
   - Close database connections properly

2. **API**:
   - Implement rate limiting (already done)
   - Cache frequently accessed data
   - Use compression middleware

3. **Security**:
   - Always validate user input
   - Use parameterized queries
   - Keep dependencies updated
   - Don't expose stack traces in production

---

## Resources

- [Express.js Documentation](https://expressjs.com/)
- [SQLite Documentation](https://www.sqlite.org/docs.html)
- [JWT Best Practices](https://jwt.io/introduction)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
