# Voix Vive — The 12-Fret Guitar Masterclass

> **You are an instrument playing an instrument.**
> A body-centered guitar curriculum built on the Western Chromatic Scale, the Hero's Journey, and the belief that perfect pitch is teachable.

**Live URL:** [voix-vive.com](https://voix-vive.com)

---

## Student Flow — Mechanical Mode (Phase B)

The app works without AI. Every student can progress through the curriculum manually by checking off phases in the **BE → DO → PLAY Workbook**.

### How a Student Progresses

| Step | Action | Where | What Happens |
|------|--------|-------|-------------|
| **1. BE — Imagine** | Read all slides in a fret | *The Song* (OrientationHub) | Swipe to the last slide → "Mark BE Phase Complete" unlocks |
| **2. DO — Hear** | Match a pitch | *The Guitar* (PitchRoom) | "Begin Silent Space" (4s) → listen → guess correctly → "Mark DO Phase Complete" unlocks |
| **3. PLAY — Play** | Record a performance | *The Guitar* (Guitar Workbench) | Open tool → practice → mark complete |
| **4. Depth** | Go deeper | Any phase | Click "Go Deeper" → mastery upgrades from **Owned** to **Mastered** |
| **5. Resonance** | Cross-pillar understanding | Workbook tab | ⚡ Resonant badge appears when a phase is engaged 2+ times |

### The 4 Levels of Mastery

| Level | Symbol | Name | How to Reach |
|-------|--------|------|-------------|
| 0 | ○ | Encountered | You saw the phase |
| 1 | ◐ | Experienced | You attempted the phase |
| 2 | ● | Owned | You marked the phase complete |
| 3 | ★ | Mastered | You explored depth + completed |

### Somatic Gates

Before a student can mark a phase complete, they must demonstrate the skill:

| Phase | Gate Requirement | Set By |
|-------|-----------------|--------|
| **BE** | Read all slides to the end | SlideViewer (auto) |
| **DO** | Successfully match a pitch | PitchRoom (auto) |
| **PLAY** | Submit a video/audio recording | Tool submission |

### Legacy Traction Sync

Every DAG phase completion syncs to the legacy traction metric so the Quest Log and BEWorkbook never disagree:

| Phase | Legacy Traction | Mastery Set |
|-------|----------------|-------------|
| BE complete | 33 | Owned (2) |
| DO complete | 66 | Owned (2) |
| PLAY complete | 100 | Owned (2) |
| Depth explored | — | Mastered (3) |

---

## Maturation Map Archive

Completed maturation maps are archived for reference:

```
.windsurf/workflows/archive/
├── ai-dag-maturation_2026-05-28_pre-phase-c.md   ← Phase A+B complete, Pre-C gate in progress
```

Each snapshot records:
- What was completed
- What was learned
- What blocked progress
- Quality gate results

---

## Development

```bash
npm install
npm run dev       # localhost:5173
npm run build     # production build
npm run test      # vitest
```

**Pre-Phase C Gate:** See `.windsurf/workflows/pre-phase-c-gate.md` for the full quality checklist.

---

## Architecture

- **Frontend:** React 18 + Vite + Framer Motion
- **State:** localStorage (tractionStore) + IndexedDB (localDatabase) + Supabase cloud sync
- **Curriculum:** 144-node DAG (12 frets × 3 pillars × 3 phases + milestones + reflections)
- **AI (optional):** StepAudio R1.1 via vLLM on localhost:9998

---

## License

Platform architecture by Joshua Atkinson.
All revenue from voix-vive.com goes to Bertrand Laurence.
