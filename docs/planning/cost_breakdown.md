# Cost Breakdown & Free Tier Strategy

## Executive Summary
**Goal**: Support 90% free users while maintaining sustainable economics.

**Strategy**: Implement usage-based rate limiting + dual OpenAI keys to isolate free tier costs.

---

## Free Tier vs Paid Tier

### Free Tier (Starter Plan - $0/month)
**What's Included:**
- 5 connected clients max
- 50 transactions auto-categorized/month
- 10 documents OCR'd/month
- 1GB storage
- Email support

**Usage Limits** (enforced via Stripe metering + middleware):
- AI Credits: 100/month (1 credit = 1 categorization)
- RAG Searches: 50/month
- Chat messages: 500/month
- Video call minutes: 0 (disabled)

### Pro Plan ($50/month)
- Unlimited clients
- 1000 transactions/month
- 500 documents/month
- 25GB storage
- Priority support
- Video calls enabled

### Enterprise Plan ($200/month)
- Everything unlimited
- White-label domain
- Dedicated support
- Custom integrations

---

## Dual OpenAI Key Architecture

### Problem
Free tier users could rack up $1000s in OpenAI costs if not controlled.

### Solution: Separate API Keys

```typescript
// Environment variables
OPENAI_API_KEY_FREE=sk-free-tier-key...
OPENAI_API_KEY_PREMIUM=sk-premium-key...

// Middleware logic
function getOpenAIClient(tenantId: string) {
  const subscription = await getSubscription(tenantId);
  
  const apiKey = subscription.plan === 'free' 
    ? process.env.OPENAI_API_KEY_FREE
    : process.env.OPENAI_API_KEY_PREMIUM;
  
  return new OpenAI({ apiKey });
}
```

**Benefits:**
1. **Cost Visibility**: See exact spend for free vs paid users in OpenAI dashboard
2. **Rate Limiting**: Set spend limits on free tier key ($100/month cap)
3. **Quality Control**: Can use different models (gpt-3.5-turbo for free, gpt-4 for paid)

---

## Per-User Cost Breakdown

### Free Tier User (Monthly)

| Resource | Usage | Unit Cost | Total |
|----------|-------|-----------|-------|
| **AI Categorization** | 50 txns | $0.002/txn | $0.10 |
| **RAG Embeddings** | 50 searches | $0.0001/search | $0.01 |
| **Database** | 100MB | $0.125/GB | $0.01 |
| **Storage** | 1GB | $0.021/GB | $0.02 |
| **Bandwidth** | 5GB | $0.09/GB | $0.45 |
| **Edge Functions** | 500 invocations | Free tier | $0.00 |
| **Total per Free User** | | | **$0.59/month** |

**Assuming 1000 free users**: $590/month infrastructure cost

---

### Paid Tier User (Monthly - $50/month revenue)

| Resource | Usage | Unit Cost | Total |
|----------|-------|-----------|-------|
| **AI Categorization** | 1000 txns | $0.002/txn | $2.00 |
| **RAG Embeddings** | 500 searches | $0.0001/search | $0.05 |
| **Video/Voice** | 100 min | $0.01/min | $1.00 |
| **Database** | 5GB | $0.125/GB | $0.63 |
| **Storage** | 25GB | $0.021/GB | $0.53 |
| **Bandwidth** | 50GB | $0.09/GB | $4.50 |
| **Total per Paid User** | | | **$8.71/month** |

**Gross Margin**: $50 - $8.71 = **$41.29 (83% margin)** ✅

---

## Projected Costs at Scale

### Scenario 1: 10,000 Total Users (90% Free)
- **Free Users**: 9,000 × $0.59 = **$5,310/month**
- **Paid Users**: 1,000 × $8.71 = **$8,710/month**
- **Total Infrastructure**: **$14,020/month**
- **Revenue** (from paid): 1,000 × $50 = **$50,000/month**
- **Gross Profit**: $50,000 - $14,020 = **$35,980/month**
- **Profit Margin**: 72% ✅

