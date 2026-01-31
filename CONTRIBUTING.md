# Contributing to License Server System

Thank you for considering contributing to this project! 🎉

## Code of Conduct

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Keep discussions professional

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in Issues
2. If not, create a new issue with:
   - Clear, descriptive title
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (Node version, OS, etc.)
   - Error messages and stack traces

### Suggesting Features

1. Search existing issues to avoid duplicates
2. Create a new issue describing:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Examples of how it would work

### Pull Requests

#### Before Starting

1. **Fork the repository**
2. **Create a branch** from `develop`:
   ```bash
   git checkout -b feature/your-feature-name
   ```

#### Development Process

1. **Setup development environment**:
   ```bash
   npm install
   npm run migrate
   npm run create-admin
   ```

2. **Make your changes**:
   - Write clean, readable code
   - Follow existing code style
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**:
   - Test manually in development
   - Verify no regressions
   - Test with sample app if relevant

4. **Commit your changes**:
   ```bash
   git commit -m "feat: add awesome feature"
   ```

   Use conventional commit format:
   - `feat:` New feature
   - `fix:` Bug fix
   - `docs:` Documentation only
   - `style:` Code formatting
   - `refactor:` Code restructure
   - `test:` Adding tests
   - `chore:` Maintenance tasks

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create Pull Request**:
   - Provide clear description of changes
   - Reference related issues
   - Include screenshots if UI changes
   - List breaking changes if any

#### Code Review Process

1. Maintainer will review your PR
2. Address any requested changes
3. Once approved, it will be merged
4. Your contribution will be acknowledged!

## Development Guidelines

### Code Style

- Use **async/await** instead of callbacks
- Use **const** and **let**, avoid **var**
- Use meaningful variable names
- Keep functions small and focused
- Add JSDoc comments for public APIs

Example:
```javascript
/**
 * Activate a license for a specific domain
 * @param {string} licenseKey - The license key to activate
 * @param {string} domain - The domain to bind to
 * @returns {Promise<Object>} Activation result
 */
async function activateLicense(licenseKey, domain) {
    // Implementation
}
```

### File Organization

- Place controllers in `src/controllers/`
- Place models in `src/models/`
- Place routes in `src/routes/`
- Place utilities in `src/utils/`
- Place views in `src/views/`

### Database Changes

If your contribution requires database changes:

1. Create migration SQL in `migrations/`
2. Update `migrations/run.js`
3. Document the changes in PR description
4. Test migration on fresh database

### Documentation

Update documentation when:
- Adding new features
- Changing API endpoints
- Modifying configuration
- Updating deployment process

Affected files:
- `README.md` - Quick start and overview
- `docs/api.md` - API changes
- `docs/development.md` - Development setup
- `docs/deployment.md` - Deployment changes

## Testing Guidelines

Currently, we rely on manual testing. When testing:

1. **Server Startup**: Ensure server starts without errors
2. **Authentication**: Test login/logout
3. **License CRUD**: Test create, read, update, delete
4. **API Endpoints**: Test all endpoints
5. **Sample App**: Verify example integration works
6. **Edge Cases**: Test error scenarios

Future: We plan to add automated testing with Jest.

## Need Help?

- **Questions**: Create a GitHub issue with "Question:" prefix
- **Discussion**: Use GitHub Discussions
- **Chat**: Join our Discord (if available)

## Recognition

Contributors will be:
- Listed in CHANGELOG.md
- Mentioned in release notes
- Added to CONTRIBUTORS.md (coming soon)

---

Thank you for contributing! 🚀
