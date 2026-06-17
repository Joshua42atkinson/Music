# Guitar eModule: The Pearl & Maturation Map v2.0
## Voix Vive — Updated 2026-05-28

> **Version:** 2.0 — Identity, DAG, AI Infrastructure Complete
> **Status:** Core platform built. 4 critical gaps remain before silent beta.
> **Beta Gate:** Fix 4 critical items → silent beta (5-10 friends) → public beta (20-50)

---

## I. WHAT WE BUILT TODAY (2026-05-28)

### Phase 0.5 — Identity & DAG (COMPLETED)

| Feature | File | What It Does |
|---------|------|-------------|
| **121 DAG Nodes** | `data/dag/dagNodes.js` | Complete curriculum Fret 1-12, all pillars/phases |
| **Bardic Titles** | `data/bardicTitles.js` | 12 stations mapped to Bard Level 1-12 |
| **TroubadourLoom** | `components/TroubadourLoom.jsx` | Identity page: myelination map, stats, mentor hooks |
| **CapstoneCard** | `components/CapstoneCard.jsx` | 3-tier certification ($0/$45/$100) with audition prompts |
| **PracticeJournal** | `components/playbook/PracticeJournal.jsx` | 20-min DAG-based daily session generator |
| **BEWorkbook** | `components/playbook/BEWorkbook.jsx` | Node cards with BE→DO→PLAY unlocking logic |
| **Certification** | `data/certification.js` | Apprentice → Journeyman → Master tiers |

### Phase 0.6 — AI Infrastructure (COMPLETED)

| Feature | File | What It Does |
|---------|------|-------------|
| **useTroubadourAI** | `hooks/useTroubadourAI.js` | Auto-detects: vLLM → llama.cpp → StepAudio → LM Studio → offline |
| **BetaGate** | `components/BetaGate.jsx` | PIN-based access control for AI beta |
| **MockStudent** | `data/mockStudent.js` | Synthetic personas for AI testing |
| **AI Disclosure** | `components/AmbientPlayer.jsx` | "AI assistant trained on Bertrand's pedagogy" |
| **vLLM Guide** | `research/VLLM_SERVING_GUIDE.md` | ROCm tuning for 20-75 concurrent users |
| **GMKtek Script** | `scripts/setup-vllm-gmktek.sh` | One-command server deployment with `--enable-prefix-caching` |

### Art & Assets (IN PROGRESS)

| Feature | File | Status |
|---------|------|--------|
| **Slide Art Manifest** | `scripts/slideArtManifest.json` | 17 curated prompts ready |
| **Art Generator** | `scripts/generate-slide-artwork.py` | Script ready (requires local model) |
| **Restored Images** | `public/assets/slides/` | 18 images recovered |

---

## II. THE STUDENT JOURNEY — Three Modes

### Mode 1: Self-Paced (No AI Required)

```
Landing (/) → The Song (/song) → Swipe Fret 1 slides
                        ↓
              The Guitar (/guitar) → Use Breathing Gate, Practice Timer
                        ↓
              The Player (/player) → TroubadourLoom (identity + stats)
                                     BEWorkbook (progress tracking)
                                     PracticeJournal (20-min daily plan)
                                     Submit video practice
                        ↓
              Next day → Streak +1, new nodes unlock
```

**AI is optional.** Student can learn guitar without ever opening chat.

### Mode 2: AI-Assisted (llama.cpp Nemotron)

```
Same as Mode 1, but Troubadour chat is active:

Student: "I'm stuck on the tritone. It sounds ugly."
Troubadour: "The tritone is supposed to sound unsettled — that's its power.
           Try singing F to B slowly. Feel the tension. Don't resolve it yet.
           The discomfort IS the lesson. Over."
```

Backend chain: vLLM (future) → llama.cpp:8080 (now) → StepAudio:9998 → LM Studio:1234 → offline

### Mode 3: 20-Minute Daily System

```
Open /player → PracticeJournal tab
  ┌─────────────────────────────────────┐
  │  Today's Session — 20 Minutes       │
  │  Bard Level: 3 (The Minstrel)       │
  │  Streak: 4 days 🔥                  │
  ├─────────────────────────────────────┤
  │  1. Warm-up: Breathing Gate (3 min) │
  │  2. Focus: Pitch Room — sing M2     │
  │  3. Reflection: "What felt easy?"   │
  └─────────────────────────────────────┘
```

---

## III. CRITICAL GAPS — Must Fix Before Beta

| # | Gap | Why It Blocks Beta | Effort | Owner |
|---|-----|-------------------|--------|-------|
| 1 | **CharacterSheet.jsx** | Student can't pick Troubadour Type → AI speaks generically | 2-3 hrs | Joshua |
| 2 | **No-AI fallback chat** | When llama.cpp stops, Troubadour dies → student abandoned | 2-3 hrs | Joshua |
| 3 | **Data migration** | First login wipes local progress → rage quit | 2-3 hrs | Joshua |
| 4 | **ScaffoldingProvider sync** | Cloud/local split broken → data inconsistency | 2-3 hrs | Joshua |

**Total: ~10 hours of dev work.** Then silent beta is ready.

### High Gaps (Fix After Beta Starts)

| Gap | Why | Effort |
|-----|-----|--------|
| `/guitar/map` route | No visual "where am I?" → students feel lost | 4-6 hrs |
| Mentor notifications | Submit video, never know if reviewed | 3-4 hrs |
| Voice TTS | Text-only contradicts vocal pedagogy | 1-2 hrs (browser TTS) |
| PWA | Can't install, no offline, no push | 4-6 hrs |
| Slide artwork | 17 prompts ready, not generated | Overnight (run script) |

---

## IV. BETA TIMELINE

```
NOW ─────── Week 1 ─────── Week 2 ─────── Week 3 ─────── Week 4
   │          │             │             │             │
   ▼          ▼             ▼             ▼             ▼
Fix 4 gaps  Silent Beta   Fix bugs     Open Beta      Public
(10 hrs)   (5 friends)  from beta    (20-50 users)   Launch
           │                          │
           ▼                          ▼
        Collect feedback            Add mentor
        Iterate                     notifications
                                    PWA
```

**Minimum viable beta:** Fix 4 critical gaps + test Troubadour chat + generate artwork.

---

## V. WHAT BERTRAND NEEDS TO DO

| Task | Why | Timeline |
|------|-----|----------|
| **Test live site** | `www.voix-vive.com` on phone + computer | This week |
| **Record welcome video** | 30-60 seconds for landing page | This week |
| **Record voice memo** | "Welcome, troubadour..." for AI voice cloning | Next week |
| **Color/shape for 12 notes** | Personalizes the Chromatic Monomyth | Next week |
| **Favorite songs per fret** | Real examples for Timeless Song slides | Before public beta |
| **Set coaching prices** | Confirm StudioPage rates are current | This week |
| **Provide bio + photo** | For mentor section | This week |

---

## VI. THE 12-FRET TOOL MAP (Sacred — Unchanged)

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

*Document written 2026-05-28. Next review: after 4 critical gaps fixed.*
