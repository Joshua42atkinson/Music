# Session Review — May 28, 2026
## 14-Hour Build: Troubadour Identity, 121 DAG Nodes, AI Infrastructure

> **Status:** Git clean, build passing (0 errors), 46/46 tests passing. All work committed and pushed.

---

## I. What The Maturation Map Says (v1.7 — May 27)

The `12_GUITAR_EMODULE_PEARL_MATURATION.md` defines 7 phases:

| Phase | Name | Status in Map | What We Actually Did Today |
|-------|------|---------------|---------------------------|
| 0 | Stabilization | ✅ Complete | +18 restored slide images, drift-check workflow |
| 1 | Persistence | Partial (Supabase wired) | Nothing new — still blocked on login test |
| 2 | Mentor Connect | Partial (Drive code done) | Nothing new — still blocked on Google Cloud Console |
| 3 | Voice + AI | Partial (Frontend done) | **HUGE**: useTroubadourAI, vLLM guide, llama.cpp fallback, BetaGate |
| 4 | Digital Mirror | Partial (Video journaling done) | Nothing new |
| 5 | Vercel + PWA | Partial (deployed) | Nothing new |
| 6 | Android | Not started | Nothing new |
| 7 | Beyond | Vision only | Nothing new |

**The maturation map is OUT OF DATE.** It doesn't know about:
- TroubadourLoom, CapstoneCard, PracticeJournal
- 121 DAG nodes (was ~30)
- Bardic Titles
- MockStudent system
- LongCat-Image artwork generator

---

## II. What We Actually Built Today

### A. Identity & Progression System

| Feature | File | What It Does | Student Impact |
|---------|------|-------------|----------------|
| **TroubadourLoom** | `src/components/TroubadourLoom.jsx` | Identity page: Bardic title, myelination map, practice stats, mentor cards | Student sees their journey visualized — "I am The Minstrel of Breath" |
| **CapstoneCard** | `src/components/CapstoneCard.jsx` | 3-tier certification ($0/$45/$100) with audition prompts | Student has a goal: "Become Bertrand Approved" |
| **PracticeJournal** | `src/components/playbook/PracticeJournal.jsx` | 20-min DAG-based daily session generator | Student opens app, gets a guided practice plan |
| **Bardic Titles** | `src/data/bardicTitles.js` | 12 stations mapped to Bard Level 1-12 | Student levels up, gets a new title + epithet |
| **Certification** | `src/data/certification.js` | Apprentice → Journeyman → Master with requirements | Clear path to mastery with paid capstone |

### B. DAG Curriculum Expansion

| Feature | File | What It Does | Student Impact |
|---------|------|-------------|----------------|
| **121 DAG Nodes** | `src/data/dag/dagNodes.js` | Fret 1-12, all pillars, all phases | Complete curriculum from first note to mastery |
| **DAG Edges** | `src/data/dag/dagEdges.js` | Unlock logic, prerequisites, recommendations | Student can't skip ahead; must earn each node |
| **PracticeEngine** | `src/data/practiceEngine.js` | Session generator from DAG state | 20-min sessions tailored to current progress |
| **BEWorkbook** | `src/components/playbook/BEWorkbook.jsx` | Node cards with BE→DO→PLAY progression | Student sees exactly what to do next |
| **DAGProgressBar** | `src/components/DAGProgressBar.jsx` | Visual fret-level progress | Student sees they're 73% through Fret 3 |

### C. AI Infrastructure

| Feature | File | What It Does | Student Impact |
|---------|------|-------------|----------------|
| **useTroubadourAI** | `src/hooks/useTroubadourAI.js` | Auto-detects backend: vLLM → llama.cpp → StepAudio → LM Studio → offline | AI chat always works, even if one backend fails |
| **BetaGate** | `src/components/BetaGate.jsx` | PIN-based AI access control | You can share the AI with 20 friends safely |
| **MockStudent** | `src/data/mockStudent.js` | Synthetic personas for testing | You can test the AI with fake student data |
| **AI Disclosure** | `src/components/AmbientPlayer.jsx` | "AI assistant trained on Bertrand's pedagogy" | Legal compliance, student knows it's not Bertrand |
| **vLLM Guide** | `research/VLLM_SERVING_GUIDE.md` | ROCm tuning for 20-75 concurrent users | Your GMKtek can serve a beta class |
| **GMKtek Script** | `scripts/setup-vllm-gmktek.sh` | One-command server deployment | Restart the AI server in 2 minutes |

