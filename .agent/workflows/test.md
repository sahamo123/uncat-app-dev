---
description: Run tests and verify code quality
---

# Testing Workflow

This workflow runs all tests and code quality checks before committing code.

## Steps

// turbo
1. **Run unit tests**
   ```bash
   npm test
   ```

// turbo
2. **Run integration tests**
   ```bash
   npm run test:integration
   ```

// turbo
3. **Check code formatting**
   ```bash
   npm run format:check
   ```

// turbo
4. **Run linter**
   ```bash
   npm run lint
   ```

// turbo
5. **Type check**
   ```bash
   npm run type-check
   ```

// turbo
6. **Run all checks (comprehensive)**
   ```bash
   npm run ci:check
   ```

## Guidelines

- All tests should pass before committing
- Fix any linting or formatting issues
- Ensure type safety is maintained
- Add tests for new features
