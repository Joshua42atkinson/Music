# Guitar eModule: The Pearl & Maturation Map v3.0
## Voix Vive — Active Roadmap
### *The single document to read at the start of every session.*

> **Version:** 3.0 — Post-Week 3 Status Report (2026-05-31)  
> **Author:** Joshua Atkinson (Platform Architect)  
> **SME:** Bertrand Laurence  
> **Status:** 12/14 practicum deliverables complete. 2 At Risk. Platform live at voix-vive.com.  
> **Academic:** EDCI 57300 Practicum, Week 3 of 8. Status Report 1 submitted.  
> **Next SME Review:** Week 5 (per project plan)

---

## I. WHAT IS DONE — The Foundation (Phases 0–1)

Everything below is **built, tested, deployed, and confirmed by SME (May 27).**

### Platform Core
- ✅ 12-chapter Living Textbook (96 slides, swipeable, bilingual EN/FR, 340+ keys)
- ✅ 12 interactive tools mapped to 12 frets (Breathing Gate → Rhythm Engine)
- ✅ Vertiscale Imagination Engine (3-phase: Flash/Imagine/Reflect)
- ✅ Troubadour Adventure (12-scene CYOA, 918 lines, bilingual)
- ✅ StudioPage (6 services, 13 testimonials, payment grid, FAQ)
- ✅ 144-node DAG curriculum (BE→DO→PLAY gates, Nemotron-generated prompts)
- ✅ Identity system (12 Bardic Titles, CapstoneCard, BEWorkbook, PracticeJournal)
- ✅ Production deploy (voix-vive.com via Vercel, SSL, auto-deploy)
- ✅ 46/46 Vitest tests passing, zero build errors
- ✅ Sandbox Mode (bypass DAG gates for unstructured exploration)
- ✅ Sovereign data (.voixvive memory card export/import)
- ✅ Navigation standardized (Back + Home on all pages)
- ✅ Pythagorean Legacy on all 12 frets + Chromatic Monomyth chart

### Persistence & Auth
- ✅ Supabase project + schema deployed (profiles, progress, journal, submissions)
- ✅ Google OAuth sign-in (openid/email/profile scope)
- ✅ Journal sync (Supabase when logged in, IndexedDB offline)
- ✅ AuthButton + useAuth hook + AuthCallback page

### AI Infrastructure
- ✅ useTroubadourAI hook (vLLM → llama.cpp → StepAudio → LM Studio → offline)
- ✅ BetaGate PIN access + MockStudent testing personas
- ✅ AI disclosure in chat UI
- ✅ 33B voice model downloaded (Step-Audio-R1.1)
- ✅ Java WebSocket middleware scaffolded (TroubadourServer + JwtValidator)

### Mentor Connect (Scaffolded)
- ✅ Structured Practice Recorder (15-min: Breathing → Warm-up → Practice → Free Play → Emotional State)
- ✅ Google Drive service code (upload, auto-share, metadata)
- ✅ Calendar + scheduling service code
- ✅ Mentor Dashboard scaffold (/mentor route)

### SME Validation
- ✅ SME Review #1 (May 27, 90 min, recorded & transcribed)
- ✅ Bertrand confirmed pedagogical alignment of 12-fret structure
- ✅ Bertrand tested live site on his own device
- ✅ Pricing confirmed: $45/video review, $5/text-back

---

## II. WHAT IS AT RISK — Must Fix (Weeks 4–5)

These are the 2 deliverables marked "At Risk" in the Week 3 Status Report.

### A. Supabase Cloud Persistence (Remaining Items)

| Task | Effort | Priority | Blocks | Status |
|------|--------|----------|--------|--------|
| **Local→cloud data migration on first login** | 2-3 hrs | CRITICAL | Students lose progress when switching devices | ⏳ In Progress |
| **`/guitar/map` route** — Visual maturation map as primary navigation | 4-6 hrs | HIGH | Students can't see "where am I" in the curriculum | ✅ COMPLETED |
| **No-AI fallback** — Static prompt library when LM Studio is offline | 2-3 hrs | HIGH | Troubadour dies when AI server is offline | ✅ COMPLETED |

### B. PracticeRecorder & Mentor Dashboard (Remaining Items)

