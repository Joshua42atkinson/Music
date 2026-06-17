---
title: README
status: archive
tags: []
date: 2026-06-14
---
# Maturation Map Archive

> **Every completed phase leaves a paper trail.**
> This archive is a simple `.md` data system for tracking lessons learned, quality gates, and institutional memory.

---

## How It Works

When a maturation map phase completes, we snapshot it here with the date and gate status. Future agents (Cascade, Nemotron, or you) can read these to understand what worked, what didn't, and why decisions were made.

### Naming Convention

```
ai-dag-maturation_YYYY-MM-DD_<gate-name>.md
```

Examples:
- `ai-dag-maturation_2026-05-28_pre-phase-c.md`
- `ai-dag-maturation_2026-05-30_phase-c-complete.md`

### Snapshot Template

Each archived file should include a **Lessons Learned** section at the bottom:

```markdown
## LESSONS LEARNED

### What Worked
- [specific technique or decision]

### What Didn't
- [specific failure or blockage]

### Decisions Made
- [why we chose X over Y]

### Next Time
- [what to do differently]
```

---

## Archive Index

| Date | Gate | Status | Key Achievement | Blocker |
|------|------|--------|-----------------|---------|
| 2026-05-28 | Pre-Phase C | 75% complete | 121 nodes injected, Mechanical Mode fully wired | Fret 9 + 12 Nemotron unterminated strings |

---

## For Future Agents

If you're reading this and the current maturation map seems out of date, check the most recent archive file. It may contain context that explains why the project is in its current state.

If you're stuck, read the **What Didn't** and **Next Time** sections from the most recent snapshot before asking for help.
