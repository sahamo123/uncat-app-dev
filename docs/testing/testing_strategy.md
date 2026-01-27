# Testing Strategy - Simplified for Non-Technical Founders

## The Simple Answer

**You DON'T need separate keys for most services.** Here's the smart way:

---

## 3-Environment Strategy (Simplified)

### 1. **Local Development** (Your Computer)
**Where:** `localhost:3000`
**Uses:** `.env.local` with **Sandbox keys**
**Testing:** You test features here before anything goes live

### 2. **Preview Deployments** (Vercel)
**Where:** `daxhive-git-feature-xyz.vercel.app`
**Uses:** Same keys as production (safe because it's private)
**Testing:** Share link with team/beta users for feedback

### 3. **Production** (Live)
**Where:** `app.daxhive.com`
**Uses:** Production keys
**Testing:** Real customers use this

---

## Which Services Need Separate Keys?

| Service | Need Separate Keys? | Why |
|---------|-------------------|-----|
| **QuickBooks** | ✅ YES (Sandbox vs Production) | QBO provides FREE Sandbox for testing |
| **OpenAI** | ❌ NO (same key) | Usage-based billing, just costs a few cents in testing |
| **Supabase** | ❌ NO (same project) | Use same DB, just use RLS to protect data |
| **Stripe** | ✅ YES (Test Mode built-in) | Stripe has built-in "Test Mode" toggle |
| **Clerk** | ❌ NO (same keys) | Same auth for preview & production |

**Result:** You only maintain **2** sets of keys:
1. QuickBooks Sandbox (testing)
2. QuickBooks Production (live)

Everything else uses the same keys! ✅

---

## Your Testing Workflow

### Step 1: Build Feature Locally
```bash
# Start local development server
npm run dev
# Opens at http://localhost:3000
```

**What you test:**
- Does the button work?
- Does the form submit correctly?
- Does AI categorization run?

**Uses:**
- `.env.local` (your local secrets)
- QuickBooks **Sandbox** (fake company data)
- Real Supabase (with test tenant)

### Step 2: Preview Deployment (Share with Team)
```bash
# Create a feature branch
git checkout -b feature/add-reconciliation

# Make changes, commit, push
git add .
git commit -m "Added reconciliation"
git push
```

**What happens:**
- Vercel auto-creates: `daxhive-git-feature-add-reconciliation.vercel.app`
- You share this URL with your team
- They test without affecting production

**Uses:**
- Production keys (safe because URL is private)
- Still points to QuickBooks Sandbox initially

### Step 3: Merge to Production
```bash
# Merge to main branch
git checkout main
git merge feature/add-reconciliation
git push
```

**What happens:**
- Vercel auto-deploys to `app.daxhive.com`
- Now uses QuickBooks **Production** keys
- Real customers can use it

---

## QuickBooks Sandbox vs Production

### Why This is Easy
QuickBooks gives you **FREE unlimited Sandbox companies** for testing.

| Environment | QBO Environment | Data |
|-------------|----------------|------|
| **Local Dev** | Sandbox | Fake Company "Test Corp" |
| **Preview** | Sandbox | Same fake company |
| **Production** | Production | Real client companies |

**How to Switch:**
```env
# .env.local (Development/Preview)
QBO_ENVIRONMENT=sandbox
QBO_CLIENT_ID=your-sandbox-client-id
QBO_CLIENT_SECRET=your-sandbox-secret

# Vercel Production Environment Variables
QBO_ENVIRONMENT=production
QBO_CLIENT_ID=your-production-client-id
QBO_CLIENT_SECRET=your-production-secret
```

Your code automatically uses the right one:
```typescript
const qboBaseUrl = process.env.QBO_ENVIRONMENT === 'sandbox' 
  ? 'https://sandbox-quickbooks.api.intuit.com' 
  : 'https://quickbooks.api.intuit.com';
```

---

## Stripe Testing (Built-In Test Mode)

Stripe is even easier - it has a **"Test Mode" toggle** in the dashboard.

**No separate keys needed!** Just flip the toggle:
- Test Mode: Use test card `4242 4242 4242 4242`
- Live Mode: Real credit cards

---

## The Realistic Daily Workflow

### Monday Morning - Building a Feature
1. **You:** "I want to add a 'Month-End Close' checklist"
2. **I generate:** Code for the feature
3. **You:** Paste into Antigravity IDE, save files
4. **You:** Run `npm run dev` to test locally
5. **You see:** Feature working at `localhost:3000`

### Monday Afternoon - Testing with Team
6. **You:** `git push` to GitHub
7. **Vercel:** Auto-creates preview: `daxhive-git-month-end.vercel.app`
8. **You:** Share link with your accountant to test
9. **Feedback:** "Looks good, let's ship it!"

### Tuesday - Going Live
10. **You:** `git merge` to main branch
11. **Vercel:** Auto-deploys to production
12. **Customers:** See new feature

**Total key management:** Just 2 sets (QBO Sandbox + Production). Done! ✅

---

## When You Should Create Separate Keys

**Only if:**
- You're processing real money (Stripe already handles this)
- You're touching real financial data (QuickBooks already handles this)

**For OpenAI, Clerk, Supabase:**
- Same keys everywhere is fine
- The cost of a few test API calls is negligible ($0.01)

---

## Best Practice for You

**Use this setup:**

```
.env.local (Your Computer)
├─ OPENAI_API_KEY=sk-...  (production key, fine for dev)
├─ QBO_ENVIRONMENT=sandbox ✅ (use fake data)
├─ STRIPE_PUBLISHABLE_KEY=pk_test_... ✅ (test mode)
└─ SUPABASE_URL=... (production project, but you create a "Test Tenant")

Vercel Preview (Auto-deployed branches)
├─ Same as .env.local ✅

Vercel Production (Main branch)
├─ OPENAI_API_KEY=sk-... (same)
├─ QBO_ENVIRONMENT=production ✅ (real data now)
├─ STRIPE_PUBLISHABLE_KEY=pk_live_... ✅ (live mode)
└─ SUPABASE_URL=... (same)
```

**Just 2 differences in production:**
1. `QBO_ENVIRONMENT=production` (instead of sandbox)
2. `STRIPE_PUBLISHABLE_KEY=pk_live_...` (instead of test)

---

## Summary: Your Testing Checklist

- [ ] Test locally with `npm run dev`
- [ ] Push to GitHub (Vercel creates preview URL)
- [ ] Share preview URL with team/beta testers
- [ ] Merge to main → Auto-deploys to production
- [ ] Use QuickBooks Sandbox for all testing
- [ ] Use Stripe Test Mode for payment testing

**No complex key juggling.** Just 2 environments (Sandbox vs Live) where it matters. 🚀