| Task | Effort | Priority | Blocks | Status |
|------|--------|----------|--------|--------|
| **Google OAuth consent screen setup** — re-enable `drive.file` scope | 10 min | CRITICAL | All Drive video uploads blocked | ⏳ In Progress |
| **Mentor response recording** — Screen recorder for Bertrand's feedback | 3-4 hrs | MEDIUM | Bertrand can't send video responses | ⏳ In Progress |
| **Mentor notifications** — "Reviewed" badge when feedback is ready | 2-3 hrs | MEDIUM | Student never knows when reviewed | ⏳ In Progress |

---

## III. KNOWN BUGS — Document from Session Logs

| Bug | File | Severity | Status |
|-----|------|----------|--------|
| `useDAGProgress` ignores `sandboxMode` — nodes show locked in sandbox | `hooks/useDAGProgress.js` | MEDIUM | ✅ FIXED |
| AI toggle says "Online/Offline" instead of "Troubadour/Silent" | `components/AmbientPlayer.jsx` | LOW | ✅ FIXED |
| No visual sandbox indicator — student doesn't know they're in Open Book | Multiple | MEDIUM | ✅ FIXED |
| CharacterSheet has no Troubadour Type selection → AI speaks generically | `components/playbook/CharacterSheet.jsx` | MEDIUM | ✅ FIXED |

---

## IV. NEXT SESSION WORKFLOW — Prioritized

**Start every new session by reading this section. Pick the next unchecked item.**

### Sprint A: Critical Path (Do First)
- [x] 1. **Fix `useDAGProgress` sandbox awareness** — wire `sandboxMode` through hook (verified and runtime ReferenceError resolved)
- [x] 2. **Local→cloud data migration** — `migrateLocalToCloud()` on first Supabase login (verified and wired in ScaffoldingProvider)
- [x] 3. **No-AI fallback chat** — static prompt selector when LM Studio offline (fully wired in `troubadourOffline.js`)
- [ ] 4. **Google OAuth consent screen** — re-enable `drive.file` scope (10 min in Google Cloud Console)

### Sprint B: Student Experience (Do Second)
- [x] 5. **`/guitar/map` route** — Visual 12-fret maturation map as primary navigation hub
- [x] 6. **Relabel AI toggle** — "Troubadour / Silent" instead of "Online / Offline"
- [x] 7. **Sandbox mode indicator** — persistent badge when in Open Book mode (added to Landing Screen header and Orientation Hub navbar)
- [x] 8. **CharacterSheet Troubadour Type** — let student pick persona, inject into AI prompt (fully wired and prompt-specialized)
- [x] 9. **"Course Complete" detection** — all 12 milestones → celebration screen (fully operational on student profile sheet with cert generation)

### Sprint C: Mentor Flow (Do Third)
- [ ] 10. **Mentor response recording** — screen recorder overlay for Bertrand
- [ ] 11. **Mentor notifications** — "Reviewed" badge on student submissions
- [ ] 12. **Certificate generation** — simple component (name, date, signature, seal)
- [ ] 13. **Capstone review flow** — Bertrand approves → cert triggers

### Sprint D: Polish (Do Last / Week 7-8)
- [ ] 14. **PEARL compliance sweep** — file headers on all core shells
- [ ] 15. **Yin/Yang tone adaptation** — Troubadour adjusts coaching tone per fret archetype
- [ ] 16. **YouTube Shorts content** — 3 × 90s videos (©SHEARL, ©PLING!, ©FHEAL)
- [x] 17. **Landing page SVG art** — Replace emoji icons with sacred geometry (triskelion/strings/waves)
- [x] 18. **Mobile font readability** — Bump manifesto text sizes for phone viewports

### Sprint E: Native Mobile App via Capacitor (Week 6-7)
- [ ] 19. **`npx cap init`** — Initialize Capacitor in the project (5 min)
- [ ] 20. **`npx cap add android`** — Generate Android project, test in Android Studio
- [ ] 21. **`npx cap add ios`** — Generate iOS project (requires Mac + Xcode)
- [ ] 22. **Offline-first verification** — Confirm all 12 chapters + tools cached via service worker
- [ ] 23. **Native mic access** — Test MediaRecorder in Capacitor shell for woods recording
- [ ] 24. **IndexedDB→SQLite bridge** — Ensure local data persists across app restarts
- [ ] 25. **Google Play publish** — $25 one-time, generate signed APK
- [ ] 26. **App Store publish** — $99/year, requires Apple Developer account

