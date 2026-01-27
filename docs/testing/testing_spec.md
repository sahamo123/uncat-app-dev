# Testing Specification: Security & Compliance

## 1. Tenant Isolation Tests (CRITICAL)

### Automated Regression: "Tenant A Cannot Read Tenant B"

```typescript
// Test Suite: Tenant Isolation
describe('Tenant Isolation - RLS Enforcement', () => {
  let tenantA: Tenant;
  let tenantB: Tenant;
  let userA: User;
  let userB: User;
  
  beforeAll(async () => {
    // Create two separate tenants
    tenantA = await createTenant({ name: 'Acme Corp' });
    tenantB = await createTenant({ name: 'Beta LLC' });
    
    // Create users for each tenant
    userA = await createUser({ email: 'alice@acme.com', tenant_id: tenantA.id });
    userB = await createUser({ email: 'bob@beta.com', tenant_id: tenantB.id });
  });
  
  // Test 1: Transactions Module
  test('Tenant A cannot query Tenant B transactions', async () => {
    // Create transaction for Tenant B
    const txnB = await createTransaction({ tenant_id: tenantB.id, amount: 100 });
    
    // Attempt to query as Tenant A user
    const client = await getAuthenticatedClient(userA);
    const result = await client.from('transactions').select('*').eq('id', txnB.id);
    
    expect(result.data).toHaveLength(0); // Should return empty
    expect(result.error).toBeNull(); // No error, just filtered by RLS
  });
  
  // Test 2: Documents Module
  test('Tenant A cannot access Tenant B documents', async () => {
    const docB = await createDocument({ tenant_id: tenantB.id, filename: 'secret.pdf' });
    
    const client = await getAuthenticatedClient(userA);
    const result = await client.from('documents').select('*').eq('id', docB.id);
    
    expect(result.data).toHaveLength(0);
  });
  
  // Test 3: File Storage
  test('Tenant A cannot download Tenant B files', async () => {
    const filePathB = `${tenantB.id}/receipts/invoice.pdf`;
    
    const client = await getAuthenticatedClient(userA);
    const { data, error } = await client.storage.from('documents').download(filePathB);
    
    expect(error).not.toBeNull(); // Should fail
    expect(error.message).toContain('access denied');
  });
  
  // Test 4: Communication Rooms
  test('Tenant A cannot join Tenant B chat rooms', async () => {
    const roomB = await createChatRoom({ tenant_id: tenantB.id });
    
    const client = await getAuthenticatedClient(userA);
    const result = await client.from('communication_rooms').select('*').eq('id', roomB.id);
    
    expect(result.data).toHaveLength(0);
  });
});
```

## 2. RLS Policy Validation

### Test Matrix: Every Table MUST Have RLS

```typescript
// Auto-generated test for all tables
const TABLES_REQUIRING_RLS = [
  'tenants',
  'user_profiles',
  'transactions',
  'documents',
  'file_nodes',
  'communication_rooms',
  'chat_messages',
  'subscription_plans',
  'tenant_subscriptions',
  'reconciliation_batches',
  'audit_flags',
  // Add every table here
];

test('All tables have RLS enabled', async () => {
  const { data } = await adminClient.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename NOT IN (
      SELECT tablename 
      FROM pg_tables t
      JOIN pg_class c ON c.relname = t.tablename
      WHERE c.relrowsecurity = true
    )
  `);
  
  expect(data).toHaveLength(0); // No tables without RLS
});

test('All tables have tenant_id column', async () => {
  for (const table of TABLES_REQUIRING_RLS) {
    if (table === 'tenants') continue; // Exception
    
    const { data } = await adminClient.query(`
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name = '${table}' 
      AND column_name = 'tenant_id'
    `);
    
    expect(data).toHaveLength(1, `${table} missing tenant_id column`);
  }
});
```

## 3. Performance Tests

### Load Testing: Concurrent Tenant Queries

```typescript
test('Database handles 1000 concurrent tenant queries', async () => {
  const tenants = Array.from({ length: 100 }, (_, i) => ({ id: uuid(), name: `Tenant ${i}` }));
  
  const startTime = Date.now();
  
  // Simulate 1000 concurrent requests across tenants
  const promises = Array.from({ length: 1000 }, async (_, i) => {
    const tenant = tenants[i % 100];
    return await queryTransactions(tenant.id);
  });
  
  await Promise.all(promises);
  
  const duration = Date.now() - startTime;
  expect(duration).toBeLessThan(5000); // Should complete in <5s
});
```

### Index Effectiveness Test

```typescript
test('All tenant_id columns are indexed', async () => {
  for (const table of TABLES_REQUIRING_RLS) {
    if (table === 'tenants') continue;
    
    const { data } = await adminClient.query(`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = '${table}' 
      AND indexdef LIKE '%tenant_id%'
    `);
    
    expect(data.length).toBeGreaterThan(0, `${table} missing tenant_id index`);
  }
});
```

## 4. Compliance Tests (SOC2)

### Audit Trail Verification

```typescript
test('All mutations are logged to audit_log', async () => {
  const beforeCount = await getAuditLogCount();
  
  // Perform a mutation
  await createTransaction({ tenant_id: tenantA.id, amount: 50 });
  
  const afterCount = await getAuditLogCount();
  expect(afterCount).toBe(beforeCount + 1);
  
  // Verify log entry
  const latestLog = await getLatestAuditLog();
  expect(latestLog.action).toBe('create');
  expect(latestLog.resource_type).toBe('transaction');
});
```

## 5. CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Security & Compliance Tests

on: [push, pull_request]

jobs:
  tenant-isolation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Run Tenant Isolation Tests
        run: npm test -- --testPathPattern=tenant-isolation
      
  rls-validation:
    runs-on: ubuntu-latest
    steps:
      - name: Validate RLS on all tables
        run: npm test -- --testPathPattern=rls-validation
```

## 6. Test Coverage Requirements

- **Tenant Isolation**: 100% (Every module must pass)
- **RLS Policies**: 100% (All tables validated)
- **Performance**: >95% (Under load)
- **Audit Trail**: 100% (All mutations logged)
