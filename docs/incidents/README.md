# Incidents Documentation

This folder contains the incident management system for tracking, documenting, and learning from production issues.

## Purpose

1. **Self-healing documentation** - AI agents reference these to diagnose similar issues
2. **Institutional knowledge** - Team members understand past challenges
3. **Debugging accelerator** - Similar issues resolved faster with documented solutions
4. **Portability** - All documentation version-controlled with codebase

---

## Folder Structure

```
docs/incidents/
├── README.md           # This file
├── _template.md        # Template for new incidents
├── incident_log.md     # Summary index (quick search)
├── assets/             # Screenshots & media
│   └── INC-XXX/       # Per-incident subfolders
├── open/               # Active investigations
└── resolved/           # Completed incidents
```

---

## File Naming Convention

**Format**: `INC-XXX_YYYY-MM-DD_short-description.md`

| Component | Format | Example |
|-----------|--------|---------|
| Prefix | `INC-XXX` | `INC-008` |
| Date | `YYYY-MM-DD` | `2026-01-29` |
| Description | `kebab-case` (3-5 words) | `vercel-404-framework` |
| Extension | `.md` | `.md` |

**Full Example**: `INC-008_2026-01-29_vercel-404-framework.md`

---

## Relationship Between Files

| File | Purpose | When to Use |
|------|---------|-------------|
| `incident_log.md` | Quick search index | First stop for debugging |
| `open/INC-XXX_*.md` | Active investigation details | During incident resolution |
| `resolved/INC-XXX_*.md` | Full post-mortem | Learning & reference |
| `assets/INC-XXX/` | Screenshots & evidence | Embedded in incident files |

---

## Workflow

### Creating New Incidents
Use the `/incident` workflow to create new incident files:
1. Workflow confirms incident details with you
2. Creates file in `open/` or `resolved/`
3. Copies screenshots to `assets/`
4. Updates `incident_log.md`
5. Adds commit/PR links

### Resolving Incidents
1. Move file from `open/` to `resolved/`
2. Update status in `incident_log.md`
3. Add fixing commit/PR link
4. Document prevention strategies

---

## Severity Levels

| Level | Icon | Use When |
|-------|------|----------|
| Critical | 🔴 | Production down, data loss risk |
| Major | 🟡 | Feature broken, workaround exists |
| Minor | 🟢 | Cosmetic, non-blocking |

---

## Quick Search Tips

1. **Search `incident_log.md`** by keywords first
2. **Grep for error codes** in this folder
3. **Check file names** for component keywords
4. **Look in `assets/`** for visual reference