### D. Art & Assets

| Feature | File | What It Does | Student Impact |
|---------|------|-------------|----------------|
| **Slide Art Manifest** | `scripts/slideArtManifest.json` | 17 curated prompts for intentional artwork | Every slide has emotionally resonant art |
| **Art Generator** | `scripts/generate-slide-artwork.py` | Overnight LongCat-Image batch runner | Run before bed, wake up to new art |
| **Restored Images** | `public/assets/slides/` | 18 previously deleted images recovered | Slides no longer have broken images |

---

## III. The Full Student Journey — Three Modes

### Mode 1: Self-Paced (No AI)

```
LANDING (/)
  → Student sees 3 portals: The Song | The Guitar | The Player
  → Clicks "The Song" → OrientationHub (/song)
    → Swipes through Fret 1 slides (15 slides)
      → Title → Yin philosophy → Quote → Concept → Meditation
      → Yang instruction → Exercises → Fretboard → End
    → Completes BE phase → unlocks DO phase
  → Clicks "The Guitar" → GuitarWorkbench (/guitar)
    → Uses Breathing Gate (Fret 1 tool)
    → Practices with Practice Timer (Fret 2)
    → Explores other tools as curiosity drives
  → Clicks "The Player" → PlayerPortal (/player)
    → Views TroubadourLoom — sees "Apprentice of Breath" title
    → Checks practice streak (4 days)
    → Opens BEWorkbook — sees Fret 1 nodes, Fret 2 partially unlocked
    → Generates PracticeJournal session (20 min)
      → Warm-up: Breathing Gate (2 min)
      → Focus: Pitch Room — sing the Major 2nd (8 min)
      → Reflection: "What did you notice about your breath?" (2 min)
    → Submits video practice via PracticeRecorder
  → Returns tomorrow, streak increases, new nodes unlock
```

**What's missing for full self-paced:**
- ❌ No `/guitar/map` route — no visual "where am I?" map
- ❌ No-AI fallback chat — when offline, Troubadour just says "I'm resting"
- ❌ No data migration — student loses progress if they switch devices
- ❌ No PWA — can't install as app, no offline cache

### Mode 2: AI-Assisted (llama.cpp Nemotron)

```
Same as Mode 1, but Troubadour chat is ACTIVE:

  → Student asks: "I'm stuck on the tritone. It sounds ugly."
  → Nemotron (1M context) responds with DAG context:
     "The tritone is supposed to sound unsettled — that's its power.
     Try singing F to B slowly. Feel the tension. Don't resolve it yet.
     The discomfort IS the lesson. Over."
  → AI suggests next node: "Fret 7-PLING! Trainer is unlocked. Try it?"
  → Student clicks suggestion → opens PLING! Trainer
  → AI adapts tone based on Troubadour Type (if CharacterSheet existed)
```

**What's missing for full AI-assisted:**
- ❌ CharacterSheet.jsx — student can't select Troubadour Type
- ❌ AI tool control — Troubadour can't set metronome or ambient music
- ❌ Voice TTS/STT — still text-only interaction
- ❌ AI context injection — Troubadour can't pull Song page content into chat
- ❌ No automated prompt engineering from DAG state

### Mode 3: 20-Minute Daily System

```
Student opens app → PlayerPortal (/player)
  → Clicks "PracticeJournal" tab
  → System generates session from DAG:
    ┌─────────────────────────────────────┐
    │  Today's Session — 20 Minutes       │
    │  Bard Level: 3 (The Minstrel)       │
    │  Streak: 4 days 🔥                  │
    ├─────────────────────────────────────┤
    │  1. Warm-up (3 min)                 │
    │     → Breathing Gate: Box breath    │
    │     → Fretboard: Open A, fret 2   │
    │                                     │
    │  2. Focus (12 min)                  │
    │     → BE: "Imagine the Major 3rd"   │
    │     → DO: Pitch Room — sing E to G# │
    │     → PLAY: Fretboard Explorer      │
    │                                     │
    │  3. Reflection (3 min)              │
    │     → Journal: "What felt easy?"   │
    │     → FHEAL: Let go of judgment     │
    │                                     │
    │  [Start Session]  [Customize]       │
    └─────────────────────────────────────┘
  → Student completes session
  → Nodes auto-marked complete
  → Next fret unlocks if criteria met
  → Streak +1 day
```

