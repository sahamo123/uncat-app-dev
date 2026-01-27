---
description: Test QuickBooks Online integration and sync
---

# QuickBooks Sync Workflow

This workflow helps test and debug the QuickBooks Online integration.

## Steps

1. **Verify QuickBooks OAuth setup**
   - Check `QUICKBOOKS_CLIENT_ID` and `QUICKBOOKS_CLIENT_SECRET` in `.env`
   - Ensure redirect URI is configured in Intuit Developer Portal
   - Verify sandbox/production mode is set correctly

// turbo
2. **Test OAuth flow**
   ```bash
   npm run test:qbo-auth
   ```

// turbo
3. **Test connection**
   ```bash
   npm run test:qbo-connection
   ```
   This verifies the app can connect to QuickBooks API.

// turbo
4. **Fetch transactions**
   ```bash
   npm run qbo:fetch-transactions
   ```
   Retrieves recent transactions from QuickBooks.

// turbo
5. **Test sync logic**
   ```bash
   npm run test:qbo-sync
   ```
   Verifies two-way sync between app and QuickBooks.

6. **Manual testing**
   - Log in to the app
   - Connect a QuickBooks sandbox account
   - Verify transactions are imported
   - Categorize a transaction in the app
   - Verify it syncs back to QuickBooks

## Troubleshooting

- **401 Unauthorized**: Check if access token needs refresh
- **Rate limits**: QuickBooks has API rate limits, implement backoff
- **Sandbox data**: Ensure you're using QuickBooks sandbox for testing
- **Webhook delays**: Webhooks may take time to trigger, be patient

## Notes

- Always use QuickBooks sandbox for development
- Keep tokens secure and never commit them
- Implement token refresh logic for production
- Monitor API usage to stay within quotas
