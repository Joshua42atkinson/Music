# Voix Vive: Somatic Guitar Mentorship Platform
## Executive Summary

**Student:** Joshua Atkinson
**Course:** EDCI 57300 — Learning Design and Technology Practicum
**Instructor:** Dr. Jennifer C. Richardson
**Supervisor:** Bertrand Laurence, Owner, Bertrand Laurence Guitar Studio
**Date:** June 2026

---

### Purpose

Voix Vive ("The Living Voice") is a web-based somatic guitar mentorship platform built for Bertrand Laurence, a master guitarist and vocalist who teaches at Passim School of Music in Cambridge, MA, and operates a solo studio in Houlton, Maine. The project addresses a pedagogical gap in traditional music education applications: existing tools (Yousician, SimplyGuitar) rely on visual gamification — falling notes, scrolling tablature, XP bars — that traps the student's eyes on the screen and disconnects them from the physical and auditory experience of the instrument. Students learn to play the screen rather than the guitar.

Voix Vive removes visual gating and replaces it with a voice-first, somatic pedagogical framework. The student's attention is returned to their ears, their hands, and the physical resonance of the instrument. The platform packages Bertrand's proprietary protocols (©SHEARL, ©PLING!, ©FHEAL) into scalable digital assets, enabling structured independent practice while preserving the human mentorship relationship.

### How the Outcomes Will Be Used

The platform is live at **voix-vive.com** and serves as the digital transformation of Bertrand's teaching practice. It functions on three levels:

1. **Free curriculum funnel** — A 12-chapter interactive textbook (211 slides) mapping the Hero's Journey onto the 12 intervals of the Western chromatic scale, with original artwork, Pythagorean ratio context, and exercises grounded in audiation theory (Gordon, 1997). This is the marketing funnel — habit formation at zero cost.

2. **Interactive practice tools** — Twelve somatic practice tools driven by the Web Audio API, implementing Bertrand's protocols: a breathing gate for pre-practice centering, a pitch trainer for interval internalization, an interactive fretboard for spatial memory, a microtonal tracker, an interval visualizer, and others. These tools work entirely client-side with no cloud dependency.

3. **Mentorship infrastructure** — A business landing page with service pricing, a structured practice recorder for asynchronous video submissions, a mentor dashboard for review workflows, and a local AI coaching system (the "Truebadour") that provides Socratic guidance at zero marginal cloud cost using on-device inference.

The platform is bilingual (English/French, 700 translation keys each), targeting the underserved Francophone guitar market in Quebec, France, Belgium, and Switzerland.

### Process

The project was completed over an 8-week practicum using a rapid prototyping methodology. The process followed these phases:

- **Week 1 (Analysis):** Conducted a 90-minute recorded SME session with Bertrand Laurence to document his pedagogical philosophy, proprietary protocols, and business needs. Established learner profile (adult guitarists ages 30–65 managing performance anxiety). Mapped the 12-chapter curriculum structure to the 12 chromatic intervals.

- **Weeks 2–3 (Prototyping & Core Development):** Built the curriculum reader, internationalization engine, StudioPage, and the Web Audio-based practice tools. First SME review (May 27) confirmed pedagogical alignment.

- **Weeks 4–5 (AI Infrastructure):** Implemented the local AI coaching system with a multi-backend fallback chain (Gemini Nano → cloud Flash → wllama offline). Engineered Socratic prompt constraints grounded in Bertrand's pedagogy.

- **Weeks 6–7 (Integration & Refinement):** Deployed Supabase cloud persistence, Google OAuth, the structured practice recorder, and mentor dashboard. Implemented comprehensive automated testing (224 unit tests, 4 E2E Playwright specs). Second SME review confirmed business workflow readiness.

- **Week 8 (Deployment & Handoff):** Production deployment to voix-vive.com via Vercel with SSL. Final build validation and SME handoff.

The process was iterative — each phase produced a working prototype that Bertrand reviewed on his device, and his feedback drove revisions. This validated the rapid prototyping approach: Bertrand teaches through demonstration and improvisation, and he cannot articulate design requirements in advance but reacts authentically when shown a working prototype.

### Key ID Model

The primary instructional design model was **ADDIECRAPEYE** (Atkinson, 2026), a practitioner-developed 12-phase, 3-layer framework whose closest academic parallel is **Rapid Prototyping** (Jones & Richey, 1994). The three layers are:

- **ADDIE** (Analyze → Design → Develop → Implement → Evaluate) — governs project progression through the standard ID lifecycle.
- **CRAP** (Contrast, Repetition, Alignment, Proximity) — applies Robin Williams' (2004) visual design principles to minimize cognitive load in the interface.
- **EYE** (Envision → Yoke → Evolve) — governs AI integration and telemetry-driven iteration.

Evaluation used **Kirkpatrick's Four Levels**, adapted for somatic pedagogy: (1) Reaction — FHEAL journal self-reports; (2) Learning — Vertiscale and PlingTrainer telemetry; (3) Behavior — self-initiated practice frequency via session logs; (4) Results — instructor revenue and $0/query AI cost via local inference.

### Deliverables Summary

| # | Deliverable | Status |
|---|------------|--------|
| 1 | Living Textbook — 12-chapter interactive reader (211 slides, 135 DAG nodes) | Complete |
| 2 | Troubadour Playbook — 12 somatic practice tools (Web Audio API) | Complete |
| 3 | Vertiscale Imagination Engine — 3-phase ear training game | Complete |
| 4 | Troubadour Adventure — 12-scene bilingual narrative | Complete |
| 5 | StudioPage — Services, pricing, payment integration | Complete |
| 6 | Bilingual i18n — 700 EN/FR translation keys | Complete |
| 7 | Identity & Progression — Bardic Titles, CapstoneCard, Certification | Complete |
| 8 | PracticeJournal — DAG-based daily session generator | Complete |
| 9 | BEWorkbook — Node cards with BE→DO→PLAY progression | Complete |
| 10 | Local AI Coaching — useTroubadourAI, multi-backend fallback | Complete |
| 11 | Production Deployment — voix-vive.com (Vercel, DNS, SSL) | Complete |
| 12 | Automated Testing — 224 unit tests, 4 E2E specs, 0 errors | Complete |
| 13 | Supabase Cloud Persistence — Schema, OAuth, sync | Complete |
| 14 | PracticeRecorder & Mentor Dashboard | Complete |

**Total source files:** 217 | **React components:** 57 | **Custom hooks:** 30+ | **Test coverage:** 224/228 passing (4 skipped)
