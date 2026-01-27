---
description: Deploy application to production
---

# Deployment Workflow

This workflow guides you through deploying the AI Bookkeeping App to production.

## Pre-deployment Checklist

- [ ] All tests pass
- [ ] Code is reviewed and approved
- [ ] Environment variables are configured in production
- [ ] Database migrations are ready
- [ ] API keys are set up (OpenAI, QuickBooks)
- [ ] Monitoring and logging are configured

## Steps

1. **Run pre-deployment checks**
   ```bash
   npm run pre-deploy
   ```
   This runs all tests, linting, and type checks.

2. **Build production bundle**
   ```bash
   npm run build
   ```

3. **Run database migrations (production)**
   ```bash
   npm run db:migrate:prod
   ```
   ⚠️ **CAUTION**: This affects production database. Ensure migrations are tested.

4. **Deploy to hosting platform**
   - If using Vercel:
     ```bash
     vercel --prod
     ```
   - If using custom server:
     ```bash
     npm run deploy
     ```

5. **Verify deployment**
   - Check application health endpoint: `https://your-domain.com/api/health`
   - Test login flow
   - Verify QuickBooks OAuth works
   - Test a sample transaction categorization
   - Check error monitoring dashboard

6. **Post-deployment monitoring**
   - Monitor server logs for errors
   - Check API response times
   - Verify database connections are stable
   - Monitor OpenAI API usage and costs

## Rollback Plan

If deployment fails:

1. **Revert to previous version**
   ```bash
   npm run rollback
   ```

2. **Check error logs**
   ```bash
   npm run logs:prod
   ```

3. **Notify users** if there's downtime

## Environment Variables (Production)

Ensure these are set in production:
- `NODE_ENV=production`
- `DATABASE_URL` - production database
- `OPENAI_API_KEY` - production key
- `QUICKBOOKS_CLIENT_ID` - production credentials
- `QUICKBOOKS_CLIENT_SECRET` - production credentials
- `JWT_SECRET` - for authentication
- `SMTP_CONFIG` - for email notifications

## Notes

- Always test in staging before production
- Have a rollback plan ready
- Monitor costs (OpenAI, database, hosting)
- Set up alerts for errors and downtime
