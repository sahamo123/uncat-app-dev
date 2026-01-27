---
description: Set up local development environment
---

# Development Setup Workflow

This workflow sets up the local development environment for the AI Bookkeeping App.

## Steps

1. **Verify Node.js installation**
   ```bash
   node --version
   npm --version
   ```
   Ensure Node.js 18+ and npm are installed.

// turbo
2. **Install dependencies**
   ```bash
   npm install
   ```

// turbo
3. **Set up environment variables**
   - Copy `.env.example` to `.env`
   - Fill in required API keys:
     - `OPENAI_API_KEY` - for AI features
     - `QUICKBOOKS_CLIENT_ID` - for QuickBooks integration
     - `QUICKBOOKS_CLIENT_SECRET` - for QuickBooks integration
     - `DATABASE_URL` - PostgreSQL connection string

// turbo
4. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

// turbo
5. **Start development server**
   ```bash
   npm run dev
   ```
   The app should be accessible at http://localhost:3000

## Verification

- Check that the app loads without errors
- Verify database connection is working
- Test that environment variables are loaded correctly
