# VOIX VIVE — Roadmap & Phase Plan
> **What's done, what's next, revenue gates, and auth plan.**
> Last Updated: 2026-05-25

---

## CURRENT BUILD STATUS

### ✅ Completed (as of 2026-05-25)

**Core Platform**
- Three portals: The Song, The Guitar, The Player
- 12-fret NeckMenu navigation
- SlideViewer — swipeable bilingual textbook (EN/FR)
- DigitalBinder — 12 fret tools all implemented
- AmbientPlayer — ambient music + metronome + Troubadour chat

**Game (Fret 9 — Vertiscale Engine)**
- Phase 1: Inner Fretboard (flash + imagine modes)
- Phase 2: Inner Ear (audiation orbs + pitch detection)
- Phase 3: Inner Voice (journal reflection, no score)
- Difficulty: Kinesthetic Awakening / Applied Practice / Flow State
- Biometric Sanctum (HRV/breath input)
- Adventure mode (narrative scenes)

**Data & State**
- tractionStore.js — localStorage Bard Level, traction, streak
- localDatabase.js — IndexedDB backup (Dexie)
- Wire 1: Game → Traction (sessionLogger → updateFretTraction)
- Wire 2: Student name → IndexedDB + Troubadour
- Wire 3: SlideViewer completion → yinCompleted flag

**Troubadour AI**
- Streaming chat in AmbientPlayer (LM Studio localhost:1234)
- Hardened system prompt (markdown sections, upgrade-resilient)
- Student name personalization
- Four Troubadour Types defined (replacing Trinity IP)

**Business**
- StudioPage with pricing, testimonials, SEO (JSON-LD)
- ProfileModal — student name/style/PIN
- MentorDashboard — Bertrand's teacher view
- PracticeRecorder — video/audio submissions
- Localization — 100+ keys EN/FR

**Cleanup**
- GuitarHub.jsx deleted (was orphaned)
- Tavern3DVisualizer.jsx archived to `_archive/vr_future/`
- HealthPulse.jsx archived to `_archive/removed_components/`
- Florins/Jean-Luc/earnFlorins removed from VertiscaleEngine
- Documentation restructured into `docs/` clean slate

---

## NEXT PRIORITIES

### Immediate (before Bertrand's Thursday call)
- [ ] Add Four Troubadour Types to `CharacterSheet.jsx` (replace CORE_STATS Four Channels)
- [ ] Remove `Four Channels` line from `playbookData.js` (line 373)
- [ ] PEARL headers on 15 critical source files
- [ ] Test full student journey in browser (first visit → chapter → game → Troubadour)

### Near-term (Phase 2 — Launch)
- [ ] Supabase auth — soft login (email/password + Google OAuth)
- [ ] Stripe Payment Links wired to `pricingData.js`
- [ ] Async video submission flow (Fret 10 Coaching Portal)
- [ ] Mentor dashboard real submissions view
- [ ] PWA manifest + service worker (offline-first)

### Medium-term (Phase 3 — Revenue)
- [ ] Troubadour AI Evaluation product ($5–$35/eval)
- [ ] Voice Octave premium curriculum (Frets 13–24, $49 unlock)
- [ ] Inner Circle membership ($25/mo or $199/yr)
- [ ] Cross-device sync via Supabase Postgres

---

## AUTH & GATING ARCHITECTURE

### Phase 1 — Now (no login, dev mode)
- All frets unlocked for Bertrand to experience the full arc
- `active_student_profile` in localStorage only
- No gating, no payment walls
- **Do not gate content until Phase 3**

### Phase 2 — Launch (soft auth)
```
Supabase (supabase.io):
  - Email/password login
  - Google OAuth (via Supabase — no direct Google dependency)
  - Postgres database for student progress
  - Row-Level Security (each student sees only their data)
  - Realtime sync for cross-device progress
```

### Phase 3 — Revenue (hard gates)
```
Content gates:
  - Frets 1-9: Free (funnel)
  - Frets 10-12: Inner Circle membership OR one-time purchase
  - Frets 13-24 (Voice Octave): $49 unlock
  - Async video feedback: $5/$15/$35 per submission
  - Troubadour AI Evaluation: $5/$35 per session
```

**Why not Google Auth directly:**
- Adds Google dependency, breaks offline-first
- Not aligned with Slow Web mandate
- Supabase abstracts it cleanly

---

## REVENUE MODEL

```
FREE (always free — funnel):
  12-chapter Living Textbook
  Vertiscale Game (Fret 9)
  Troubadour AI coaching (basic)
  All 12 digital tools

REVENUE (Phase 3):
  Private Lesson (Zoom):     $60/hr ($45 trial, $55 bulk)
  Guitar & Voice (©PLING!):  $60/hr
  Async Video Review:         $35/review ($30 5-pack)
  Inner Circle Membership:    $25/mo or $199/yr
  Group Workshop:             $35/person
  Gift Certificate:           $60–$275
  Troubadour AI Eval:         $5–$35/session (NEW — automated)
  Voice Octave Unlock:        $49 one-time (NEW)
```

**Payment stack:** Stripe · Venmo · PayPal · Zelle · Cash App · Ko-fi · Wire/IBAN (France)

> **ACTION:** Bertrand must create a Stripe account and provide Payment Link URLs → paste into `src/data/pricingData.js`

---

## MOONSHOTS (revenue-gated)

| Moonshot | Gate | Stack |
|---|---|---|
| Android App / PWA | $2,500/mo | Tauri mobile, existing React |
| AI Bertrand Coach | $2,500/mo | Fine-tuned Gemma 4 2B (training data ready) |
| VR Guitar Classroom | $5,000/mo | Bevy ECS + OpenXR + Tavern3D scenes (archived) |
| Roblox Music World | $5,000/mo | Social learning, Roblox Studio |

---

## BUSINESS CONTACTS

- **Bertrand Laurence:** bertlarrymusic@gmail.com · 617-447-5575
- **YouTube:** @BertrandLaurenceMusic
- **Studio:** bertrandguitarstudio.duetpartner.com
- **Thumbtack:** Top Pro, multiple years
- **Passim School of Music:** Group class instructor (Guitar & Vocal, Fingerstyle)
- **Thursday call:** Bertrand reviews the build — prepare StudioPage + live demo
