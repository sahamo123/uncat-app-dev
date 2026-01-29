# INCIDENT-008: Vercel 404 NOT_FOUND - Framework Detection Failure

## Metadata

| Field | Value |
|-------|-------|
| **ID** | INC-008 |
| **Date Reported** | 2026-01-27 |
| **Date Resolved** | 2026-01-29 |
| **Duration** | ~3 days |
| **Severity** | 🔴 Critical |
| **Component** | Vercel / Framework Detection / Build Pipeline |
| **Status** | ✅ Resolved |

---

## Symptom

After successful Vercel build, production URL showed 404 error:

```
404: NOT_FOUND
Code: NOT_FOUND
ID: bom1::52k17-1769685804936-21d154a0f264
```

**Production URL**: `https://uncat-app-git-main-sahamofamily-7985s-projects.vercel.app`

**Build logs showed success**:
- ✓ Compiled successfully in 9.0s
- ✓ Generating static pages (22/22)
- Exit code: 0

---

## Impact

- **Production site completely inaccessible** for ~3 days
- No users could access the application
- Other issues (Stripe env vars, Clerk keys) masked the root cause initially

---

## Root Cause Analysis

### Primary Cause
`.vercel/project.json` had `"framework": null` instead of `"nextjs"`:

```json
{
  "settings": {
    "framework": null,  // ← PROBLEM
    "nodeVersion": "24.x"
  }
}
```

This caused Vercel to use the wrong build pipeline:
- **Expected**: `@vercel/next` (Next.js builder)
- **Actual**: `@vercel/static-build` (generic static site builder)

### Contributing Factors

1. **Local `vercel build` command created stale config**
   - Running `npx vercel build --prod` locally created `.vercel/` folder
   - This folder cached incorrect settings

2. **No explicit `vercel.json`**
   - Without explicit config, Vercel relied on auto-detection
   - Auto-detection failed or was overridden by cached settings

3. **Environment variable errors masked the issue**
   - Initial builds failed due to missing `STRIPE_SECRET_KEY`
   - Then failed due to missing `CLERK_PUBLISHABLE_KEY`
   - Once those were fixed, the 404 emerged

4. **Preview vs Production confusion**
   - Initial deploys went to Preview (feature branch)
   - Merging to `main` fixed env var issues but revealed 404

### Why It Wasn't Caught Earlier
- Local `npm run build` works correctly (uses Next.js directly)
- Build logs showed "success" - no obvious error
- The 404 only appears AFTER deployment, not during build

---

## Investigation Timeline

| Time | Action | Finding |
|------|--------|---------|
| Day 1 (2026-01-27) | Initial push to Vercel | Build failed - STRIPE_SECRET_KEY missing |
| Day 2 (2026-01-28) | Fixed Stripe issue | Build failed - CLERK_PUBLISHABLE_KEY missing |
| Day 2 | Added env vars to Vercel | Build succeeded but 404 on site |
| Day 2 | Various debugging attempts | Tried different URLs, checked logs |
| Day 3 (2026-01-29) | Merged to main branch | Still 404 |
| Day 3 | Researched StackOverflow link | Found framework detection issue |
| Day 3 | Examined `.vercel/project.json` | **Found `"framework": null`** |
| Day 3 | Changed Framework Preset in Vercel | **Site went live ✅** |

---

## Resolution

### Steps Taken

1. **Dashboard Fix** (Immediate):
   - Vercel Dashboard → uncat-app → Settings → General
   - Build & Development Settings → Framework Preset → **Next.js**
   - Redeployed

2. **Prevention Code Changes**:
   - Created `vercel.json` with explicit framework config
   - Added `.vercel` to `.gitignore`

### Code Changes
```json
// vercel.json (NEW FILE)
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "installCommand": "npm install",
  "outputDirectory": ".next"
}
```

```diff
# .gitignore
+ # vercel
+ .vercel
```

### Fixing Commit/PR
- **Commit**: `de87428` - feat: add incident management system and vercel.json
- **Date Merged**: 2026-01-29

### Verification
- Visited production URL: site loads correctly
- All routes functional

---

## Prevention

### Immediate Actions (Completed)
- [x] Created `vercel.json` with explicit `"framework": "nextjs"`
- [x] Added `.vercel` to `.gitignore`
- [x] Documented in incident log

### Long-term Improvements
- [ ] Pre-deployment checklist: Verify Framework Preset after linking new projects
- [ ] CI/CD check: Validate `vercel.json` exists before deploy
- [x] Never commit `.vercel` folder

---

## Related Resources
- [StackOverflow: 404 NOT_FOUND on Vercel deployment](https://stackoverflow.com/questions/71378572/404-not-found-on-vercel-deployment)
- [Vercel Docs: NOT_FOUND Error](https://vercel.com/docs/errors/NOT_FOUND)

---

## Lessons Learned

1. **Successful build ≠ working deployment** - Always verify the actual URL
2. **Check framework detection first** for 404 errors on Vercel
3. **Local `.vercel` folder should never be committed** - contains local-specific config
4. **Explicit config > auto-detection** - Use `vercel.json` to avoid ambiguity
5. **Layer errors can mask root causes** - Fix all errors systematically

---

## Keywords for Search
`vercel`, `404`, `NOT_FOUND`, `framework-detection`, `static-build`, `nextjs`, `vercel.json`, `framework: null`