### Scenario 2: 100,000 Total Users (90% Free)
- **Free Users**: 90,000 × $0.59 = **$53,100/month**
- **Paid Users**: 10,000 × $8.71 = **$87,100/month**
- **Total Infrastructure**: **$140,200/month**
- **Revenue** (from paid): 10,000 × $50 = **$500,000/month**
- **Gross Profit**: $500,000 - $140,200 = **$359,800/month**
- **Profit Margin**: 72% ✅

**Conclusion**: Free tier is sustainable at scale!

---

## Cost Optimization Strategies

### 1. Aggressive Caching (Reduce OpenAI calls)
```typescript
// Cache AI categorization results
const cacheKey = `category:${vendor}:${amount}`;
const cached = await redis.get(cacheKey);
if (cached) return cached; // Save $0.002

const result = await openai.categorize(...);
await redis.set(cacheKey, result, { ex: 86400 }); // 24h cache
```

**Savings**: 30-40% reduction in OpenAI costs

### 2. RAG Match Before LLM (Cheaper than AI)
```typescript
// Step 1: Try exact vendor match (free)
const exactMatch = await db.query(`
  SELECT category FROM transactions 
  WHERE vendor = $1 AND tenant_id = $2 
  LIMIT 1
`, [vendor, tenantId]);

if (exactMatch) return exactMatch; // Save $0.002

// Step 2: Try RAG search ($0.0001)
const ragResults = await ragSearch(vendor);
if (ragResults.confidence > 0.9) return ragResults; // Save $0.0019

// Step 3: Call LLM only if needed ($0.002)
return await openai.categorize(...);
```

**Savings**: 50-60% of transactions avoid LLM call

### 3. Use gpt-3.5-turbo for Free Tier
```typescript
const model = subscription.plan === 'free' 
  ? 'gpt-3.5-turbo' // $0.0005/request
  : 'gpt-4o-mini';  // $0.002/request

// 4x cheaper for free users
```

### 4. Batch Processing for Free Tier
```typescript
// Free tier: Process in batches every 24h (cheaper)
// Paid tier: Real-time processing

if (subscription.plan === 'free') {
  await queueForBatchProcessing(transaction);
} else {
  await processImmediately(transaction);
}
```

---

## Updated Environment Variables

### Required for Free Tier Strategy

```env
# OpenAI - Dual Keys
OPENAI_API_KEY_FREE=sk-proj-free-tier...
OPENAI_API_KEY_PREMIUM=sk-proj-premium...

# OpenAI - Spend Limits (set in OpenAI dashboard)
# Free tier key: $100/month hard limit
# Premium key: $10,000/month soft limit
```

---

## Implementation Checklist

- [ ] Create separate OpenAI keys (free vs premium)
- [ ] Update billing spec with usage limits
- [ ] Implement rate limiting middleware
- [ ] Add Redis caching for AI results
- [ ] Implement "RAG first, LLM second" logic
- [ ] Set up OpenAI spend alerts
- [ ] Update Stripe product definitions
- [ ] Add usage dashboard for admins

---

## Monitoring & Alerts

### OpenAI Dashboard
- **Free Tier Key**: Alert at $80 spent (80% of $100 limit)
- **Premium Key**: Alert at $8,000 spent

### Weekly Cost Report
```typescript
// Send email every Monday
const freeSpend = await getOpenAISpend('free-tier-key');
const premiumSpend = await getOpenAISpend('premium-key');
const totalUsers = await getTotalUsers();

console.log(`
  Free Tier: ${freeSpend} / ${totalUsers.free} users = $${freeSpend/totalUsers.free}/user
  Premium: ${premiumSpend} / ${totalUsers.paid} users = $${premiumSpend/totalUsers.paid}/user
`);
```

---

## Conclusion

✅ **Free tier is economically viable**
✅ **Dual-key architecture ensures cost control**
✅ **72% profit margin at 10% conversion rate**
✅ **Scalable to 100K+ users**

**Next Steps**: Implement dual-key architecture in Phase 1 billing module.
