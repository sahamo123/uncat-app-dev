---
trigger: always_on
---

# DOE Framework (Design → Orchestrate → Execute)

You MUST follow DOE for any non-trivial change (more than a tiny edit).

## 1) DESIGN (always first)
Before coding, produce a short "DESIGN" section with:
- Goal (1–2 lines)
- User flow / behavior change (bullets)
- Acceptance criteria (bullets, testable)
- Data model + APIs impacted (if any)
- Risks / assumptions

If requirements are unclear, ask ONLY the minimum questions, then proceed with best assumptions.

## 2) ORCHESTRATE (plan the work)
After DESIGN, produce an "ORCHESTRATION" section with:
- Task list in order
- Dependencies (what blocks what)
- What can be parallelized (if relevant)
- Test plan (unit + integration + e2e as applicable)
- Definition of Done (what you will show as proof)

Do NOT start implementation until ORCHESTRATION is present.

## 3) EXECUTE (implement + verify)
Then implement in small, reviewable steps:
- Make the smallest safe change
- Run / update tests
- Confirm acceptance criteria is met
- Summarize what changed + how to verify

## Output format (strict)
Always output in this order:
1. DESIGN
2. ORCHESTRATION
3. EXECUTION (with step-by-step progress)
4. VERIFICATION (commands run, what to click/check, screenshots if applicable)

## Safety + hygiene
- Never hardcode secrets or API keys.
- Prefer env vars / .env (do not print secret values).
- If a command is destructive (delete/reset), warn and ask before running.
- Keep changes modular: do not dump everything into one file unless it is already the pattern.
