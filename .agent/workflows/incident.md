---
description: Document and track incidents with detailed knowledge files
---

# Incident Documentation Workflow

This workflow creates detailed incident knowledge files for self-healing documentation.

## Usage
Run this workflow when resolving a critical or major incident to create a permanent record.

## Prerequisites
- Incident has been resolved (or root cause identified)
- Incident logged in `incident_log.md`

## Steps

### 1. Identify Incident Details
Gather the following information:
- Incident ID (from incident_log.md, e.g., "008")
- Date resolved (YYYY-MM-DD format)
- Short description (3-5 words, kebab-case)

### 2. Create Incident File
// turbo
Create new file with naming convention:
```
knowledge_base/incidents/INC-XXX_YYYY-MM-DD_short-description.md
```

**Example**: `INC-008_2026-01-29_vercel-404-framework-detection.md`

### 3. Use Template
Copy contents from `knowledge_base/incidents/_template.md` and fill in all sections:
- Metadata table
- Symptom (include exact error messages)
- Impact
- Root Cause Analysis (primary + contributing factors)
- Investigation Timeline
- Resolution (steps + code changes)
- Prevention (immediate + long-term)
- Related Resources
- Keywords

### 4. Add Screenshots
If applicable, embed screenshots from the incident:
```markdown
![Description](file:///path/to/screenshot.png)
```

### 5. Update Incident Log
Mark the incident as ✅ Resolved in `incident_log.md` and add reference to detailed file:
```markdown
**Detailed Analysis**: See `incidents/INC-XXX_YYYY-MM-DD_description.md`
```

### 6. Commit Changes
// turbo
```bash
git add knowledge_base/incidents/
git commit -m "docs: add detailed incident file for INC-XXX"
git push
```

## File Naming Reference

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | `INC-XXX` | `INC-008` |
| Date | `YYYY-MM-DD` | `2026-01-29` |
| Description | `kebab-case` | `vercel-404-framework-detection` |
| Full Name | Combined | `INC-008_2026-01-29_vercel-404-framework-detection.md` |

## Quality Checklist
- [ ] Error message included verbatim
- [ ] Root cause clearly identified
- [ ] Prevention strategies documented
- [ ] Keywords added for searchability
- [ ] incident_log.md updated with status
