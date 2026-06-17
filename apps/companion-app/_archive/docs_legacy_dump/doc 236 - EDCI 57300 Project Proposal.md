# EDCI 57300 — Assignment 2: Project Proposal

**Student:** Joshua Atkinson  
**Course:** EDCI 57300 Practicum  
**Instructor:** Dr. Jennifer Richardson  
**Date:** May 25, 2026 (Revised — per instructor feedback)  
**Project:** Voix Vive — Somatic Guitar Mentorship Platform

> **Revision Note:** Updated per Dr. Richardson's feedback to (1) clarify practicum hour scope, (2) add specific measurable goals grounded in Flow theory and audiation research, (3) provide supervisor contact information, and (4) formally describe the ID model. LM Studio / DaaS AI infrastructure added as a core deliverable.

---

## Part 1: Narrative Proposal

### Project Description

Voix Vive ("The Living Voice") is a web-based guitar mentorship platform designed for master guitarist and vocalist Bertrand Laurence. The platform is built on a single philosophical premise: **the student is not a broken instrument waiting to be repaired — they are the song that has not yet fully sounded.** Every design decision flows from this distinction. Where conventional guitar apps measure deficits, Voix Vive measures expansion — the growing range, sensitivity, and expressiveness of a musician becoming more fully themselves.

The platform implements Bertrand's proprietary somatic pedagogy through a 12-chapter "Living Textbook" structured as the fusion of the Hero's Journey and the western chromatic scale. Unlike applications built on dopamine-loop gamification, Voix Vive operates on the philosophy of the "Slow Web" — creating conditions for contemplation, somatic awareness, and genuine musical self-discovery.

**The platform consists of four integrated layers:**

1. **The Living Textbook** — A free, 12-chapter swipeable curriculum (Frets 1-12) mapping the chromatic scale to Hero's Journey stages (Call to Adventure → Master of Two Worlds). Each chapter includes original artwork, pedagogical slides, historical context ("Timeless Songs"), and interactive exercises grounded in audiation theory (Gordon, 1997).

2. **The Troubadour Playbook** — A suite of 12 interactive practice tools mapped to fret positions, implementing Bertrand's three proprietary protocols: ©SHEARL (See/Hear/Feel), ©PLING! (Sing & Play), and ©FHEAL (Feel/Hear/Express/Act/Live). Tools include real-time pitch detection, interval training, breathing gates, metronomes, and the Vertiscale Imagination Engine — a three-phase spatial memory game training the Inner Fretboard, Inner Ear, and Inner Voice.

3. **The Studio** — A business landing page connecting students to live Zoom lessons, async video coaching, Inner Circle membership, group workshops, and gift certificates. All Living Textbook content is permanently free; the Studio is where the student-instructor relationship deepens.

4. **The AI Coaching Infrastructure (DaaS — Desktop as a Service)** — A locally-hosted AI layer connecting the platform to a sovereign, financially independent coaching backend. Using LM Studio (port 1234) as the primary inference engine with a custom Axum HTTP bridge (port 8080) as fallback, the platform delivers Socratic coaching, practice feedback, and songwriting support without cloud API costs or recurring AI subscription fees. This is the technological heart of a financially self-sustaining instructional system — gifted instructors supported by practical, economically independent systems engineering rather than extractive SaaS subscriptions.

The web platform is built with React 18, Vite, and Tailwind CSS, deployed on Vercel at voix-vive.com, with offline-first capabilities via Dexie/IndexedDB.

### Organization Description

**Bertrand Laurence Guitar Studio** is an independent music education practice operated by Bertrand Laurence, a master guitarist and vocalist with training from MassArt and Mirage Mime Theatre. Bertrand has developed a proprietary somatic philosophy called "Somatic Mystic" and three training protocols (©SHEARL, ©PLING!, ©FHEAL) that form the core of his teaching method.

Located in Houlton, Maine (relocated from the Cambridge/Boston area), Bertrand operates as a solo practitioner offering private lessons, group classes through Passim School of Music, and online coaching via Thumbtack (where he has received the Top Pro award for multiple years). His client base includes adult learners aged 30-65, many of whom have previously attempted to learn guitar but stopped due to performance anxiety, inner critic dominance, and teaching methods designed for children rather than adults.

The studio operates under a freemium model: the 12-chapter Living Textbook is completely free and serves as a culture-building marketing funnel, while revenue is generated through paid services (live coaching, async feedback, membership, and workshops). Bertrand has family in France he has not visited in years, making revenue generation a critical personal priority.

**Contact Information:**
- **Name:** Bertrand Laurence
- **Position:** Owner, Master Guitar Instructor
- **Email:** bertlarrymusic@gmail.com
- **Phone:** 617-447-5575
- **Address:** 148 Richdale Ave, Cambridge MA 02140
- **Website:** https://voix-vive.com

### Project Goals and Deliverables

**A Note on Framing:** Goals below are written in the language of *becoming*, not *remediation* — aligned with Bertrand's Somatic Mystic framework and supported by transpersonal psychology (Maslow, 1964), Flow theory (Csikszentmihalyi, 1990), and Music Learning Theory (Gordon, 1997). The student is not broken. The student is the song that has not yet fully sounded. Measurement tracks expansion, not deficit reduction.

**Primary Goal:** Design, develop, and deploy an integrated web platform and AI coaching infrastructure that expands the expressive and musical range of adult guitar students, creates a financially self-sustaining income stream for Bertrand Laurence, and demonstrates a replicable model for economically independent instructional technology serving gifted independent educators.

**Measurable Goals — Expansion Metrics:**

