-- ==============================================================================
-- CONSOLIDATED MIGRATION: Reset & Init
-- Purpose: Switch from "Clients" model to "Tenants" model and setup QBO Sync
-- Warning: This DROPS existing tables. Only run on fresh/dev databases.
-- ==============================================================================

-- 1. CLEANUP (Drop old/conflicting tables)
drop table if exists qbo_connections cascade;
drop table if exists transactions cascade;
-- drop table if exists chart_of_accounts cascade; -- In case it exists
drop table if exists clients cascade;
drop table if exists users cascade;
drop table if exists tenants cascade;
drop table if exists user_profiles cascade;
drop table if exists chart_of_accounts cascade;

-- 2. EXTENSIONS
create extension if not exists vector;
create extension if not exists "uuid-ossp";

-- 3. TENANTS (Base table)
create table tenants (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  industry text,
  qbo_realm_id text unique,
  owner_id text, -- Clerk User ID (Added from 03)
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. USER PROFILES
create table user_profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text check (role in ('admin', 'accountant', 'client')),
  tenant_id uuid references tenants(id)
);

-- 5. CHART OF ACCOUNTS
create table chart_of_accounts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) not null,
  qbo_id text not null,
  name text not null,
  classification text,
  account_sub_type text,
  description text,
  embedding vector(1536), 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id, qbo_id)
);

-- 6. TRANSACTIONS
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) not null,
  qbo_id text not null,
  transaction_date date,
  amount numeric(15, 2),
  description text,
  payee_name text,
  assigned_account_id uuid references chart_of_accounts(id),
  ai_suggested_account_id uuid references chart_of_accounts(id),
  ai_confidence_score float,
  ai_reasoning text,
  status text check (status in ('pending', 'approved', 'posted')) default 'pending',
  embedding vector(1536),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id, qbo_id)
);

-- 7. QBO CONNECTIONS (From 03)
create table qbo_connections (
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

-- 8. FUNCTIONS
create or replace function match_transactions (
  query_embedding vector(1536),
  filter_tenant_id uuid,
  match_threshold float,
  match_count int
)
returns table (
  id uuid,
  description text,
  payee_name text,
  assigned_account_id uuid,
  similarity float
)
language plpgsql
as $$
begin
  return query
  select
    transactions.id,
    transactions.description,
    transactions.payee_name,
    transactions.assigned_account_id,
    1 - (transactions.embedding <=> query_embedding) as similarity
  from transactions
  where 1 - (transactions.embedding <=> query_embedding) > match_threshold
  and transactions.tenant_id = filter_tenant_id
  and transactions.assigned_account_id is not null
  order by transactions.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 9. SECURITY (RLS)
alter table tenants enable row level security;
alter table transactions enable row level security;
alter table qbo_connections enable row level security;

-- Simplified RLS for MVP: Users access based on tenant_id
-- (Note: In production, user_profiles needs to be populated via webhook)

create policy "Users can view their own tenant data"
on transactions for select
using (
  auth.uid() in (
    select id from user_profiles where tenant_id = transactions.tenant_id
  )
);

create policy "Users can view their own tenant connections"
on qbo_connections for select
using (
  auth.uid()::text in (
    select owner_id from tenants where id = qbo_connections.tenant_id
  )
);
