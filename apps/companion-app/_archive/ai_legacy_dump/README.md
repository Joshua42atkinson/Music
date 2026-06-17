# Voix Vive — AI Context Docs
**For:** AI agents. Read LOCKED_DECISIONS.md first. Then 12M_bible.md.  
**Rule:** Full technical context. Every detail. No simplification.

## Read Order (mandatory for any new agent session)
1. `LOCKED_DECISIONS.md` — decisions already made, do NOT re-discuss
2. `12M_bible.md` — primary source of truth for all pedagogy + architecture
3. `dag_structure.md` — how the 144-node DAG is wired
4. `ai_maturation_workflow.md` — how AI behaviour matures across sprints
5. `gap_analysis.md` — known gaps and what still needs building
6. `drift_check.md` — anti-drift protocol

## Session Artifacts (stored in brain/artifacts)
- `task.md` — master TODO, 7 sprints
- `implementation_plan.md` — technical plan
- `voixvive_gamification_meta.md` — guitar economy engine spec
- `LOCKED_DECISIONS.md` — scope lock

## Key Technical Facts
- Model: Liquid AI LFM2.5-8B Q4 (128K context)
- Stack: React + Vite, wllama in-browser GGUF
- Economy: Tone · Resonance · Buzz · Voice · Distortion
- Hosting: Static webapp, free tier, zero backend cost
- LMS: xAPI + LTI 1.3 (Sprint 6)
