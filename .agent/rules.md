# Project Rules for AI Bookkeeping App

## Code Style and Structure

1. **TypeScript First**: All new code must be written in TypeScript with strict mode enabled
2. **Component Structure**: Follow atomic design principles (atoms → molecules → organisms → templates → pages)
3. **File Naming**: 
   - Components: PascalCase (`TransactionList.tsx`)
   - Utils/Services: camelCase (`apiClient.ts`)
   - Constants: UPPER_SNAKE_CASE (`API_ENDPOINTS.ts`)
4. **No Magic Numbers**: Extract all hardcoded values to constants
5. **Error Handling**: Always handle errors gracefully with user-friendly messages

## Architecture Rules

1. **Hybrid RAG Only**: Use vector database + OpenAI for categorization. ML models are not implemented yet but architecture should allow for future integration
2. **Separation of Concerns**: Keep business logic separate from UI components
3. **API First**: All data access goes through API layer, never direct database calls from frontend
4. **Multi-tenant Ready**: All database queries must filter by tenant ID
5. **Security First**: Never expose API keys or secrets in frontend code

## Design System

1. **Follow Booke.ai Inspiration**: Reference design_inspiration.md for UI patterns
2. **Consistent Spacing**: Use 4px grid system (4, 8, 16, 24, 32, 48, 64)
3. **Color Palette**: Use design tokens from `globals.css`
4. **Responsive Design**: Mobile-first approach, test on all breakpoints
5. **Accessibility**: All interactive elements must be keyboard accessible and have proper ARIA labels

## QuickBooks Integration

1. **OAuth Only**: Always use OAuth 2.0 for QuickBooks authentication
2. **Sandbox for Dev**: Use QuickBooks sandbox environment for all development
3. **Token Refresh**: Implement automatic token refresh before expiration
4. **Webhook Verification**: Always verify webhook signatures from QuickBooks
5. **Rate Limiting**: Implement exponential backoff for API rate limits

## AI/RAG Implementation

1. **Vector Search First**: Always query vector database for similar transactions before calling OpenAI
2. **Context Window**: Limit context to top 5 similar transactions to manage token costs
3. **Confidence Scores**: Always return confidence scores with AI suggestions
4. **Fallback Logic**: Have deterministic fallback when AI confidence is low
5. **Cost Monitoring**: Log all OpenAI API calls for cost tracking

## Testing

1. **Test Before Merge**: All PRs must have passing tests
2. **Coverage Target**: Maintain >80% code coverage
3. **Integration Tests**: Test all QuickBooks integration points
4. **E2E for Critical Flows**: Login, transaction sync, and categorization must have E2E tests
5. **Mock External APIs**: Use mocks for OpenAI and QuickBooks in unit tests

## Database

1. **Migrations Only**: Never alter database schema directly, use migrations
2. **Indexes**: Add indexes for all frequently queried columns
3. **Soft Deletes**: Use soft deletes for transaction data (audit trail)
4. **Tenant Isolation**: Enforce row-level security for multi-tenancy
5. **Backup Strategy**: Automated daily backups with point-in-time recovery

## Performance

1. **Code Splitting**: Lazy load routes and heavy components
2. **Image Optimization**: Compress and use modern formats (WebP, AVIF)
3. **Caching**: Implement caching for vector search results (24-hour TTL)
4. **Database Queries**: Optimize N+1 queries, use batch loading
5. **Bundle Size**: Keep initial bundle under 200KB gzipped

## Security

1. **Input Validation**: Validate and sanitize all user inputs
2. **SQL Injection**: Use parameterized queries only
3. **XSS Protection**: Escape all user-generated content
4. **CSRF Tokens**: Implement CSRF protection for state-changing operations
5. **Secrets Management**: Use environment variables, never hardcode secrets

## Git Workflow

1. **Feature Branches**: Create feature branches from `main`
2. **Commit Messages**: Use conventional commits (feat:, fix:, docs:, etc.)
3. **Small PRs**: Keep PRs focused and under 400 lines when possible
4. **Code Review**: All code must be reviewed before merge
5. **No Direct Commits**: Never commit directly to `main`

## Documentation

1. **Code Comments**: Document complex logic and business rules
2. **API Documentation**: Keep OpenAPI/Swagger docs up to date
3. **README Updates**: Update README when adding new features
4. **Architecture Decisions**: Document major decisions in ADRs (Architecture Decision Records)
5. **Component Props**: Document all component props with JSDoc

## Monitoring and Logging

1. **Structured Logging**: Use structured JSON logs for easy searching
2. **Error Tracking**: Send all errors to monitoring service
3. **Performance Metrics**: Track API response times and categorization accuracy
4. **User Analytics**: Track feature usage (with consent)
5. **Cost Monitoring**: Monitor OpenAI and infrastructure costs daily

## Environment Management

1. **Environment Parity**: Keep dev, staging, and production as similar as possible
2. **Config Files**: Never commit `.env` files
3. **Secrets Rotation**: Rotate API keys and secrets quarterly
4. **Environment Documentation**: Document all required environment variables
5. **Local Development**: Should work out of the box with `npm install && npm run dev`
