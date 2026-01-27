# Billing & Subscription Tasks

## Stripe Setup
- [ ] Create Stripe account
- [ ] Define Products (Starter, Pro, Enterprise)
- [ ] Create Price objects (monthly recurring)
- [ ] Create Metered products (add-ons)

## Database
- [ ] Create `subscription_plans` table
- [ ] Create `tenant_subscriptions` table (with tenant_id + RLS)
- [ ] Create `usage_logs` table (with tenant_id + RLS)
- [ ] Add indexes on `tenant_id`

## Integration
- [ ] Build Stripe Checkout flow
- [ ] Implement webhook receiver (/api/webhooks/stripe)
- [ ] Sync subscription status to Supabase
- [ ] Build Customer Portal link

## Rate Limiting
- [ ] Implement rate limit middleware
- [ ] Define limits per tier
- [ ] Build usage dashboard for admins

## Testing
- [ ] Test subscription creation
- [ ] Test webhook processing
- [ ] Test rate limiting enforcement
- [ ] Verify RLS on billing tables