**What's missing for full 20-min system:**
- ❌ No timer integration — PracticeJournal shows plan but no countdown
- ❌ No session recording — can't save "I did this session today"
- ❌ No progress analytics — no "you've practiced 4.2 hours this week"
- ❌ No push notifications — "Time for your daily practice" (PWA needed)

---

## IV. Critical Gaps (Ranked by Student Impact)

### 🔴 CRITICAL — Blocks Core Experience

| Gap | Why It Matters | Effort |
|-----|---------------|--------|
| **CharacterSheet.jsx** | Student can't select Troubadour Type → AI can't adapt voice | 2-3 hrs |
| **No-AI fallback chat** | When all backends offline, Troubadour is dead → student abandoned | 2-3 hrs |
| **Data migration** | Student loses all progress on first login → rage quit | 2-3 hrs |
| **ScaffoldingProvider sync** | Cloud/local split not working → data inconsistency | 2-3 hrs |

### 🟡 HIGH — Degrades Experience

| Gap | Why It Matters | Effort |
|-----|---------------|--------|
| **No `/guitar/map` route** | Student has no visual "where am I?" → feels lost | 4-6 hrs |
| **No mentor notifications** | Student submits video, never knows if reviewed → abandonment | 3-4 hrs |
| **No voice TTS** | Text-only AI contradicts Bertrand's vocal pedagogy | 1-2 hrs |
| **No PWA** | Can't install, no offline, no push notifications | 4-6 hrs |
| **Slide artwork incomplete** | 17 prompts ready but not generated → broken images | Overnight (run script) |

### 🟢 MEDIUM — Nice to Have

| Gap | Why It Matters | Effort |
|-----|---------------|--------|
| **AI tool control** | Troubadour can't start metronome via voice | 3-4 hrs |
| **Session recording** | No history of "I practiced 20 min on Tuesday" | 2-3 hrs |
| **Self-review playback** | Can't watch own video with metronome overlay | 4-6 hrs |
| **French i18n** | Bertrand teaches in French → half the audience | 8-10 hrs |

---

## V. What's Actually Tested

| Test Type | Coverage | Gaps |
|-----------|----------|------|
| **Unit tests** | 46 tests, all passing | Only DAG logic + slide generation. No component tests, no hook tests, no integration tests. |
| **Build** | 0 errors, 0 warnings | Chunk size warning (not a bug). |
| **Browser** | Manual verification | No automated E2E (Playwright/Cypress). No mobile viewport testing. |
| **AI backends** | localhost:8080, 1234, 9998 | Not actually tested with live server. BetaGate not tested with real PINs. |
| **Supabase** | Schema deployed | No end-to-end login test on production domain. |

**Testing debt is MASSIVE.** For a beta launch, you need:
1. Student walkthrough test (all 12 frets, BE→DO→PLAY)
2. AI chat test (all 4 backends)
3. Mobile responsive test
4. Login/logout flow test
5. Data migration test
6. Mentor dashboard test

---

## VI. The Real Question: Is This Ready for 20 Beta Users?

### YES, If:
- You fix the 4 CRITICAL gaps (CharacterSheet, No-AI fallback, data migration, sync)
- You generate the slide artwork (run the overnight script)
- You test the Troubadour chat with your live llama.cpp Nemotron
- You set a beta PIN and share with friends

### NO, If:
- You want students to have a visual map of their journey (no `/guitar/map`)
- You want offline access (no PWA)
- You want voice interaction (no TTS/STT)
- You want Bertrand to review submissions (mentor dashboard partial)

### RECOMMENDATION:
**Launch a "Silent Beta"** — 5-10 friends, no marketing, collect feedback.
- Fix CRITICAL gaps first (2-3 days)
- Run artwork generator overnight
- Test Troubadour chat end-to-end
- Then expand to 20-50 users

---

## VII. What To Do Next Session

1. **Test the Troubadour chat** — Start llama.cpp, open localhost:5173, ask 5 questions
2. **Build CharacterSheet.jsx** — 4 Troubadour Type selector (15-min quiz)
3. **Build No-AI fallback** — Static prompt library with 20 pre-written responses
4. **Run artwork generator** — `python3 scripts/generate-slide-artwork.py`
5. **Build `/guitar/map`** — Visual 12-fret progress map (biggest UX win)

---

*Review written 2026-05-28 21:40 UTC-4. Next review: after critical gaps fixed.*
