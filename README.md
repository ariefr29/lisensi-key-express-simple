# 🔐 License Server System

> A complete license management system built with Node.js, Express, and SQLite

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](https://github.com/your-username/lisensi-key-2)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](#)
[![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org)

## ✨ Features

- 🔑 **License Key Generation** - Automatic generation of secure license keys
- 🌐 **Domain Binding** - Bind licenses to specific domains with limits
- ✅ **License Validation** - Real-time license status checking
- 🎯 **Admin Dashboard** - Beautiful web-based management interface
- 🔒 **Security** - JWT authentication, bcrypt password hashing, rate limiting
- 📊 **Statistics** - Track license usage and activations
- 🔗 **Webhook Support** - Auto-generate licenses from e-commerce platforms
- 🎨 **Modern UI** - Built with TailwindCSS and Alpine.js
- 📦 **Sample Implementation** - Ready-to-use example in [`examples/`](./examples)

---

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Edit .env with your configuration
# IMPORTANT: Change JWT_SECRET and WEBHOOK_SECRET!

# Run database migrations
npm run migrate

# Create admin user
npm run create-admin

# Start development server
npm run dev
```

The server will start at **http://localhost:3000**

### First Steps

1. **Access Admin Dashboard**: http://localhost:3000/admin/dashboard
2. **Login** with credentials from `.env` (default: admin / admin123)
3. **Create License**: Navigate to Licenses → Create License
4. **Test Integration**: Check out the [`examples/`](./examples) folder

---

## 📁 Project Structure

```
lisensi-key-2/
├── docs/                   # 📚 Documentation
│   ├── api.md             # API endpoints reference
│   ├── deployment.md      # Deployment guides
│   ├── development.md     # Development setup
│   └── troubleshooting.md # Common issues & solutions
├── examples/              # Sample implementation
├── migrations/            # Database migrations
├── scripts/               # Utility scripts
├── src/                   # Source code
│   ├── config/           # Configuration
│   ├── controllers/      # Business logic
│   ├── middlewares/      # Express middlewares
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Helper functions
│   └── views/            # EJS templates
├── .env.example          # Environment variables template
├── package.json          # Dependencies and scripts
└── server.js             # Application entry point
```

---

## 📖 Documentation

- **[API Documentation](./docs/api.md)** - Complete API reference with examples
- **[Development Guide](./docs/development.md)** - Setup, architecture, and code style
- **[Deployment Guide](./docs/deployment.md)** - Deploy to VPS, Render, Railway, etc.
- **[Troubleshooting](./docs/troubleshooting.md)** - Common issues and solutions
- **[Contributing](./CONTRIBUTING.md)** - How to contribute to this project

---

## 🔌 API Quick Reference

### Activate License
```bash
POST /api/activate
{
  "license_key": "YOUR-LICENSE-KEY",
  "domain": "example.com"
}
```

### Validate License
```bash
POST /api/check
{
  "license_key": "YOUR-LICENSE-KEY",
  "domain": "example.com"
}
```

### Webhook (Auto-generate)
```bash
POST /webhook/create-license
Header: x-webhook-secret: your-secret
{
  "buyer_email": "customer@example.com",
  "max_domains": 3
}
```

→ **[Full API Documentation](./docs/api.md)**

---

## 💻 Available Scripts

```bash
npm start          # Start production server
npm run dev        # Start development server (auto-reload)
npm run migrate    # Run database migrations
npm run create-admin  # Create admin user
npm run lint       # Check code quality with ESLint
npm run format     # Format code with Prettier
```

---

## 🔒 Security Features

- ✅ JWT-based admin authentication
- ✅ HTTP-only cookies for session management
- ✅ Bcrypt password hashing (10 rounds)
- ✅ Rate limiting on all endpoints
- ✅ Input validation with Joi
- ✅ SQL injection protection (prepared statements)
- ✅ Webhook secret verification

---

## 📦 Sample Implementation

A complete example integration is available in the [`examples/`](./examples) folder.

```bash
cd examples
npm install
node server.js
```

Visit http://localhost:3005 to see the integration in action.

→ **[Example Documentation](./examples/README.md)**

---

## 🚀 Deployment

Quick deployment to various platforms:

- **[VPS (Ubuntu/Debian)](./docs/deployment.md#vps-deployment)** - Traditional server deployment
- **[Render.com](./docs/deployment.md#rendercom-deployment)** - One-click PaaS deployment
- **[Railway.app](./docs/deployment.md#railwayapp-deployment)** - GitHub integration
- **[DigitalOcean](./docs/deployment.md#digitalocean-app-platform)** - App Platform deployment

→ **[Full Deployment Guide](./docs/deployment.md)**

---

## 🛠️ Technology Stack

- **Backend**: Node.js + Express.js
- **Database**: SQLite3 (easily upgradeable to PostgreSQL)
- **Authentication**: JWT + bcrypt
- **Templating**: EJS
- **UI**: TailwindCSS + Alpine.js
- **Validation**: Joi

---

## 📊 Database Schema

### Tables

- **admin** - Admin user accounts
- **license** - License keys and configurations
- **domain** - Activated domains per license

### Migrations

All database schemas are defined in [`migrations/create_tables.sql`](./migrations/create_tables.sql)

---

## 🐛 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Database locked:**
```bash
# Stop server, delete temporary files
rm database.sqlite-shm database.sqlite-wal
npm start
```

→ **[Full Troubleshooting Guide](./docs/troubleshooting.md)**

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](./CONTRIBUTING.md) before submitting PRs.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](#) file for details.

---

## 👨‍💻 Author

**Devlogor**

---

## 🌟 Version History

### v1.2.0 (Current)
- 📁 Restructured documentation into dedicated `docs/` folder
- 🗂️ Renamed `contoh_implement/` to `examples/`
- 🧹 Improved `.gitignore` with comprehensive rules
- 🔧 Added ESLint and Prettier configurations
- 📝 Added CONTRIBUTING.md
- ⚙️ Added VSCode workspace settings
- 📦 Updated package.json with new scripts

### v1.1.0
- ✅ Fixed critical async/await bugs
- ✅ Domain tracking improvements
- ✅ Updated documentation

### v1.0.0
- 🎉 Initial release

---

## 🔗 Links

- **Documentation**: [docs/](./docs)
- **Examples**: [examples/](./examples)
- **Issues**: [GitHub Issues](https://github.com/your-username/lisensi-key-2/issues)
- **Repository**: [GitHub](https://github.com/your-username/lisensi-key-2)

---

Made with ❤️ using Node.js, Express, and SQLite
