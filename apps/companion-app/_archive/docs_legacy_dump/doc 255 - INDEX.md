# Voix Vive — Document Index

> **Purpose:** Single map of every document, what it covers, and where to find it.
> **Last Updated:** 2026-06-01
> **Convention:** `00_` prefix = index/meta, `01-04` = design, `05-06` = research integration, `07+` = operational

---

## BE (Design) — Imagine the System Before Building It

| # | Document | What It Covers | Status |
|---|----------|---------------|--------|
| 00 | `00_INDEX.md` | This file — map of all docs | ✅ Current |
| 00 | `00_SYSTEM_ARCHITECTURE.md` | Technical architecture, data flow, persistence tiers | ✅ Stable |
| 01 | `01_PEDAGOGY.md` | Bertrand's somatic mystic philosophy, dual-coding engine | ✅ Stable |
| 01 | `01_ACADEMY_SYLLABUS.md` | 12-fret curriculum overview, interval sequence | ✅ Stable |
| 02 | `02_BUSINESS_MODEL.md` | Revenue model, pricing, engagement ladder | ✅ Stable |
| 05 | `05_PEARL_STANDARD.md` | PEARL multi-perspective standard for content review | ✅ Stable |
| 07 | `07_BERTRAND_MENTORSHIP_INTEGRATION.md` | Mentor workflow, async review, scheduling | ✅ Stable |
| 09 | `09_FOUR_MODES_AND_APPRENTICESHIP.md` | Four learning modes, apprenticeship model | ✅ Stable |
| 05 | `05_KRIYA_DELIVERY_SYSTEM.md` | Kriya Yoga workbook vs Voix Vive delivery comparison + AI tiering | 🆕 Updated |
| 06 | `06_GAME_NOTIFICATIONS_IDENTITY.md` | Game system, Practice Garden, identity shedding, notification architecture + always-on AI tutor | 🆕 Updated |
| 07 | `07_MINIMUM_AI_MODE.md` | Three-layer AI architecture: Souffle→Voix→Chant (LFM2.5-1.2B + StepAudio 33B) | 🆕 Updated |
| — | `CLAIMS_MAP.md` | **Function/UI → Document → Status mapping** — over-claims, under-claims, ghost systems | 🆕 New |

## DO (Document) — Record What Exists and What's Missing

| # | Document | What It Covers | Status |
|---|----------|---------------|--------|
| — | `CODEBASE_AUDIT.md` | Full codebase research analysis — what's wired, what's ghost, what's not built | ✅ Accurate as of 2026-05-28 |
| — | `CONTEXT.md` (project root) | Session recovery doc — cast of characters, business strategy, tech stack | ✅ Active |
| — | `README.md` (project root) | Project overview, dev setup | ✅ Basic |

## PLAY (Develop) — Build From Docs Into Code

| # | Document | What It Covers | Status |
|---|----------|---------------|--------|
| 10 | `10_FRIDAY_TESTING_HANDOFF.md` | Testing protocol, Friday deployment cycle | ✅ Stable |
| 11 | `11_UI_PEARL_STANDARDS.md` | UI/UX standards, component patterns | ✅ Stable |
| — | `IMPLEMENTATION_ROADMAP.md` | ✅ Wiring plan — Layer 0 (AI tier) through Layer 6 (Night Gate) |

## Research (Source Material)

| # | Document | What It Covers | Status |
|---|----------|---------------|--------|
| 10 | `research/10_MASTER_DESIGN_DOC.md` | Single source of truth — pedagogical + architectural | ✅ Canonical |
| 10a | `research/10_design_doc_01_foundation.md` | Foundation sub-doc (student, philosophy) | ✅ Subsumed by 10 |
| 10b | `research/10_design_doc_02_curriculum.md` | Curriculum sub-doc (12-fret, vertiscale) | ✅ Subsumed by 10 |
| 10c | `research/10_design_doc_03_vertiscale_game.md` | Vertiscale game design (SHEARL/PLING!/FHEAL) | ✅ Subsumed by 10 |
| 10d | `research/10_design_doc_04_platform_and_business.md` | Platform + business sub-doc | ✅ Subsumed by 10 |
| 11 | `research/11_bertrand_content_request.md` | Content request for Bertrand | ✅ Fulfilled |
| 12 | `research/12_GUITAR_EMODULE_PEARL_MATURATION_v3.md` | Pearl maturation map for e-module | ✅ Stable |
| 13 | `research/13_DAG_EMODULE_FUNNEL.md` | DAG node graph, edges, funnel design | ✅ Stable |

## Reference (Operational/Marketing)

| # | Document | What It Covers | Status |
|---|----------|---------------|--------|
| — | `BERTRAND_EXECUTIVE_BRIEF.md` | Executive summary for stakeholders | ✅ Stable |
| — | `MARKET_ANALYSIS.md` | Market research, competitive analysis | ✅ Stable |
| — | `RESONANT_MIRROR_GDD.md` | Resonant Mirror game design doc | ✅ Stable |
| — | `RESONANT_MIRROR_WALKING_MODE.md` | Walking mode engine design | ✅ Stable |

## Archive (Legacy)

| # | Document | Location | Note |
|---|----------|----------|------|
| — | `DESIGN_legacy.md` | `Music/_archive/` | Pre-DAG design |
| — | `TECHNICAL_BIBLE.md` | `Music/_archive/` | Pre-ADDIECRAPEYE |
| — | `VIBE_BRIEF.md` | `Music/_archive/` | Early vibe doc |
| — | `INDEX_legacy.md` | `Music/_archive/` | Old index |

---

## Key Cross-References

| Question | Primary Doc | Supporting Docs |
|----------|-------------|-----------------|
| "What should I build next?" | `IMPLEMENTATION_ROADMAP.md` | `CODEBASE_AUDIT.md`, `07_MINIMUM_AI_MODE.md` |
| "Why is the DAG invisible?" | `CODEBASE_AUDIT.md` §5, §11 | `research/13_DAG_EMODULE_FUNNEL.md` |
| "How does Kriya inform the game?" | `05_KRIYA_DELIVERY_SYSTEM.md` | `06_GAME_NOTIFICATIONS_IDENTITY.md`, `07_MINIMUM_AI_MODE.md` |
| "How does the AI Troubadour work?" | `07_MINIMUM_AI_MODE.md` | `05_KRIYA_DELIVERY_SYSTEM.md` §7, `IMPLEMENTATION_ROADMAP.md` Layer 0 |
| "What claims are real vs aspirational?" | `CLAIMS_MAP.md` | `CODEBASE_AUDIT.md`, `BERTRAND_EXECUTIVE_BRIEF.md` |
| "What's the pedagogical philosophy?" | `research/10_MASTER_DESIGN_DOC.md` | `01_PEDAGOGY.md` |
| "How does the Vertiscale engine score?" | `research/10_design_doc_03_vertiscale_game.md` | `src/game/scoreCalculator.js` |
| "What's the business model?" | `02_BUSINESS_MODEL.md` | `BERTRAND_EXECUTIVE_BRIEF.md` |
