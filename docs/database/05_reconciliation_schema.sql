-- Reconciliation Rules for Clearing Accounts
-- Maps keywords in payee/description to a specific Clearing Account (Asset)
create table reconciliation_rules (
    id uuid primary key default uuid_generate_v4(),
    tenant_id uuid references tenants(id) not null,
    
    -- The Keyword to look for (e.g., "Stripe", "Shopify", "Square")
    keyword text not null,
    
    -- Where money should be transferred FROM (for deposits) or TO (for fees)
    -- Usually a "Bank" or "Other Current Asset" account in QBO
    target_account_id uuid references chart_of_accounts(id) not null,
    
    -- Logic type: 'transfer' is the most common for clearing accounts
    match_type text check (match_type in ('transfer', 'category')) default 'transfer',
    
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(tenant_id, keyword)
);

alter table reconciliation_rules enable row level security;

create policy "Users can view their own reconciliation rules"
on reconciliation_rules for select
using (
  auth.uid()::text in (
    select owner_id from tenants where id = reconciliation_rules.tenant_id
  )
);

create policy "Users can manage their own reconciliation rules"
on reconciliation_rules for all
using (
  auth.uid()::text in (
    select owner_id from tenants where id = reconciliation_rules.tenant_id
  )
);
