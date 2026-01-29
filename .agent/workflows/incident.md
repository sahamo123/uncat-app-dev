---
description: Document and track incidents with detailed knowledge files
---

# Incident Documentation Workflow

This workflow creates detailed incident knowledge files for self-healing documentation.

## Usage
Trigger with `/incident` when resolving a critical or major incident.

## Prerequisites
- Incident identified (error observed, symptoms captured)
- Root cause analysis started or completed

---

## Step 1: Confirm Incident Details (REQUIRED)

**STOP AND CONFIRM WITH USER:**

Before proceeding, display the following to the user:

```
📋 Recording the following incident(s):

| # | ID | Title | Severity |
|---|-----|-------|----------|
| 1 | INC-XXX | [Brief title] | 🔴 Critical / 🟡 Major / 🟢 Minor |

Is this correct? (yes/no)
- If multiple incidents, list each
- Wait for user confirmation before proceeding
```

**Do NOT proceed until user confirms.**

---

## Step 2: Determine Incident ID

// turbo
```bash
# Count existing incidents to determine next ID
ls -la docs/incidents/resolved/ | wc -l
ls -la docs/incidents/open/ | wc -l
```

Format: `INC-XXX` where XXX is zero-padded (001, 002, ... 010, 011, ...)

---

## Step 3: Create Incident File

**For OPEN incidents** (still investigating):
```
docs/incidents/open/INC-XXX_YYYY-MM-DD_short-description.md
```

**For RESOLVED incidents** (fix verified):
```
docs/incidents/resolved/INC-XXX_YYYY-MM-DD_short-description.md
```

Copy template from `docs/incidents/_template.md` and fill ALL sections:
- Metadata table (ID, dates, severity, status)
- Symptom (exact error messages)
- Impact
- Root Cause Analysis
- Investigation Timeline
- Resolution steps
- Code changes with diffs
- Fixing commit/PR links
- Prevention strategies
- Keywords for search

---

## Step 4: Copy Screenshots (if applicable)

// turbo
If screenshots exist, copy to assets folder:
```bash
mkdir -p docs/incidents/assets/INC-XXX/
# Copy screenshot files here
```

Update incident file with relative paths:
```markdown
![Error Screenshot](../assets/INC-XXX/screenshot.png)
```

---

## Step 5: Update Incident Log

Add summary entry to `docs/incidents/incident_log.md`:

```markdown
### INCIDENT-XXX: [Title]
| Field | Value |
|-------|-------|
| **Date** | YYYY-MM-DD |
| **Severity** | 🔴 Critical / 🟡 Major / 🟢 Minor |
| **Status** | 🔴 Open / ✅ Resolved |
| **Details** | [INC-XXX_date_description.md](./resolved/INC-XXX_date_description.md) |

**Summary**: One-paragraph description.

**Keywords**: `keyword1`, `keyword2`

---
```

---

## Step 6: Add Commit/PR Link

After committing the fix, update the incident file:

```markdown
### Fixing Commit/PR
- **Commit**: [abc1234](https://github.com/sahamo123/uncat-app-dev/commit/abc1234)
- **PR**: [#123](https://github.com/sahamo123/uncat-app-dev/pull/123)
- **Date Merged**: YYYY-MM-DD
```

---

## Step 7: Commit Changes

// turbo
```bash
git add docs/incidents/
git commit -m "docs: add INC-XXX incident documentation - [brief description]"
git push origin main
```

---

## Step 8: Resolve Open Incidents

When an open incident is resolved:

// turbo
1. Move file from `open/` to `resolved/`:
```bash
mv docs/incidents/open/INC-XXX_*.md docs/incidents/resolved/
```

2. Update status in incident file and incident_log.md:
   - Change `🔴 Open` to `✅ Resolved`
   - Add resolution date and commit link

3. Commit the move:
```bash
git add docs/incidents/
git commit -m "docs: resolve INC-XXX - [brief description]"
git push origin main
```

---

## File Naming Reference

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | `INC-XXX` | `INC-008` |
| Date | `YYYY-MM-DD` | `2026-01-29` |
| Description | `kebab-case` (3-5 words) | `vercel-404-framework` |
| Full Name | Combined | `INC-008_2026-01-29_vercel-404-framework.md` |

---

## Quality Checklist

Before completing the workflow, verify:

- [ ] Error message included verbatim
- [ ] Root cause clearly identified
- [ ] Timeline shows investigation steps
- [ ] Code changes shown with diffs
- [ ] Commit/PR link added
- [ ] Prevention strategies documented
- [ ] Keywords added for searchability
- [ ] incident_log.md updated with summary
- [ ] All changes committed and pushed
