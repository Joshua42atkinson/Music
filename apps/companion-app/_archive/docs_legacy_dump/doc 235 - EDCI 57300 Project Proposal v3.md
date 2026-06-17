# EDCI 57300 — Revised Project Proposal (v3)

**Student:** Joshua Atkinson  
**Course:** EDCI 57300 Practicum  
**Instructor:** Dr. Jennifer Richardson  
**Date:** May 29, 2026  
**Project:** Voix Vive — Somatic Guitar Mentorship Platform  

> **Note:** This proposal supersedes the May 25 submission. It reflects four additional days of build progress and corrects an error in the original regarding Bertrand Laurence's credentials.

---

## Part 1: Narrative Proposal

### Project Description

Voix Vive ("The Living Voice") is a web-based guitar mentorship platform built for **Bertrand Laurence**, a master guitarist and vocalist who teaches group classes at Passim School of Music in Cambridge, MA, and operates a solo studio in Houlton, Maine. The platform is live at **voix-vive.com**.

It operates on an anti-dopamine "Slow Web" philosophy: the student is not a broken instrument waiting to be repaired — they are the song that has not yet fully sounded. Measurement tracks expansion (audiation depth, somatic awareness, expressive confidence) rather than deficit reduction (speed, accuracy, leaderboard rank).

**Four integrated layers:**

1. **The Living Textbook** — Free, 12-chapter swipeable curriculum mapping the Hero's Journey onto the 12 intervals of the Western chromatic scale, with original artwork, pedagogical slides, Pythagorean ratio context, and exercises grounded in audiation theory (Gordon, 1997).
2. **The Troubadour Playbook** — 12 interactive somatic practice tools driven by Web Audio API, implementing Bertrand's proprietary protocols: ©SHEARL (See/Hear/Feel), ©PLING! (Play/Listen/Internalize/Navigate/Glide), and ©FHEAL (Feel/Hear/Express/Act/Live).
3. **The Studio** — Business landing page with live lesson bookings, async video feedback, membership tiers, and workshops.
4. **Local AI Coaching (DaaS)** — Locally hosted LLM backend (LM Studio, port 1234) providing Socratic coaching at zero marginal cloud cost. A custom `useTroubadourAI` hook auto-detects available backends (vLLM → llama.cpp → StepAudio → LM Studio → offline fallback) and routes Socratic prompts grounded in Bertrand's actual pedagogy.

### Organization Description

**Bertrand Laurence Guitar Studio** is an independent music education practice operated from Houlton, Maine. Bertrand has trained at MassArt and Mirage Mime Theatre, and teaches group classes at Passim School of Music in Cambridge, MA (Thumbtack Top Pro, multiple years). His audience is adult learners (ages 30–65) managing performance anxiety, inner-critic interference, and fragmented practice time. The studio is transitioning from an hourly-lesson model to a scalable digital hybrid, with the free textbook serving as a marketing funnel to paid services.

**Contact Information:**
- **Name:** Bertrand Laurence
- **Position:** Owner, Master Guitar Instructor
- **Email:** bertlarrymusic@gmail.com
- **Phone:** 617-447-5575
- **Address:** 148 Richdale Ave, Cambridge MA 02140
- **Website:** https://voix-vive.com

### Project Goals and Deliverables

**Primary Goal:** Deploy a web platform and local AI coaching infrastructure that expands the expressive range of adult guitar students while establishing financial sovereignty for the instructor.

**Measurable Goals:**

| Goal | Instrument | Target |
|------|-----------|--------|
| Audiation Depth | Vertiscale placement accuracy | ≥ 60% by Session 5 |
| Pitch Internalization | PlingTrainer cents deviation | ≥ 20% reduction, Wk 1→4 |
| Somatic Expansion | FHEAL journal composite | ≥ 2-pt increase, Sess. 1→8 |
| Flow State | Post-session Likert (1–5) | Mean ≥ 3.5 over 4 weeks |
| Financial Sovereignty | Local inference verification | $0/query cloud cost |

**Practicum Deliverables (~83 hours, Phases 0–2):**

| # | Deliverable | Status |
|---|------------|--------|
| 1 | Living Textbook — 12-chapter interactive reader with 144 DAG nodes | ✅ |
| 2 | Troubadour Playbook — 12 somatic practice tools | ✅ |
| 3 | Vertiscale Imagination Engine (Flash → Imagine → Reflect) | ✅ |
| 4 | Troubadour Adventure — 12-scene bilingual narrative | ✅ |
| 5 | StudioPage — Services, pricing, payment integration | ✅ |
| 6 | Bilingual i18n — 340+ EN/FR translation keys | ✅ |
| 7 | Identity & Progression — Bardic Titles, CapstoneCard, Certification | ✅ |
| 8 | PracticeJournal — 20-min DAG-based daily session generator | ✅ |
| 9 | BEWorkbook — Node cards with BE→DO→PLAY progression | ✅ |
| 10 | Local AI Coaching — useTroubadourAI, BetaGate, MockStudent | ✅ |
| 11 | Deployment — voix-vive.com (Vercel, DNS, SSL) | ✅ |
| 12 | Build & Test Validation — 46/46 tests passing, 0 errors | ✅ |
| 13 | Supabase Integration — Schema deployed, OAuth configured | 🔄 |
| 14 | PracticeRecorder & Mentor Dashboard | 🔄 |