---

## V. WAITING ON BERTRAND

| Task | Why It Matters | Status |
|------|---------------|--------|
| **Create Stripe account** | Studio page can't accept real payments | ❌ Not done |
| **Identify 2-3 pilot students** | Week 4 UX testing | ❌ Not done |
| **Color/shape for 12 notes** | Chromatic Monomyth visual upgrade | ❌ Not done |
| **Record welcome video (60s)** | Landing page engagement | ❌ Not done |
| **Voice memo for AI cloning** | Phase 3 voice Troubadour | ❌ Not done |
| **Favorite songs per fret** | Replace placeholder Timeless Song slides | ❌ Not done |
| **Async coaching pricing decision** | Per-submission vs monthly vs bundled | ❌ Discussed, not decided |
| **Test live site on phone** | Mobile UX validation | ✅ Done (May 27) |

---

## VI. PRACTICUM TIMELINE — Where We Are

```
Week  Phase            Hrs   Status
────  ───────────────  ────  ──────
  1   Analysis          12   ✅ COMPLETE — SME needs analysis, 12-chapter layout, repo, LM Studio
  2   Prototyping       14   ✅ COMPLETE — StudioPage, i18n, Chapters 1–4
  3   Core I            12   ✅ COMPLETE — Web Audio, Vertiscale, SME Review #1
  ──  ── YOU ARE HERE ──────────────────────────────────────────────────────
  4   Core II           10   NEXT — PlingTrainer polish, Chapters 5-8, first UX test
  5   AI Infra          10   SME Review #2, Drive integration, No-AI fallback
  6   Media              8   PracticeRecorder finalization, Mentor Dashboard
  7   Refine             9   Chapters 9-12, second UX test, performance review
  8   Deploy             8   Production polish, Stripe verification, SME handoff + Final Report
                       ───
                        83 total hours
```

### 573 Deliverables Schedule
| Week | Due | Status |
|------|-----|--------|
| 2 | Proposal (Assignment 2) | ✅ Submitted (v3, May 29) |
| 3 | Status Report / Journal Reflection 1 | ✅ Submitted (May 31) |
| 5 | Status Report / Journal Reflection 2 | ⏳ Upcoming |
| 5 | Artifact 1 | ⏳ Upcoming |
| 6 | Status Report / Journal Reflection 3 | ⏳ Upcoming |
| 7 | Artifact 2 | ⏳ Upcoming |
| 8 | Final Project Report | ⏳ Upcoming |

---

## VII. THE 12-FRET TOOL MAP (Sacred — Unchanged)

| Fret | Tone | Stage | Tool | Protocol |
|------|------|-------|------|----------|
| 1 | C — Root | Call to Adventure | Breathing Gate | ©SHEARL |
| 2 | C# — m2 | Refusal of the Call | Practice Timer | ©SHEARL |
| 3 | D — M2 | Meeting the Mentor | Pitch Room | ©PLING! |
| 4 | D# — m3 | Crossing the Threshold | Metronome | ©SHEARL |
| 5 | E — M3 | Tests, Allies, Enemies | Interval Visualizer | ©SHEARL |
| 6 | F — P4 | Approach to the Inmost Cave | Fretboard Explorer | ©SHEARL |
| 7 | F# — TT | The Ordeal | PLING! Trainer | ©PLING! |
| 8 | G — P5 | The Reward | Microtonal Tracker | ©FHEAL |
| 9 | G# — m6 | The Road Back | **Vertiscale Engine** ⭐ | ©SHEARL |
| 10 | A — M6 | The Resurrection | Async Assessor | ©FHEAL |
| 11 | A# — m7 | Return with the Elixir | Multi-Key Hub | ©FHEAL |
| 12 | B — M7 | Master of Two Worlds | Rhythm Engine | ©FHEAL |

---

## VIII. DOCUMENT INDEX — What To Read When

