-- Enable the pgvector extension to work with embedding vectors
create extension if not exists vector;

-- Use this to generate UUIDs
create extension if not exists "uuid-ossp";

-- 1. TENANTS (Individual Companies/Clients)
create table tenants (
  id uuid primary key default uuid_generate_v4(),
  business_name text not null,
  industry text,
  qbo_realm_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. USERS (Accountants/Staff)
-- Note: specific auth handling is managed by Supabase Auth, this is for app-specific profiles
create table user_profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  role text check (role in ('admin', 'accountant', 'client')),
  tenant_id uuid references tenants(id) -- if a user belongs to a specific tenant
);

-- 3. CHART OF ACCOUNTS (Synced from QBO)
create table chart_of_accounts (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) not null,
  qbo_id text not null,
  name text not null,
  classification text, -- Asset, Liability, Equity, Income, Expense
  account_sub_type text,
  description text,
  -- We store an embedding of the name + description for AI matching
  embedding vector(1536), 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id, qbo_id) -- ensure no duplicates per tenant
);

-- 4. TRANSACTIONS (Synced from QBO)
create table transactions (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid references tenants(id) not null,
  qbo_id text not null,
  transaction_date date,
  amount numeric(15, 2),
  description text, -- Memo or description from bank
  payee_name text, -- Vendor/Customer
  
  -- The core logic: Categorization
  assigned_account_id uuid references chart_of_accounts(id),
  ai_suggested_account_id uuid references chart_of_accounts(id),
  ai_confidence_score float,
  ai_reasoning text,
  status text check (status in ('pending', 'approved', 'posted')) default 'pending',
  
  -- Embedding of the transaction description + payee for finding similar past txns
  embedding vector(1536),
  
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(tenant_id, qbo_id)
);

-- 5. SIMILARITY SEARCH FUNCTION (The "RAG" Magic)
-- You call this function to find past transactions similar to a new one
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
    1 - (transactions.embedding <=> query_embedding) as similarity -- cosine similarity
  from transactions
  where 1 - (transactions.embedding <=> query_embedding) > match_threshold
  and transactions.tenant_id = filter_tenant_id
  and transactions.assigned_account_id is not null -- only learn from categorized ones
  order by transactions.embedding <=> query_embedding
  limit match_count;
end;
$$;

-- 6. RLS Policies (Security)
-- Enable Row Level Security
alter table tenants enable row level security;
alter table transactions enable row level security;

-- Simple policy: Users can see data for their assigned tenant (Simplified for MVP)
-- In production, you would check the user_profiles table
create policy "Users can view their own tenant data"
on transactions for select
using (
  auth.uid() in (
    select id from user_profiles where tenant_id = transactions.tenant_id
  )
);
