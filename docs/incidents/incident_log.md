# Incident Log

Quick-reference index of all incidents. For detailed analysis, see linked files.

## 🔍 Quick Search Keywords
`vercel` | `middleware` | `build-failure` | `dependency` | `next-16` | `clerk` | `supabase` | `stripe` | `404` | `env-var`

---

## Active Incidents (Open)

*No active incidents*

---

## Resolved Incidents

### INCIDENT-008: Vercel 404 NOT_FOUND - Framework Detection
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🔴 Critical |
| **Duration** | ~3 days |
| **Status** | ✅ Resolved |
| **Details** | [INC-008_2026-01-29_vercel-404-framework.md](./resolved/INC-008_2026-01-29_vercel-404-framework.md) |

**Summary**: Build succeeded but production showed 404. Root cause: `"framework": null` in Vercel settings. Fixed by changing Framework Preset to Next.js in Vercel Dashboard. Prevention: Added `vercel.json` with explicit framework config.

**Keywords**: `vercel`, `404`, `NOT_FOUND`, `framework-detection`, `nextjs`

---

### INCIDENT-007: Vercel Build Failure - Clerk publishableKey
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🔴 Critical |
| **Status** | ✅ Resolved |
| **Details** | [INC-007_2026-01-29_clerk-publishable-key.md](./resolved/INC-007_2026-01-29_clerk-publishable-key.md) |

**Summary**: Build failed with "Missing publishableKey" error. Root cause: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` not set in Vercel env vars for Preview environment. Fixed by adding env var to Vercel Dashboard.

**Keywords**: `vercel`, `clerk`, `publishableKey`, `NEXT_PUBLIC`, `env-var`

---

### INCIDENT-006: Vercel Build Failure - Missing STRIPE_SECRET_KEY
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🔴 Critical |
| **Status** | ✅ Resolved |
| **Details** | [INC-006_2026-01-29_stripe-env-var-missing.md](./resolved/INC-006_2026-01-29_stripe-env-var-missing.md) |

**Summary**: Build failed because `lib/stripe.ts` threw at module load time. Fixed by refactoring to lazy initialization with `getStripe()`. Prevention: Never throw at module load for env vars.

**Keywords**: `vercel`, `stripe`, `build-failure`, `lazy-initialization`, `getStripe`

---

### INCIDENT-005: Build Failure - Unused Import
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🔴 Critical |
| **Status** | ✅ Resolved |
| **Details** | [INC-005_2026-01-29_unused-import-reports.md](./resolved/INC-005_2026-01-29_unused-import-reports.md) |

**Summary**: Build failed because `app/dashboard/reports/page.tsx` imported non-existent Select components. Fixed by removing unused import.

**Keywords**: `typescript`, `unused-import`, `build-failure`, `reports-page`

---

### INCIDENT-004: Dependency Version Drift
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🟡 Major |
| **Status** | ✅ Resolved |
| **Details** | [INC-004_2026-01-29_dependency-version-drift.md](./resolved/INC-004_2026-01-29_dependency-version-drift.md) |

**Summary**: Dependencies used caret (`^`) symbols allowing automatic updates. Fixed by locking all versions in `package.json`. Prevention: Always use exact versions.

**Keywords**: `dependency`, `version-lock`, `package-json`, `caret`

---

### INCIDENT-003: ESLint Config Version Mismatch
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🟢 Minor |
| **Status** | ✅ Resolved |
| **Details** | [INC-003_2026-01-29_eslint-version-mismatch.md](./resolved/INC-003_2026-01-29_eslint-version-mismatch.md) |

**Summary**: `eslint-config-next` was at 15.x while Next.js was at 16.x. Fixed by upgrading to matching version.

**Keywords**: `eslint`, `version-mismatch`, `next-16`

---

### INCIDENT-002: Missing Peer Dependency
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🔴 Critical |
| **Status** | ✅ Resolved |
| **Details** | [INC-002_2026-01-29_missing-radix-dependency.md](./resolved/INC-002_2026-01-29_missing-radix-dependency.md) |

**Summary**: Build failed with "Cannot find module '@radix-ui/react-label'". Fixed by installing missing dependency.

**Keywords**: `radix-ui`, `missing-dependency`, `build-failure`

---

### INCIDENT-001: Middleware Deprecation Warning
| Field | Value |
|-------|-------|
| **Date** | 2026-01-29 |
| **Severity** | 🟡 Major |
| **Status** | ✅ Resolved |
| **Details** | [INC-001_2026-01-29_middleware-deprecation.md](./resolved/INC-001_2026-01-29_middleware-deprecation.md) |

**Summary**: Next.js 16 deprecated `middleware.ts` in favor of `proxy.ts`. Fixed by renaming file.

**Keywords**: `middleware`, `proxy`, `next-16`, `deprecation`

---

## Statistics

| Severity | Count | Avg Resolution |
|----------|-------|----------------|
| 🔴 Critical | 5 | ~1 day |
| 🟡 Major | 2 | ~10 min |
| 🟢 Minor | 1 | 5 min |

**Total**: 8 incidents | **Resolved**: 8 (100%)