| Goal | Theoretical Grounding | Measurement Instrument | Target |
|------|-----------------------|----------------------|--------|
| **Audiation Depth** — Students can internally hear a scale pattern before executing it on the fretboard | Gordon (1997) Music Learning Theory — audiation as the cognitive foundation of musical performance | Vertiscale Engine: % of pattern notes correctly placed from memory (Flash mode), averaged across 5 sessions | ≥ 60% placement accuracy by Session 5, vs. ≤ 30% at Session 1 |
| **Flow State Frequency** — Students experience absorbed, effortless engagement during practice | Csikszentmihalyi (1990) Flow Theory — challenge-skill balance, loss of self-consciousness, intrinsic motivation | Post-session self-report: “I lost track of time during this practice” (1–5 Likert), logged via FHEAL Reflection journal | Mean score ≥ 3.5/5 sustained across 4 consecutive weeks |
| **Somatic Range Expansion** — Students report greater body sensitivity and responsiveness during playing | Hanna (1988) Somatics; Feldenkrais (1972) — somatic competence as expanding range, not eliminating symptoms | Pre/post session self-rating: breath depth, hand softness, shoulder ease (1–10 each), captured in FHEAL Reflection | Mean composite score increases ≥ 2 points from Session 1 to Session 8 |
| **Pitch Internalization** — Students narrow the gap between the note imagined and the note produced | ©PLING! Protocol; audiation theory; PlingTrainer microphone pitch detection | Cents deviation from target pitch (real-time, PlingTrainer), averaged across 10 trials per session | ≥ 20% reduction in mean absolute cents deviation from Week 1 to Week 4 |
| **Practice Sovereignty** — Students practice independently without instructor prompting | Self-Determination Theory (Deci & Ryan, 1985) — intrinsic motivation, autonomy | Sessions logged to Dexie/IndexedDB: self-initiated sessions per week | ≥ 3 self-initiated sessions/week sustained over 4 weeks |
| **Platform Technical Integrity** | ADDIECRAPEYE EYE phase — build validation | `npm run build` exit code 0; all 12 tool routes render without runtime errors | 100% build success across all phases |
| **Instructor Financial Sovereignty** — AI coaching operates at zero cloud cost | Systems engineering goal — economically independent instructional infrastructure | LM Studio inference connection verified (port 1234); AI coaching responses delivered without external API calls | Local inference operational; $0/query cloud cost |

**Final Deliverables (Artifacts):**

*Note on practicum hours: The platform is Bertrand Laurence’s living, self-paced instructional product — it does not terminate at the practicum boundary. My practicum contribution (~80 hours) covers Phases 0–2 below. Phases 3–5 are post-practicum, funded by platform revenue and documented in ROADMAP.md.*

**Practicum Scope (Phases 0–2):**
1. **Living Textbook** — 12-chapter swipeable curriculum with original artwork, pedagogical slides, and Timeless Song historical context *(Complete)*
2. **12 Interactive Practice Tools** — Breathing Gate, PlingTrainer, PitchRoom, Interval Visualizer, Vertiscale Engine, Metronome, Songwriting Companion, and 5 additional protocol tools *(Complete)*
3. **Vertiscale Imagination Engine** — Three-phase game (Flash → Imagine → Reflect) with per-session scoring, AI coaching cues, and FHEAL Reflection journal *(Complete)*
4. **Troubadour Adventure** — 12-scene pitch-gated narrative with bilingual (EN/FR) support *(Complete)*
5. **StudioPage Business Landing** — Service offerings, pricing, testimonials, FAQ, payment integration *(Complete)*
6. **Bilingual i18n System** — Custom `useLocale` hook with 340+ EN/FR translation keys covering all UI surfaces *(Complete)*
7. **Deployment** — Vercel at voix-vive.com, DNS configured, SSL verified *(Complete)*
8. **AI Coaching Infrastructure (DaaS)** — LM Studio (port 1234) as primary AI backend; custom `useBackendBridge` hook routing Socratic coaching through local inference; bilingual AI system prompts grounded in Bertrand’s somatic protocols; DaaS server (port 8080) as async fallback *(In progress — Week 2)*
9. **Async Coaching Pipeline** — PracticeRecorder video/audio capture, IndexedDB submission outbox, Mentor Review Dashboard *(Week 2)*
10. **Pedagogical Design Documentation** — ROADMAP.md, DESIGN.md, this proposal *(Ongoing)*

**Post-Practicum Scope (Phases 3–5, funded by revenue):**
- French curriculum translation (12 chapters of chapterData.js)
- Troubadour AI Evaluation System (Bronze/Silver/Gold tiers)
- Inner Circle Membership + Workshop Calendar
- Android PWA conversion

### ID Model and Evaluation Model

**Primary ID Model: ADDIECRAPEYE** *(practitioner-developed framework by Joshua Atkinson, 2026)*

ADDIECRAPEYE is a 12-phase, 3-layer instructional systems design framework created to govern complex, multi-stakeholder educational technology projects. It is documented in full in the *TRINITY ID AI OS Technical Bible* (Atkinson, 2026). The framework’s closest academic parallel is **Rapid Prototyping** (Jones & Richey, 1994), which it extends with explicit visual systems architecture principles (CRAP) and real-time evaluation telemetry (EYE). Like Rapid Prototyping, ADDIECRAPEYE treats working artifacts as the primary medium for SME review and uses iterative stakeholder feedback cycles rather than linear front-end analysis.

The framework is structured as three interlocking layers of four phases each — mapped isomorphically to the 12-tone chromatic scale, the 12-chapter curriculum, and the 12 interactive tools of Voix Vive. This isomorphism is pedagogically intentional: the framework that built the system *is* the system.

**Layer 1 — ADDIE: Extract the Wisdom** *(What are we building, and for whom?)*

| Phase | Application to Voix Vive |
|-------|-------------------------|
| **A — Analyze** | Datamined Bertrand’s YouTube, DuetPartner, and Thumbtack presence; reviewed 10+ years of Passim School curricula; built adult learner persona (ages 30–65, prior quit history, inner critic dominance, fragmented practice time) |
| **D — Design** | Backward-mapped 12-fret Hero’s Journey to protocol gates (©SHEARL → ©PLING! → ©FHEAL); established expansion-based exit criteria per chapter; selected anti-dopamine “Slow Web” philosophy as strategic differentiator |
| **D — Develop** | Built all artifacts: SlideViewer, VertiscaleEngine, Troubadour Adventure, 36 Timeless Song slides, 28 concept cards, 12 interactive tools, LM Studio AI coaching bridge |
| **I — Implement** | Staged to Vercel PWA at voix-vive.com; mobile-first, touch-optimized, bilingual (EN/FR), offline-first via Dexie/IndexedDB |
| **E — Evaluate** | Weekly `npm run build` validation; Joshua as proxy learner across all 12 tools; biweekly Bertrand walkthroughs; session telemetry via tractionStore |

**Layer 2 — CRAP: Place the Wisdom** *(How does it look, feel, and hold together?)*

Robin Williams’ (2004) visual design principles applied as architectural constraints across all UI decisions:

| Principle | Application |
|-----------|-------------|
| **C — Contrast** | Gold (#c9a96e) on near-black (#0a0d14), WCAG AA compliant; 72px hero type → 11px metadata — visual hierarchy signaling contemplation over urgency |
| **R — Repetition** | Consistent design tokens (`--bard-gold`); two-font system (Cormorant Garamond for narrative warmth, JetBrains Mono for technical precision); identical card geometry across all 12 fret tools |
| **A — Alignment** | Single-column max-width layout on mobile; CSS Grid for fretboard tools; horizontal stat card alignment in game summaries |
| **P — Proximity** | 24px+ section margins creating “breathing room” that physically enacts the somatic pacing philosophy; 8–12px gaps within related UI clusters |

**Layer 3 — EYE: Refine the Wisdom** *(Is it working, and where does it go next?)*

| Phase | Application |
|-------|-------------|
| **E — Envision** | Long-horizon vision in ROADMAP.md — moonshots (VR classroom, Android PWA, AI evaluation tiers) gated behind revenue proof; post-practicum phases funded by platform income |
| **Y — Yoke** | AI coaching infrastructure (LM Studio + DaaS) yoked to the web platform — the instructor’s knowledge economized into a locally-sovereign inference layer with zero marginal cost per query |
| **E — Evolve** | Session telemetry (tractionStore + Dexie) feeds longitudinal expansion data; FHEAL Reflection journals surface qualitative growth patterns; revenue metrics confirm market validation before next phase begins |

**Secondary Framework: PEARL** *(Perspective Engineering, Aesthetic Research, Layout — Atkinson, 2026)*

PEARL is a project-focusing document and agent protocol that defines the creative vision, pedagogical constraints, and aesthetic boundaries for a given instructional system *before* development begins. For Voix Vive, the PEARL articulates: the “song that never ends” philosophy, the Three Inners framework (Inner Fretboard / Inner Ear / Inner Voice), the anti-dopamine design contract, Bertrand’s somatic protocols as the content spine, and the bilingual Francophone market as secondary audience. All design decisions — visual, structural, and pedagogical — are evaluated against the PEARL throughout the ADDIECRAPEYE lifecycle.

**Evaluation Model: Kirkpatrick’s Four Levels** *(adapted for somatic pedagogy and expansion-first framing)*

| Level | Label | Voix Vive Application | Instrument |
|-------|-------|-----------------------|------------|
| **1** | Reaction | Student somatic state during and after practice — body ease, breath depth, presence | FHEAL Reflection journal (pre/post session self-report, 1–10 composite) |
| **2** | Learning | Audiation depth (Vertiscale placement accuracy Δ), pitch internalization (PlingTrainer cents deviation Δ), somatic range expansion (composite body score Δ) | Dexie/IndexedDB session logs; tractionStore telemetry |
| **3** | Behavior Transfer | Self-initiated practice frequency (sessions/week), session duration, tool engagement breadth | IndexedDB session frequency; tool usage heatmap |
| **4** | Results | Instructor revenue (Stripe/Venmo monthly); AI coaching cost ($0/query via local LM Studio vs. cloud baseline); student return rate | Stripe dashboard; inference logs confirming local-only execution |

### How the Project Fits Within the Organization

Voix Vive is not a peripheral tool — it is the **digital transformation and financial liberation of Bertrand Laurence’s teaching practice.** The platform operationalizes his somatic philosophy, scales his proprietary protocols beyond 1:1 lessons, and — critically — gives him AI coaching capability with zero ongoing cloud subscription costs.

This matters because the dominant model in educational technology extracts revenue from instructors: monthly SaaS fees for tools, per-query costs for AI, platform commissions on student payments. Voix Vive inverts this. The AI coaching layer runs locally via LM Studio on the instructor’s machine, generating zero marginal cost per student interaction. Revenue flows to Bertrand, not to intermediaries.

The platform serves four strategic functions within Bertrand Laurence Guitar Studio:

1. **Marketing Funnel** — The free Living Textbook attracts organic traffic via SEO (JSON-LD structured data, Open Graph metadata), builds trust through Bertrand's pedagogical content, and converts browsers into paying students through the StudioPage

2. **Practice Companion** — The 12 tools and Vertiscale Engine extend Bertrand's teaching into students' daily practice, reinforcing ©SHEARL, ©PLING!, and ©FHEAL protocols between lessons and deepening the student’s inner musical world

3. **AI Coaching Partner** — The LM Studio / DaaS infrastructure provides Socratic guidance, songwriting assistance, and practice feedback 24/7 using a system prompt grounded in Bertrand’s actual somatic philosophy — not generic guitar advice from a cloud chatbot

4. **Revenue Engine** — The à la carte + membership model generates income from live lessons, async coaching, and community membership; combined with zero AI overhead costs, this demonstrates a replicable model for financially sovereign independent instructors

The project fits within a larger vision (ROADMAP.md) that includes Android PWA, VR Guitar Classroom, and Roblox Music World — all gated behind revenue proof. This sequencing ensures the platform funds its own expansion rather than requiring speculative investment.

### Evaluation Plan

**How the project will be evaluated:**

1. **Technical Validation** — Continuous build testing (`npm run build`), browser compatibility testing (Chrome/Safari mobile), offline functionality verification (IndexedDB persistence)

2. **Pedagogical Alignment** — Weekly curriculum audits against the Master Design Doc to ensure tools implement ©SHEARL, ©PLING!, and ©FHEAL protocols as specified

3. **User Experience Testing** — Novice usability testing (Joshua as proxy learner) identifying friction points, confusing UI flows, or broken interactions

4. **Stakeholder Review** — Biweekly walkthroughs with Bertrand Laurence to confirm pedagogical accuracy, pricing alignment, and feature prioritization

5. **Revenue Metrics** — Tracking conversion rates (free textbook → paid services), average revenue per user, and month-over-month growth against projections in ROADMAP.md

**When evaluation will occur:**

- **Continuous:** Automated build tests, telemetry logging, error boundary monitoring
- **Weekly:** Pedagogical alignment audits, UX friction review
- **Biweekly:** Stakeholder review with Bertrand (Thursday calls)
- **Phase Gates:** Evaluation at end of each development phase (Phase 1-6) before proceeding to next phase
- **Post-Launch:** 30-day, 60-day, and 90-day revenue and retention analysis

**Who will evaluate:**

- **Technical Evaluation:** Joshua Atkinson (developer/architect)
- **Pedagogical Evaluation:** Bertrand Laurence (SME/subject matter expert)
- **UX Evaluation:** Joshua Atkinson (proxy learner) + Bertrand Laurence (authentic learner perspective)
- **Business Evaluation:** Bertrand Laurence (revenue targets, pricing decisions)
- **Academic Evaluation:** Dr. Jennifer Richardson (course instructor, practicum oversight)

### Student Role and ID/HPT Skills Utilized

**My Role:** Full-Stack Instructional Designer and Systems Architect

I am responsible for the complete design, development, and deployment of the Voix Vive platform. This includes:

- **Instructional Design:** Translating Bertrand's somatic pedagogy into structured curriculum (12-chapter monomyth), mapping content to Bloom's Taxonomy, designing protocol gates (©SHEARL → ©PLING! → ©FHEAL), and creating measurable exit criteria per chapter

- **Visual Systems Architecture:** Applying CRAP principles (Contrast, Repetition, Alignment, Proximity) to create a cohesive, accessible, and aesthetically appropriate interface that embodies the "Slow Web" philosophy

- **Full-Stack Development:** Building the React frontend, implementing 12 interactive tools with Web Audio API, creating the Vertiscale Imagination Engine with real-time pitch detection, integrating Stripe payment links, and configuring Vercel deployment

- **Project Management:** Executing revenue-first sequencing (Phases 1-6), managing stakeholder communication with Bertrand, documenting architectural decisions, and maintaining the ADDIECRAPEYE lifecycle

**ID/HPT Skills Utilized:**

1. **Needs Analysis** — Datamined Bertrand's digital presence (YouTube, DuetPartner, Thumbtack) to identify learner persona, pain points, and market positioning

2. **Task Analysis** — Decomposed Bertrand's somatic protocols into discrete, measurable sub-skills (e.g., ©PLING! requires pitch internalization → vocal production → motor coordination → feedback loop)

3. **Learner Analysis** — Built detailed learner profile (adults 30-65, prior quit history, inner critic dominance, fragmented time) to inform anti-dopamine design decisions

4. **Instructional Strategy Design** — Chose somatic-first approach over conventional technique-first methods; implemented Yin/Yang dual-coding; selected Hero's Journey × Chromatic Scale macro-structure

5. **Content Development** — Wrote 12-chapter curriculum, 36 Timeless Song historical slides, 28 concept cards, and 918-line Troubadour adventure narrative

6. **Evaluation Design** — Created multi-level evaluation model (Kirkpatrick + somatic metrics), designed anti-dopamine scoring system (accuracy over speed), implemented session logging and reflection prompts

7. **Technology Integration** — Selected appropriate tech stack (React + Vite + Web Audio + Dexie), integrated open-source libraries (pitch detection, fretboard visualization), configured PWA offline capabilities

8. **Project Management** — Executed 8-week phased development plan, managed stakeholder expectations, documented architectural decisions, maintained scope discipline (revenue-first sequencing)

9. **Change Management** — Facilitated Bertrand's transition from 1:1 teaching to digital platform, prepared him for Stripe setup and pricing decisions, structured Thursday review calls for feedback incorporation

10. **Performance Support** — Designed 12 tools as distributed performance support extending Bertrand's teaching into daily student life

11. **Systems Engineering** — Designed a financially independent instructional system: zero cloud AI cost via local LM Studio inference, freemium marketing funnel, revenue-gated expansion sequencing — a replicable architecture for gifted independent educators who should own their tools, not rent them

### Project Supervisor

**Name:** Bertrand Laurence  
**Position:** Owner, Master Guitar Instructor, Bertrand Laurence Guitar Studio  
**Relationship:** Subject Matter Expert (SME), Client Stakeholder, Pedagogical Authority  
**Contact Information:**
- **Email:** bertlarrymusic@gmail.com
- **Phone:** 617-447-5575
- **Address:** 148 Richdale Ave, Cambridge MA 02140
- **YouTube:** @BertrandLaurenceMusic
- **Studio:** https://bertrandguitarstudio.duetpartner.com/
- **Platform:** https://voix-vive.com

**Supervisor Role:** Bertrand provides pedagogical direction, approves curriculum content, validates pricing decisions, and reviews platform builds during biweekly Thursday calls. He owns all IP (©SHEARL, ©PLING!, ©FHEAL, curriculum content, trademarks) and will make final decisions on licensing, launch timing, and feature prioritization.

### Thursday Review Process

**Scheduled Review:** Thursday, May 22, 2026  
**Duration:** ~45 minutes  
**Format:** Phone walkthrough on Bertrand's mobile device (mobile-first design verification)

**Walkthrough Structure:**

1. **Landing Page (2 min)** — Onboarding flow, three-portal hub (Song → Guitar → Player), safety messaging
2. **The Song — Living Textbook (5 min)** — Swipe through Frets 1-12, AI artwork, pedagogical slides, Timeless Song historical context
3. **Troubadour Adventure (3 min)** — 12-scene pitch-gated narrative, mentor line, pitch gate mechanics
4. **The Guitar — Vertiscale Engine (5 min)** — 12-fret menu, Flash mode gameplay, scale pattern selection
5. **The Player — Digital Binder (3 min)** — 12 tools grid, Breathing Gate, PLING! Trainer
6. **The Studio — Revenue Layer (5 min)** — Service cards, pricing, testimonials, payment methods

**Decisions Required from Bertrand:**

- Lesson pricing confirmation ($65 single, $55×5, $50×10)
- Inner Circle membership pricing ($25/mo or $199/yr)
- Quick Question pricing ($5 single)
- Video Review pricing ($15 Mini, $35 Full)
- Stripe account creation and payment link generation
- Venmo QR code provision
- Go-live timing decision
- License decision (open source, proprietary, or hybrid)
- French translation approach for branded terms (©PLING!, ©SHEARL, ©FHEAL)

**Open Questions for Pedagogical Alignment:**

- Does the "self-discovery arc" framing resonate? (Safety → Commitment → Listening → Spatial → Integration → Mastery → Freedom)
- Which tools should be demonstrated to students first?
- Welcome video on landing page — desired or not?
- Timeless Song historical slides — any additions or changes?
- Inner Voice curriculum integration approach

---

## Part 2: Practicum Project Plan

*The practicum contribution is approximately 80 hours, covering Phases 0–2. The platform is Bertrand Laurence’s living, self-paced instructional product and continues beyond the practicum boundary. Phases 3–5 are post-practicum, funded by platform revenue.*

| Artifact/Deliverable | Description | Est. Hours | Responsibility | Status |
|---------------------|-------------|-----------|----------------|--------|
| **Phase 0: Foundation** | | | | |
| Living Textbook (12 chapters) | Swipeable curriculum with original artwork, pedagogical slides, Timeless Song historical context | 40 | Joshua | ✅ Complete |
| StudioPage Business Landing | Service offerings, pricing, testimonials, FAQ, payment grid | 20 | Joshua | ✅ Complete |
| 12 Interactive Tools Suite | Breathing Gate, PlingTrainer, PitchRoom, Metronome, Interval Visualizer, Songwriting Companion, etc. | 35 | Joshua | ✅ Complete |
| **Phase 1: Stakeholder Review** | | | | |
| Vertiscale Imagination Engine | Three-phase game (Flash → Imagine → Reflect) with scoring, AI coaching cues, FHEAL journal | 25 | Joshua | ✅ Complete |
| Troubadour Adventure | 12-scene pitch-gated narrative wired into landing page as overlay | 20 | Joshua | ✅ Complete |
| Bilingual i18n System | Custom useLocale.js hook with 340+ EN/FR translation keys, language toggle, locale persistence | 15 | Joshua | ✅ Complete |
| Thursday Review Call | Walkthrough with Bertrand, pricing confirmation, pedagogical alignment | 2 | Both | ✅ Complete (May 22) |
| **Phase 2: AI Infrastructure + Revenue Pipeline** | | | | |
| AI Coaching Infrastructure (DaaS) | LM Studio (port 1234) primary inference; useBackendBridge hook; bilingual Socratic system prompts; DaaS fallback (port 8080) | 10 | Joshua | 🔄 In Progress |
| Stripe Account Setup | Bertrand creates Stripe account, generates payment links | 2 | Bertrand | ⏳ Pending |
| Payment Link Integration | Wire Stripe URLs into pricingData.js | 3 | Joshua | ⏳ Pending |
| Domain + DNS Configuration | voix-vive.com DNS → Vercel, SSL verification | 2 | Joshua | ✅ Complete |
| PracticeRecorder Upload Pipeline | Cloudflare R2 integration for video/audio submission | 12 | Joshua | Week 2 |
| Mentor Review Dashboard | Bertrand-side interface for reviewing student submissions | 10 | Joshua | Week 2 |
| Email Notification System | Resend integration for submission alerts | 5 | Joshua | Week 2 |
| **Phase 3–5: Post-Practicum (funded by revenue)** | | | | |
| French Curriculum Translation | Translate chapterData.js (12 chapters) with Bertrand | 20 | Joshua + Bertrand | Post-practicum |
| Troubadour AI Evaluation System | Bronze/Silver/Gold evaluation tiers with audio analysis | 45 | Joshua | Post-practicum |
| Inner Circle Membership + Workshops | Stripe recurring billing, member perks, workshop calendar | 32 | Joshua | Post-practicum |
| Android PWA Conversion | Native-feeling mobile app via PWA manifest + service worker | 15 | Joshua | Post-practicum |
| **Documentation** | | | | |
| ROADMAP.md + DESIGN.md | Development timeline, architectural decisions, revenue projections | 8 | Joshua | ✅ Ongoing |
| This Proposal | Practicum documentation per EDCI 57300 requirements | 4 | Joshua | ✅ Complete |
| **Practicum Total (Phases 0–2)** | | **~83 hours** | | **Weeks 1–2** |

---

## Part 3: Constraints and Potential Problems

### Technical Constraints

1. **Browser Audio Latency** — Web Audio API pitch detection introduces ~46ms latency at 2048 sample buffer. Mitigation: Use AudioWorklet with Rust/WASM (autopitch library) for sub-10ms latency in future iterations.

2. **Mobile Browser Compatibility** — iOS Safari has stricter microphone permissions and background audio restrictions than Android Chrome. Mitigation: Extensive testing on both platforms, graceful degradation for unsupported features.

3. **Offline Storage Limits** — IndexedDB has storage quotas (varies by browser, ~50MB-250MB). Video submissions may exceed limits. Mitigation: Cloudflare R2 upload pipeline (Phase 2) moves large files to cloud storage.

4. **Stripe Account Setup** — Bertrand has not yet created a Stripe account. Without it, online payments cannot be processed. Mitigation: Prioritize this in Phase 2, use Venmo/PayPal as fallback during transition.

### Pedagogical Constraints

1. **Somatic Measurement Difficulty** — Breath tension, shoulder relaxation, and somatic ease are subjective states difficult to measure objectively via web sensors. Mitigation: Self-reported journal prompts in Phase 3 Reflect, breath continuity via microphone amplitude envelope.

2. **Anti-Dopamine Design Trade-off** — Deliberately slow transitions and absence of speed metrics may reduce engagement for students expecting gamified progression. Mitigation: Emphasize "quality over speed" in onboarding, use soft ambient glow rewards instead of flashy streaks.

3. **Protocol Learning Curve** — ©SHEARL, ©PLING!, and ©FHEAL are novel concepts for most students. Without proper scaffolding, they may be misunderstood as abstract rather than practical. Mitigation: Concrete examples in slides, tool descriptions, and Troubadour adventure narrative.

### Business Constraints

1. **Revenue-First Sequencing Pressure** — Moonshots (Android App, VR Classroom, Roblox) are gated behind revenue proof. If Phase 2-6 revenue targets are not met, platform expansion stalls. Mitigation: Conservative revenue projections, multiple revenue streams (à la carte + membership), focus on high-conversion low-barrier offerings ($5 Quick Questions).

2. **Bertrand's Time Availability** — Async coaching and AI evaluation depend on Bertrand's availability for reviews. If demand exceeds capacity, response times may degrade. Mitigation: Troubadour AI reduces per-review time (20 min → 5 min), tiered pricing manages demand, Inner Circle membership provides priority queue.

3. **French Market Uncertainty** — Francophone expansion (Phase 3) assumes demand exists in Quebec, Louisiana, France, Belgium, and West Africa. If conversion is low, translation investment may not yield ROI. Mitigation: Phase 3 is positioned after revenue proof (Phase 2), allowing data-driven decision on French prioritization.

### Personal Constraints

1. **Learning New Technology Warning** — Assignment cautions against learning totally new technology during practicum. Mitigation: Tech stack (React, Vite, Tailwind, Web Audio) is within my existing competency. Rust/WASM for audio processing is the only new technology, and it is optional (can defer to Phase 7+ moonshots).

2. **Scope Creep Risk** — Project has extensive moonshot vision (VR, Roblox, Android). Mitigation: Strict revenue-first sequencing documented in ROADMAP.md, phase gates prevent proceeding without revenue validation, ADDIECRAPEYE framework enforces structural validation before visual expansion.

3. **Stakeholder Communication** — Bertrand's availability for Thursday calls may vary. If feedback is delayed, development decisions may be made without SME validation. Mitigation: Async communication via email/text for smaller decisions, reserve Thursday calls for major architectural/pedagogical decisions.

---

## Part 4: Market Context and Financial Projections

This section grounds the project's economic claims in third-party industry data. The financial sovereignty thesis — that gifted independent instructors can own their tools rather than rent them via SaaS subscriptions — is examined here against current market benchmarks rather than asserted as opinion.

### 4.1 Market Size and Growth

| Metric | Value | Source |
|--------|-------|--------|
| Global Online Music Education Market (2026) | **$4.61 billion USD** | Mordor Intelligence (2026) |
| Projected Market Size (2031) | **$9.36 billion USD** | Mordor Intelligence — CAGR 15.23% |
| App-based interface share of revenue | **51.3%** | Mordor Intelligence (2026) |
| Fender Play subscriber growth (2018→2020) | **150,000 → 930,000** subscribers (6.2× in 2 years) | Insure4Music industry analysis |
| US Private Music Teacher avg. hourly rate | **$51.41/hr** | PayScale (2026) |
| Healthy freemium → paid conversion rate | **2–5%** typical; **5%+** considered strong | SaaS industry benchmarks (Umbrex, 2024) |
| Online course visitor → enrollment conversion | **2–5%** average | Online course industry benchmarks |

**Implication:** Voix Vive operates in a verified high-growth market with a documented appetite for app-based instruction. The differentiation strategy (somatic, anti-dopamine, adult-focused, master-instructor-led) addresses a segment that mass-market gamified competitors (Yousician, Fender Play, Simply Guitar) explicitly avoid.

### 4.2 Operating Cost Structure — The Sovereignty Advantage

The financial sovereignty thesis is *quantifiable*. Below is a side-by-side comparison of Voix Vive's operating costs versus a typical SaaS-based instructional platform serving the same student volume:

| Cost Category | Voix Vive (Local-First) | Typical SaaS Competitor |
|---------------|------------------------|------------------------|
| AI inference (per query) | **$0** (local LM Studio) | $0.01–$0.10 (OpenAI/Anthropic API) |
| AI monthly cost @ 1,000 student queries | **$0** | $200–$800 |
| Hosting | **$0** (Vercel hobby tier) | $50–$200/mo |
| Domain | $14/year | $14/year |
| Stripe payment processing | 2.9% + $0.30/txn | Same |
| Database | $0 (IndexedDB client-side) | $25–$100/mo (Postgres) |
| Email notifications | $0 (Resend free tier ≤ 3K/mo) | $30–$100/mo |
| **Effective Monthly OpEx** | **< $5** | **$305–$1,200+** |

**Net effect:** A typical SaaS competitor must generate $300–$1,200 per month in revenue *just to cover operating costs*. Voix Vive crosses break-even at approximately $5/month. Every dollar above that threshold is margin for Bertrand.

This is not an academic distinction — it is the difference between an independent instructor running a sustainable business and an independent instructor working for their cloud provider.

### 4.3 Conservative Year-One Revenue Projections

The projections below assume a **warm-traffic baseline** of 500–1,500 monthly visitors, achievable through Bertrand's existing audiences (Passim School of Music alumni, Thumbtack Top Pro listing, organic SEO via the free Living Textbook). They use industry-benchmark conversion rates (1–4%) rather than aspirational figures.

**Conservative Scenario — Month 6**

| Revenue Stream | Visitors/mo | Conversion | Customers/mo | Avg Price | Monthly Revenue |
|----------------|-------------|-----------|--------------|-----------|----------------|
| Free Textbook → $5 Quick Question | 500 | 4.0% | 20 | $5 | $100 |
| Free Textbook → $15 Mini Review | 500 | 1.5% | 7 | $15 | $105 |
| Free Textbook → $35 Full Review | 500 | 0.8% | 4 | $35 | $140 |
| Free Textbook → $65 Live Lesson | 500 | 1.0% | 5 | $65 | $325 |
| Inner Circle Membership ($25/mo) | — | — | 10 cumulative | $25 | $250 |
| **Conservative Month 6 Total** | | | | | **~$920/mo** |

**Realistic Scenario — Month 12** *(after SEO ramp + Bertrand's network activation)*

| Revenue Stream | Visitors/mo | Conversion | Monthly Revenue |
|----------------|-------------|-----------|----------------|
| Live Lessons ($65 × 8/mo) | 1,500 | 0.5% | $520 |
| Async Reviews ($15/$35 mixed, 12/mo avg) | 1,500 | 0.8% | $300 |
| Inner Circle Membership (25 members by month 12) | — | recurring | $625 |
| Quick Questions ($5 × 30/mo) | 1,500 | 2.0% | $150 |
| **Realistic Month 12 Total** | | | **~$1,595/mo (~$19,140/yr)** |

**Optimistic Scenario — Month 18** *(if anti-dopamine differentiation resonates and word-of-mouth compounds)*

A Year 2 trajectory of 50+ Inner Circle members + 15+ live lessons/mo + 30+ async reviews/mo would place monthly revenue at **$3,500–$5,000+**, comparable to a full private studio income — without geographic constraints, without per-student scheduling overhead, and without per-query AI costs.

### 4.4 Defensible Competitive Moat

What prevents a well-funded competitor from cloning Voix Vive?

| Moat Element | Description |
|--------------|-------------|
| **SME Authenticity** | Bertrand's MassArt + Mirage Mime training, 10+ years of Passim curriculum, Thumbtack Top Pro status — not replicable by any SaaS company |
| **Trademarked Pedagogy** | ©SHEARL, ©PLING!, ©FHEAL are Bertrand's IP — competitors cannot use the protocols, only imitate around them |
| **Philosophical Position** | Anti-dopamine "Slow Web" framing is an explicit market segment that gamified incumbents (Yousician, Fender Play) cannot pivot to without alienating their existing user base |
| **Adult-Learner Focus** | The 30–65 adult-learner segment with prior quit history is underserved; competitors target beginners, children, or hobbyist gamers |
| **Local-First Cost Structure** | Voix Vive can profitably serve 100 students at price points where SaaS competitors lose money — a structural cost advantage that compounds at scale |
| **Bilingual + Francophone Reach** | EN/FR support is built-in from day one, enabling Quebec, France, Belgium, Louisiana, and West African markets — a pipeline that English-only competitors cannot access |

---

## Part 5: Honest Self-Assessment

This section presents an unfiltered evaluation of project strengths and weaknesses, conducted by the student-architect (Joshua Atkinson) as a midpoint reality check before stakeholder review and academic submission.

### 5.1 Project Strengths

1. **Genuine Philosophical Differentiation** — The "song that never ends" framing combined with the somatic + adult-learner focus addresses a real market gap rather than competing on feature parity with gamified incumbents. This positioning is supported by Bertrand's actual teaching practice and is not retrofitted marketing language.

2. **Functional Product, Not a Deck** — The platform is shipped, builds clean (`npm run build` exits 0), and is deployed to a real domain (voix-vive.com). This places the project ahead of the majority of practicum projects which present concept artifacts rather than working systems.

3. **Defensible SME Moat** — Bertrand's training (MassArt, Mirage Mime), 10+ years of Passim curriculum, Thumbtack Top Pro status, and trademarked protocols (©SHEARL, ©PLING!, ©FHEAL) constitute a moat that no SaaS competitor can replicate by any amount of capital or engineering investment.

4. **Quantifiably Sovereign Cost Structure** — The local-first AI architecture (LM Studio + DaaS) is not a marketing claim — it is a verifiable architectural decision with a concrete dollar value (≥ $300/mo savings vs. SaaS-equivalent). This is the technical heart of the financial sovereignty thesis.

5. **Bilingual From Day One** — EN/FR support implemented at the architectural layer (`useLocale` hook with 340+ translation keys), not retrofitted. This unlocks Francophone markets that English-only competitors cannot access.

### 5.2 Project Weaknesses (Honest Assessment)

1. **No Real-User Validation Yet** — All measurable goals are theoretical until tested with authentic adult learners. Joshua-as-proxy-learner is a useful internal QA mechanism but does not substitute for genuine user data. **Even three real students testing the platform for four weeks would dramatically strengthen the evaluation plan and validate or invalidate the anti-dopamine hypothesis.**

2. **Acquisition Strategy is Underspecified** — The proposal mentions SEO and JSON-LD structured data, but the *specific path* by which the first 100 students arrive is not fully articulated. The most likely real answer is Bertrand's existing Thumbtack and Passim audiences — and this should be made explicit rather than implicit.

3. **Anti-Dopamine Design is a Hypothesis, Not a Settled Thesis** — The "Slow Web" bet may prove correct, partially correct, or commercially unsuccessful. The proposal should acknowledge this is a *testable hypothesis* the platform exists to evaluate, not a foregone conclusion. Honest intellectual posture strengthens academic credibility.

4. **Stripe and Payment Infrastructure are Pending** — Until Bertrand creates a Stripe account, the revenue projections in Part 4 cannot be tested. This is the #1 blocker preventing real-world validation of all Phase 2 metrics.

5. **No Comparative Pedagogical Study** — The proposal claims somatic methods produce different outcomes than technique-first methods, but does not directly compare student progress under Voix Vive against student progress under (for example) Fender Play or Justin Guitar. A comparative study would substantially strengthen Kirkpatrick Level 2 (Learning) claims, though it falls outside the practicum scope.

6. **Practicum Scope vs. Project Scope is Easy to Confuse** — The platform is Bertrand's living instructional product. The practicum is Joshua's 80-hour contribution within it. Without clear framing, evaluators may conflate the two and either over- or under-credit the practicum work.

### 5.3 Risk Register

| Risk | Severity | Likelihood | Mitigation |
|------|----------|-----------|------------|
| Bertrand does not create Stripe account in Week 2 | **High** (blocks all revenue testing) | Medium | Venmo + PayPal fallback; payment links can be wired in <1 hour once Stripe account exists |
| Anti-dopamine design fails to engage students | **High** (invalidates core thesis) | Medium | Soft ambient feedback (gold glow, FHEAL journal) preserves intrinsic motivation cues without dopamine loops; revisable based on user data |
| First students do not arrive (no organic traffic) | **High** (no revenue, no validation) | Medium | Bertrand's Thumbtack + Passim networks are warm-traffic seed; SEO + JSON-LD provides long-tail discovery; explicit student outreach in Phase 2 |
| LM Studio inference quality insufficient for coaching | Medium | Low | DaaS fallback (port 8080); ability to swap models within LM Studio without code changes |
| French translation quality issues from non-native review | Medium | Medium | Bertrand is a native French speaker; all FR content reviewed and approved by him before publication |
| Mobile browser audio permission failures (iOS Safari) | Medium | Medium | Already documented; fallback UI flows; tested on real devices in deployment verification |

---

## Part 6: Recommendations for Future Work

This section captures forward-looking guidance for both Bertrand Laurence (post-practicum platform stewardship) and Joshua Atkinson (continuation of architectural work into the broader TRINITY ID AI OS ecosystem).

### 6.1 Recommendations for Bertrand Laurence (Platform Owner)

> **A note on this section:** Bertrand is a brilliant creative thinker whose strengths are pattern recognition, somatic intuition, and pedagogical depth. This recommendations structure is intentionally designed to support a creative ADD/ADHD cognitive style — small, single-action tasks with clear time-boxes and unambiguous "done" criteria, organized by **decision** vs. **execution**, with the highest-leverage action surfaced first. The goal is to externalize the structure so Bertrand's big brain stays free to do what it does best: teach.
>
> **Format key:** ⏱ = time required • ✅ = how you know it's done • 🧠 = decision-only (no execution) • ⚡ = execution-only (no decision)

---

#### 🌅 The Single Most Important Task

> **⚡ Create the Stripe account.** That is it. That is the only thing that matters this week.
>
> ⏱ 20 minutes • ✅ Done when you can paste 7 payment-link URLs into a text file and email them to Joshua • Open https://dashboard.stripe.com/register
>
> Every other thing in this section is downstream of this one task. Do not start anything else on this list until this is done. If you only ever do one thing from this proposal, let it be this.

---

#### Phase A — This Week (the unlock list)

These four tasks unlock everything else. Do them in order. Do not skip ahead.

| # | Task | Type | ⏱ | ✅ Done When |
|---|------|------|---|------|
| A1 | **Create Stripe account** at dashboard.stripe.com/register using bertlarrymusic@gmail.com | ⚡ | 20 min | Account exists, email confirmed |
| A2 | **Generate 7 payment links** in Stripe (Quick Q $5, Mini Review $15, Full Review $35, Live Lesson $65, 5-pack $275, 10-pack $500, Inner Circle $25/mo) | ⚡ | 30 min | 7 URLs copied into a single email to Joshua |
| A3 | **Take a Venmo QR code screenshot** on your phone (Venmo app → "Me" tab → tap QR icon → screenshot) and text it to Joshua | ⚡ | 2 min | Joshua confirms he received the screenshot |
| A4 | **Sign and return this proposal** — print Part 7 (Supervisor Sign-Off), sign + date, scan or photograph, email back to Joshua | ⚡ | 10 min | Joshua confirms he has the signed page |

> **Total time for Phase A: ~1 hour.** That is the entire price of admission to running a real online business this year. It is less time than one student lesson.

---

#### Phase B — Weeks 2–4 (the warm-audience launch)

This is where revenue actually begins. Each task is one email, one post, or one phone call. No multi-step workflows.

| # | Task | Type | ⏱ | ✅ Done When |
|---|------|------|---|------|
| B1 | **Email your 5 favorite Thumbtack students** with the voix-vive.com link and a personal note (template provided by Joshua) | ⚡ | 30 min | 5 emails sent |
| B2 | **Post the voix-vive.com link on your YouTube channel** as a community post or pinned comment | ⚡ | 5 min | Post is live, link works |
| B3 | **Tell Passim School staff** about the platform (one email or one in-person mention) | ⚡ | 10 min | One person at Passim knows |
| B4 | **Identify 3 ideal pilot students** (current students you would teach for free in exchange for weekly feedback) | 🧠 | 15 min | 3 names written down |
| B5 | **Invite those 3 students to a free 4-week pilot** in exchange for honest weekly journal feedback | ⚡ | 30 min | All 3 said yes (or you found replacements) |

> **Why this matters:** The first 10 paying students will almost certainly come from people who already know you. Cold SEO takes 6+ months. Warm outreach takes 6 days. Trust the warm path first.

---

#### Phase C — Months 1–3 (the rhythm phase)

These are recurring habits, not one-off tasks. Pick the cadence that fits your life — weekly is ideal but biweekly is fine.

**🎬 Content rhythm (pick one slot per week and protect it):**
- Record one short YouTube video (5–10 minutes) on a single ©SHEARL, ©PLING!, or ©FHEAL concept
- Add a link to voix-vive.com in the description
- That is the entire content strategy. One video, one concept, one link. Don't overthink it.

**📓 Pilot student check-in rhythm (15 minutes per student per week):**
- Read their FHEAL journal entries
- Send one short voice memo response (not text — voice)
- Note one quote per student that could become a testimonial

**☕ Joshua check-in rhythm (one Thursday call every 2 weeks, 30 minutes):**
- Bring your top 3 questions (write them down before the call)
- Anything not on the list goes in a "next time" notebook
- Call ends on time even if you have more thoughts — the notebook holds them

---

#### Phase D — Decisions to make in Month 4 (not before)

> **🧠 These are decision-only items. Do NOT execute these until Month 4.** Putting them on the calendar now lets your brain stop revisiting them daily.

| # | Decision | When | Inputs Needed |
|---|----------|------|---------------|
| D1 | **Inner Circle pricing:** $25/mo vs. $199/yr vs. both? | End of Month 4 | At least 3 months of async coaching demand data |
| D2 | **Workshop pilot:** run one $40/seat Saturday workshop? | End of Month 4 | At least 5 expressions of interest from existing students |
| D3 | **French-language pilot session:** is there enough Francophone interest? | End of Month 4 | At least 2 French-speaking students or 1 outreach to Quebec/France |
| D4 | **Slow Web hypothesis check:** is the anti-dopamine framing resonating, or do students want some progress markers? | End of Month 6 | FHEAL journal data + pilot student interviews |

---

#### 🛟 The "I'm Overwhelmed" Protocol

If at any point this list feels like too much, here is the rule:

1. **Look only at the current Phase** (A, B, C, or D). Ignore the others.
2. **Within that Phase, do the lowest-numbered task first.** Don't choose. The list already chose for you.
3. **If even that feels like too much, do A1.** Just A1. That alone is worth the entire proposal.
4. **Text Joshua** if you're stuck. He can break any task into smaller pieces.

> Your job is the pedagogy and the music. The systems exist to serve that, not to compete with it. If the system is consuming more energy than the teaching, the system is broken — tell Joshua and he will fix it.

### 6.2 Recommendations for Joshua Atkinson (Student-Architect)

**Practicum Completion (Weeks 2–8):**

1. **Complete async coaching pipeline** — PracticeRecorder upload to Cloudflare R2, Mentor Review Dashboard, Resend email notifications. This closes the Phase 2 deliverable loop.
2. **Document the LM Studio + DaaS architecture** in DESIGN.md as a reference implementation other independent educators can adopt. This converts a project-specific tool into a portfolio-grade systems engineering artifact.
3. **Submit comparative analysis** of Voix Vive vs. Fender Play / Yousician / Justin Guitar as a supplementary practicum artifact — strengthens academic credibility and provides Bertrand a marketing asset.

**Post-Practicum (Months 1–6):**

4. **Conduct longitudinal evaluation study** with 5–10 real students over 12 weeks, measuring all seven goal metrics from Part 1 and publishing results as a research paper or conference submission. This is the most valuable post-practicum academic artifact possible.
5. **Open-source the somatic instructional framework** (with Bertrand's permission) — the LM Studio integration, the FHEAL journal architecture, the anti-dopamine evaluation system — as a reference template for other gifted independent instructors. This positions the Voix Vive architecture as the foundation of a broader movement, not a one-off custom build.
6. **Integrate Voix Vive into the TRINITY ID AI OS ecosystem** as a domain-specific PEARL implementation, demonstrating that the ADDIECRAPEYE framework scales across instructional domains (music, code, design, etc.).

**Long-Term (Year 2+):**

7. **Author practitioner-facing book** on the financial sovereignty model for independent instructors: how to build a $20K–$50K/year teaching business with $5/month operating costs. This is a saleable Substack series, conference talk, or book proposal.
8. **Build the next instructor case study** — replicate the Voix Vive architecture for a second domain expert (visual artist, language teacher, somatic therapist) and publish the comparative analysis.
9. **Pursue academic publication** of the ADDIECRAPEYE framework with Voix Vive as the case study. The framework is sufficiently rigorous to merit peer review in instructional design journals.

### 6.3 Recommendations for Joint Future Work (Joshua + Bertrand)

1. **Hold quarterly strategic reviews** (not just biweekly tactical Thursday calls) to evaluate platform direction, pricing, and pedagogical refinement.
2. **Co-author a pedagogical white paper** combining Bertrand's somatic philosophy with the systems architecture — a credibility artifact for both academic and commercial contexts.
3. **Develop a workshop curriculum** for other independent music instructors interested in adopting the Voix Vive model — Bertrand brings pedagogy, Joshua brings systems. This becomes a third revenue stream and broadens the financial sovereignty movement.
4. **Establish IP licensing framework** so other instructors can use Voix Vive's architectural approach (with attribution) while Bertrand retains exclusive rights to ©SHEARL, ©PLING!, and ©FHEAL.

---

## Supervisor Sign-Off

**I, Bertrand Laurence, have reviewed this project proposal and agree to the scope, timeline, and deliverables outlined above. I understand my role as Subject Matter Expert and commit to providing pedagogical guidance, pricing decisions, and biweekly feedback during Thursday review calls.**

**Supervisor Signature:** __________________________  
**Date:** __________________________  
**Printed Name:** Bertrand Laurence  
**Position:** Owner, Master Guitar Instructor, Bertrand Laurence Guitar Studio  
**Contact Email:** bertlarrymusic@gmail.com  
**Contact Phone:** 617-447-5575

---

## Course Instructor Information

**Instructor:** Dr. Jennifer Richardson  
**Course:** EDCI 57300 Practicum  
**Institution:** Purdue University  
**Contact Email:** [To be provided by course syllabus]

**Note to Instructor:** Once this proposal is accepted, please contact Bertrand Laurence at the email/phone provided above to open lines of communication and confirm supervisor role. Bertrand has been informed that this communication will occur.

---

**Document Status:** Revised — Pending Supervisor Signature  
**Last Updated:** May 25, 2026  
**Next Review:** Biweekly Thursday calls (ongoing)
