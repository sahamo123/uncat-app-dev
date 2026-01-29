# INCIDENT-007: Vercel Build Failure - Clerk publishableKey

## Metadata

| Field | Value |
|-------|-------|
| **ID** | INC-007 |
| **Date Reported** | 2026-01-29 |
| **Date Resolved** | 2026-01-29 |
| **Duration** | ~20 minutes |
| **Severity** | 🔴 Critical |
| **Component** | Vercel / Clerk / Environment Variables |
| **Status** | ✅ Resolved |

---

## Symptom

Vercel build failed during static page generation:

```
Error: @clerk/clerk-react: Missing publishableKey. You can get your key at https://dashboard.clerk.com/last-active?path=api-keys
Error occurred prerendering page "/_not-found"
Export encountered an error on /_not-found/page: /_not-found, exiting the build.
```

---

## Impact

- Vercel deployment blocked
- All static pages failed to generate

---

## Root Cause Analysis

### Primary Cause
`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` was not set in Vercel's environment variables.

Unlike server-only env vars (which can use lazy initialization), `NEXT_PUBLIC_*` variables are embedded at **build time** and must be present during the build process.

### Contributing Factors
- Env vars were only set for Production, not Preview
- Feature branch deployments go to Preview environment

### Why It Wasn't Caught Earlier
- Local build had `.env.local` with the key
- Previous builds didn't reach this stage (blocked by Stripe issue)

---

## Resolution

### Steps Taken
1. Added `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` to Vercel Dashboard
2. Scoped to **both** Production AND Preview environments
3. Also verified `CLERK_SECRET_KEY` was present
4. Redeployed

### Fixing Commit/PR
- No code change required
- Environment variable configuration in Vercel Dashboard

---

## Prevention

- [x] Document all required env vars in deployment checklist
- [x] Verify env vars for BOTH Production AND Preview scopes
- [x] `NEXT_PUBLIC_*` vars must be present at build time (cannot lazily load)
- [ ] Add env var validation script to CI/CD

---

## Lessons Learned

| Variable Type | When Available | Can Lazy Load? |
|--------------|----------------|----------------|
| `NEXT_PUBLIC_*` | Build time | ❌ No |
| Server-only | Runtime | ✅ Yes |

---

## Keywords for Search
`vercel`, `clerk`, `publishableKey`, `NEXT_PUBLIC`, `build-failure`, `static-generation`, `env-var`
