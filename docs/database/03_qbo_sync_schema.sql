-- 1. QBO CONNECTIONS (Stores tokens securely)
create table if not exists qbo_connections (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) not null,
  realm_id text not null,
  access_token text not null,
  refresh_token text not null,
  access_token_expires_at timestamp with time zone,
  refresh_token_expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id)
);

-- 2. Add owner/accountant link to tenants if missing
alter table tenants add column if not exists owner_id text; -- Clerk User ID

-- 3. RLS for connections
alter table qbo_connections enable row level security;

-- Only the system (service role) should really be accessing tokens directly in most cases,
-- but the owner should be able to manage the connection status.
create policy "Users can view their own tenant connections"
on qbo_connections for select
using (
  auth.uid()::text in (
    select owner_id from tenants where id = qbo_connections.tenant_id
  )
);
