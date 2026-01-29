# INCIDENT-001: Middleware Deprecation Warning

## Metadata

| Field | Value |
|-------|-------|
| **ID** | INC-001 |
| **Date Reported** | 2026-01-29 |
| **Date Resolved** | 2026-01-29 |
| **Duration** | ~10 minutes |
| **Severity** | 🟡 Major |
| **Component** | Next.js / Vercel |
| **Status** | ✅ Resolved |

---

## Symptom

Build warning during Vercel deployment:

```
⚠ The "middleware" file convention is deprecated. Please use "proxy" instead.
Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
```

---

## Impact

- Build completed with warning
- Potential future breakage when Next.js removes middleware support
- Documentation and code out of sync with framework conventions

---

## Root Cause Analysis

### Primary Cause
Next.js 16 deprecated the `middleware.ts` naming convention in favor of `proxy.ts`. The codebase was using the old convention.

### Why It Wasn't Caught Earlier
- Local development still worked
- Warning was not blocking

---

## Resolution

### Steps Taken
1. Renamed `middleware.ts` to `proxy.ts`
2. Verified no import changes needed (file is auto-detected)
3. Ran build to confirm warning resolved

### Fixing Commit/PR
- **Commit**: Part of dependency standardization commit
- **Date Merged**: 2026-01-29

---

## Prevention

- [x] Monitor Next.js release notes for deprecations
- [x] Update documentation to reference `proxy.ts`
- [ ] Add deprecation check to CI/CD

---

## Keywords for Search
`middleware`, `proxy`, `next-16`, `deprecation`, `build-warning`
