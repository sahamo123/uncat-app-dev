# INCIDENT-006: Vercel Build Failure - Missing STRIPE_SECRET_KEY

## Metadata

| Field | Value |
|-------|-------|
| **ID** | INC-006 |
| **Date Reported** | 2026-01-29 |
| **Date Resolved** | 2026-01-29 |
| **Duration** | ~30 minutes |
| **Severity** | 🔴 Critical |
| **Component** | Vercel / Stripe / Environment Variables |
| **Status** | ✅ Resolved |

---

## Symptom

Vercel build failed with environment variable error:

```
Error: STRIPE_SECRET_KEY is missing. Please set it in your .env.local file.
Error: Failed to collect page data for /api/stripe/checkout
Command "npm run build" exited with 1
```

---

## Impact

- Vercel deployment blocked
- No production build possible

---

## Root Cause Analysis

### Primary Cause
`lib/stripe.ts` threw an error at **module load time** if `STRIPE_SECRET_KEY` was not set:

```typescript
// BAD: Throws at module load
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is missing');
}
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
```

During Vercel's build phase, environment variables marked as "Server" are not available. Only `NEXT_PUBLIC_*` variables are present at build time.

### Why It Wasn't Caught Earlier
- Local builds have `.env.local` with all variables
- Vercel build environment differs from local

---

## Resolution

### Steps Taken
1. Refactored `lib/stripe.ts` to use **lazy initialization**
2. Created `getStripe()` function that checks env vars at runtime
3. Updated all imports to use `getStripe()` instead of `stripe`
4. Verified local build: `npm run build` (Success)

### Code Changes
```diff
# lib/stripe.ts
- if (!process.env.STRIPE_SECRET_KEY) {
-   throw new Error('STRIPE_SECRET_KEY is missing');
- }
- export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

+ let _stripe: Stripe | null = null;
+ 
+ export const getStripe = (): Stripe => {
+     if (!_stripe) {
+         if (!process.env.STRIPE_SECRET_KEY) {
+             throw new Error('STRIPE_SECRET_KEY is missing');
+         }
+         _stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
+             apiVersion: '2025-12-15.clover',
+             typescript: true,
+         });
+     }
+     return _stripe;
+ };
```

### Fixing Commit/PR
- **Commit**: Stripe lazy initialization commit
- **Date Merged**: 2026-01-29

---

## Prevention

- [x] Use lazy initialization for env-dependent modules
- [x] Never throw at module load time for server env vars
- [x] Document pattern in coding standards
- [ ] Add build-time validation that catches early throws

---

## Keywords for Search
`vercel`, `stripe`, `build-failure`, `lazy-initialization`, `getStripe`, `STRIPE_SECRET_KEY`, `env-var`
