# Core Platform Tasks

## Setup
- [ ] Create Supabase project
- [ ] Enable required extensions (uuid-ossp, pgcrypto, vector)

## Database Schema
- [ ] Run `01_core_schema.sql`
- [ ] Verify all tables have RLS enabled
- [ ] Verify all tables have `tenant_id` column
- [ ] Create indexes on `tenant_id` for all tables

## Authentication & Authorization
- [ ] Configure Clerk multi-tenant mode
- [ ] Implement Clerk webhook for user sync
- [ ] Build auth middleware (Next.js)
- [ ] Implement `auth.user_tenant_ids()` function

## Security & Testing
- [ ] Write tenant isolation tests
- [ ] Write RLS validation tests
- [ ] Implement audit logging
- [ ] Configure CI/CD for security tests

## Performance
- [ ] Implement Edge caching for tenant lookups
- [ ] Configure connection pooling
- [ ] Run load tests (1000 concurrent queries)