| Task | Read This | Path |
|------|-----------|------|
| **Start of session** | **THIS DOCUMENT** | `research/12_GUITAR_EMODULE_PEARL_MATURATION_v3.md` |
| Any game change | Vertiscale Game Doc | `research/10_design_doc_03_vertiscale_game.md` |
| Any platform/UI change | Master Design Doc | `research/10_MASTER_DESIGN_DOC.md` |
| Full project context | CONTEXT.md | `CONTEXT.md` |
| Student modes | Four Modes Doc | `docs/09_FOUR_MODES_AND_APPRENTICESHIP.md` |
| SME session details | Session Log | `docs/08_SESSION_LOG_20260529.md` |
| Mentor video plan | Mentorship Integration | `docs/07_BERTRAND_MENTORSHIP_INTEGRATION.md` |
| AI architecture | System Bible | `docs/00_SYSTEM_BIBLE.md` |
| 573 proposal | Project Proposal v3 | `EDCI_57300_Project_Proposal_v3.md` |
| 573 status report | Week 3 Report | `../../573_Status_Report_Week3_FILLED.docx` |

---

*Document written 2026-05-31. Updated same day with Sprint E (Capacitor) and pricing analysis.*

---

## IX. REVENUE STRATEGY & PRICING ANALYSIS

### The Funnel (What's Free vs Paid)

```
FREE (Marketing Funnel)                    PAID (Revenue)
─────────────────────────                  ──────────────
12-chapter Living Textbook                 $5  Text-back (3-min audio review)
12 interactive practice tools              $45 Video Review (15-min structured)
Vertiscale Imagination Engine              $65 Live 30-min session (Zoom/in-person)
Troubadour AI coaching                     $100 Capstone Audition review + cert
DAG progression + journaling               $29/mo Inner Circle (community + monthly Q&A)
Sandbox mode                               
.voixvive data sovereignty                 
```

### Market Comparison (Is $45 Overpriced?)

| Service | Price | What You Get |
|---------|-------|--------------|
| Fender Play | $10/mo | Video library, no personal feedback |
| JustinGuitar | Free + $10/mo premium | Community, no 1:1 mentorship |
| Masterclass (general) | $10/mo | Celebrity lectures, zero interaction |
| TakeLessons.com (avg guitar) | $40-80/lesson | Live 30-60 min, one-time |
| Berklee Online (certificate) | $1,500-3,000 | Full course, graded, 12 weeks |
| **Voix Vive: Text-back** | **$5** | **Personal audio response from master** |
| **Voix Vive: Video Review** | **$45** | **15 min of Bertrand watching YOU play** |
| **Voix Vive: Capstone Cert** | **$100** | **Full course completion + signed certificate** |

### Honest Assessment

**$45 is NOT overpriced.** Here's why:

1. **Bertrand is giving 45 minutes of real attention** — he watches 15 min, records his response, thinks about the student. That's worth $60-80 at market rate.
2. **The $5 text-back is genius** — it's an impulse buy. A student records 3 min of playing, gets personal feedback from a master for the price of a coffee. This will be the volume driver.
3. **The platform is 100% free** — no subscription gate, no paywall on content. Students only pay when they WANT personal attention. That's ethical and sustainable.
4. **The real risk is underpricing**, not overpricing. At $45/review, Bertrand needs 56 reviews/month to make $2,500. At $5/text-back, he needs 500. The sweet spot is a mix.

### Recommended Pricing Tiers

| Tier | Price | Bertrand's Time | Revenue Target |
|------|-------|----------------|----------------|
| ☕ Quick Listen | $5 | 5 min | Volume — 100+/mo |
| 🎸 Deep Review | $45 | 45 min | Core — 20-30/mo |
| 🎓 Capstone Cert | $100 | 60 min | Premium — 5-10/mo |
| 🔮 Inner Circle | $29/mo | 1 hr group Q&A/mo | Recurring — 20+ members |
| 🏠 Private Session | $65 | 30 min live | On-demand |

**Projected monthly at modest scale (50 active students):**
- 40 × $5 text-backs = $200
- 10 × $45 reviews = $450
- 2 × $100 capstones = $200
- 15 × $29 Inner Circle = $435
- **Total: ~$1,285/mo** from 50 students, scaling to $2,500+ at 100

### Key Insight from SME Meeting

Bertrand said it himself: *"Ways to make money by using the internet and still being personal and responsive, just over time instead of immediately."*

The $5 text-back is the killer feature. It's personal. It's async. It scales. And it's priced so low that nobody hesitates.
