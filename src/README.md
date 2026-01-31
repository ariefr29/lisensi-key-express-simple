# Source Code Overview

This directory contains all the source code for the License Server System.

## Structure

```
src/
├── config/        # Configuration files
├── controllers/   # Business logic and request handlers
├── middlewares/   # Express middlewares
├── models/        # Database models and queries
├── routes/        # API route definitions
├── utils/         # Helper functions and utilities
└── views/         # EJS templates for admin dashboard
```

## Directories

### `config/`
Configuration modules for database connections and JWT authentication.

### `controllers/`
Business logic for handling requests:
- `adminController.js` - Admin dashboard operations
- `licenseController.js` - License activation and validation
- `webhookController.js` - Webhook integrations

### `middlewares/`
Express middleware functions:
- `authAdmin.js` - JWT authentication for admin routes
- `validateRequest.js` - Request validation using Joi

### `models/`
Database models for interacting with SQLite:
- `adminModel.js` - Admin user operations
- `licenseModel.js` - License management
- `domainModel.js` - Domain activation tracking

### `routes/`
Route definitions:
- `adminRoutes.js` - Admin dashboard routes
- `licenseRoutes.js` - Public API routes
- `webhookRoutes.js` - Webhook endpoints

### `utils/`
Utility functions:
- `helpers.js` - Common helper functions

### `views/`
EJS templates for the admin dashboard with a clean, modular structure.

## Code Style

- Use async/await for asynchronous operations
- Follow consistent naming conventions
- Add JSDoc comments for public APIs
- Keep functions small and focused

See [CONTRIBUTING.md](../CONTRIBUTING.md) for detailed guidelines.