**Post-Practicum Scope (Phases 3–5):**
- French curriculum translation
- Troubadour AI Evaluation System (Bronze/Silver/Gold tiers)
- Inner Circle Membership + Workshop Calendar
- Android PWA conversion

### ID and Evaluation Models

**Primary ID Model: ADDIECRAPEYE** (Atkinson, 2026)

A 12-phase, 3-layer instructional systems design framework whose closest academic parallel is Rapid Prototyping (Jones & Richey, 1994). It extends Rapid Prototyping with explicit visual systems architecture principles (CRAP — Robin Williams, 2004) and real-time evaluation telemetry (EYE).

**Evaluation Model: Kirkpatrick's Four Levels** (adapted for somatic pedagogy)

| Level | Label | Voix Vive Application |
|-------|-------|-----------------------|
| 1 | Reaction | FHEAL journal self-reports |
| 2 | Learning | Vertiscale and PlingTrainer telemetry |
| 3 | Behavior | Self-initiated practice frequency via session logs |
| 4 | Results | Instructor revenue and $0/query AI cost via local inference |

### Fit Within the Organization

Voix Vive is the digital transformation of Bertrand's teaching practice. It packages his proprietary protocols into scalable digital assets so students receive structured guidance during independent practice. The free textbook is a marketing funnel; revenue comes from coaching, feedback, and membership. Local AI inference means the studio retains 100% of digital revenue with near-zero operating costs.

### Evaluation Plan

| Stage | Timing | Evaluator |
|-------|--------|-----------|
| Technical build validation | Continuous | Joshua Atkinson |
| Pedagogical alignment audit | Biweekly Thursdays | Bertrand Laurence (SME) |
| UX testing with learners | Weeks 4 and 7 | Atkinson + students |
| Academic oversight | Midterm & Final | Dr. Jennifer Richardson |

### Student Role

Joshua Atkinson serves as Full-Stack Instructional Designer and Systems Architect: needs/learner analysis, curriculum writing (12 chapters), Web Audio engineering, LM Studio prompt engineering, visual systems design (CRAP), Kirkpatrick evaluation design, and business change management.

### Project Supervisor

**Bertrand Laurence** — Owner, Bertrand Laurence Guitar Studio  
Email: bertlarrymusic@gmail.com | Phone: 617-447-5575  
Teaches at Passim School of Music, Cambridge, MA. Acts as SME, reviews builds biweekly, and retains full IP rights to his proprietary protocols.

---

## Part 2: Practicum Project Plan

| Wk | Phase | Hrs | Key Tasks |
|----|-------|-----|-----------|
| 1 | Analysis | 12 | SME needs analysis; 12-chapter layout; repo setup; LM Studio config |
| 2 | Prototyping | 14 | StudioPage; i18n engine; Chapters 1–4 |
| 3 | Core I | 12 | Web Audio engine; Vertiscale prototype; SME Review #1 |
| 4 | Core II | 10 | PlingTrainer; Chapters 5–8; first UX test |
| 5 | AI Infra | 10 | LM Studio API; Socratic prompts; SME Review #2 |
| 6 | Media | 8 | PracticeRecorder; Mentor Dashboard |
| 7 | Refine | 9 | Chapters 9–12; second UX test; performance review |
| 8 | Deploy | 8 | Production build; Stripe verification; SME handoff |
| | **Total** | **83** | |

All tasks led by Joshua Atkinson; Bertrand Laurence provides SME review at Weeks 3, 5, and 8.

---

## Part 3: Supervisor Sign-Off

I, Bertrand Laurence, have reviewed this project proposal and agree to the scope, timeline, and deliverables outlined above. I understand my role as Subject Matter Expert and commit to providing pedagogical guidance, pricing decisions, and biweekly feedback during Thursday review sessions.

Supervisor Signature: ______________________________     Date: _______________

Printed Name: Bertrand Laurence
Position: Owner, Bertrand Laurence Guitar Studio
Email: bertlarrymusic@gmail.com | Phone: 617-447-5575

---

**Course Instructor:** Dr. Jennifer Richardson — EDCI 57300 Practicum, Purdue University
