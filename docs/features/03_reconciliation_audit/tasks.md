# Reconciliation & Audit Tasks

## Synder-Style Reconciliation
- [ ] Create `reconciliation_batches` table (with tenant_id + RLS)
- [ ] Implement "Clearing Account" logic
- [ ] Build Payout Matcher algorithm
- [ ] Create reconciliation UI

## Booke-Style Audit
- [ ] Create `audit_flags` table (with tenant_id + RLS)
- [ ] Build Inconsistency Scanner (cron job)
- [ ] Implement duplicate detection
- [ ] Implement weekend expense alerts
- [ ] Implement trend anomaly detection

## Month-End Close
- [ ] Create `month_end_close` table (with tenant_id + RLS)
- [ ] Build interactive checklist UI
- [ ] Implement email reminders

## Testing
- [ ] Test clearing account balancing
- [ ] Test anomaly detection accuracy
- [ ] Verify RLS on reconciliation tables
