# INCIDENT-004: Dependency Version Drift

## Metadata

| Field | Value |
|-------|-------|
| **ID** | INC-004 |
| **Date Reported** | 2026-01-29 |
| **Date Resolved** | 2026-01-29 |
| **Duration** | ~10 minutes |
| **Severity** | 🟡 Major |
| **Component** | Package Management |
| **Status** | ✅ Resolved |

---

## Symptom

Multiple dependencies used caret (`^`) symbols allowing minor/patch updates:

```json
"dependencies": {
  "next": "^16.1.6",
  "react": "^19.2.3",
  ...
}
```

---

## Impact

- Different versions installed on different machines
- Unpredictable build outcomes
- Difficulty reproducing bugs
- Potential breaking changes from automatic updates

---

## Root Cause Analysis

### Primary Cause
Default npm behavior uses `^` for semantic versioning, allowing automatic minor updates.

### Why It Wasn't Caught Earlier
- This is npm default behavior
- No explicit policy against it existed

---

## Resolution

### Steps Taken
1. Created `dependency_standardization_plan.md`
2. Removed all `^` and `~` symbols from `package.json`
3. Locked all dependencies to exact versions:
   - Dependencies: 18 locked versions
   - DevDependencies: 9 locked versions
4. Ran `npm install` to regenerate `package-lock.json`
5. Verified build: `npm run build` (Success)

### Code Changes
```diff
# package.json
- "next": "^16.1.6",
+ "next": "16.1.6",
- "react": "^19.2.3",
+ "react": "19.2.3",
```

### Fixing Commit/PR
- **Commit**: Part of dependency standardization commit
- **Date Merged**: 2026-01-29

---

## Prevention

- [x] Always use exact versions in production projects
- [x] Created `.agent/rules/dependency_standards.md`
- [ ] Add pre-commit hook to detect `^` or `~` symbols
- [x] Document upgrade policy for future updates

---

## Keywords for Search
`dependency`, `version-lock`, `package-json`, `caret`, `tilde`, `semantic-versioning`
