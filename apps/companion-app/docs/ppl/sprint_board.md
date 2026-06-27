---
title: sprint_board
status: active
tags: []
date: 2026-06-14
---
# Voix Vive — Master TODO
> **ZEN LAW**: Learner sees `BE → DO → PLAY` and `12 frets`. Everything else is engine.  
> **DELIVERY**: `GAME → STORY → SONG`  
> **NORTH STAR**: Parallel Brightspace/Blackboard. A real online academy.

---

## SPRINT 1 — Wire the Engine (this week)
*What we just built needs to connect to what already exists.*

- [x] `usePlayerState.js` — Tone · Resonance · Buzz · Voice · Distortion engine
- [x] `TruebadourProvider.jsx` — `player` wired into context
- [ ] **Wire BE check-in → `recordBECheckIn()`**
  - `BEWorkbook.jsx` already exists. Find where user picks their state and call `player.recordBECheckIn(answer)`
  - Also check `SomaticStudioPrompter.jsx` and `OnboardingModal.jsx` step 1
- [ ] **Inject `getTruebadourModifier()` into Truebadour system prompt**
  - `truebadourPrompt.js` — add `playerModifier` param to `buildChatPrompt()` and `buildCompressedPrompt()`
  - `TruebadourWidget.jsx` — pass `player.getTruebadourModifier()` when calling `chatStream()`
- [ ] **Wire session complete → `recordSessionComplete()`**
  - Trigger when student reaches PLAY phase or closes a completed session
  - `PracticeJournal.jsx` / `PlaybookShell.jsx` — find session end event
- [ ] **Wire session abandoned → `recordSessionAbandoned()`**
  - Trigger on page unload or back-navigation mid-session
  - Add `beforeunload` listener in `PlaybookShell.jsx`
- [ ] **Wire reflection → `recordReflection()`**
  - `JournalEntry.jsx` — on journal save, call `player.recordReflection()`
- [ ] **Wire mastery gain → `recordMasteryGain()`**
  - `gameProgression.js` or wherever `★` is awarded — call `player.recordMasteryGain()`

---

## SPRINT 2 — Session Flow (BE → DO → PLAY)
*Make the three-phase session explicit and navigable.*

- [ ] **BE check-in screen** — session start gate
  - `BEWorkbook.jsx` exists but may not be the session entry point
  - Should be: simple, 3–5 mood options, takes 10 seconds, sets Tone
  - Wire: answer → `recordBECheckIn()` → Truebadour greeting adjusts automatically
- [ ] **DO phase tracker** — fret practice with clear completion signal
  - `PlingTrainer.jsx` exists — audit if it marks DO complete
  - Add completion callback → feeds Resonance
- [ ] **PLAY phase** — free expression, explicit "no grade" framing
  - `GuitarWorkbench.jsx` or `PracticeRecorder.jsx` — audit for free play mode
  - UI should say "This is yours. No grade. Just play." — one line
- [ ] **Session summary screen** — what happened today
  - Brief: which fret, how you felt, one sentence from Truebadour
  - Trigger: `recordSessionComplete()` + brief animation
- [ ] **Distortion intervention** — when signal is `distorted`
  - Truebadour shifts to reflection mode automatically via `getTruebadourModifier()`
  - Optional: gentle UI indicator (no alarm, no red, just softer colors)

---

## SPRINT 3 — The Binder (blue book) as Learning Hub
*The Binder is where STORY lives. It's the student's record.*

- [ ] **Tutorial always accessible** — ✅ `TutorialMenu.jsx` exists
  - Audit: is it reachable from Binder at any time?
- [ ] **Plain language "What is this?" page**
  - Pull from `voixvive_plain_language.md` — render as a Binder tab
  - Title: "About Your Journey" or "How This Works"
- [ ] **12-fret map with somatic legend**
  - Visual showing fret → interval → emotional signature → chapter title
  - `ChromaticMonomyth.jsx` exists — audit if this is already it
  - Should be: one clean table or visual, printable
- [ ] **Guitar Economy legend** — engine made visible (once, in Binder only)
  - Tone · Resonance · Buzz · Voice · Distortion — plain English, one line each
  - "Your tone today was low — so your Truebadour went gentle."
  - Lives in Binder, not in the main session flow
- [ ] **Practice Journal** — `PracticeJournal.jsx` exists
  - Wire: `recordReflection()` on save
  - Add: one-line Truebadour response after save (acknowledgment, not evaluation)
- [ ] **MaturationMap** — `MaturationMap.jsx` exists
  - Audit: does it show Voice (long-horizon progress) clearly?
  - Should show: 12 frets, which are ○◐●★, overall arc

---

## SPRINT 4 — GAME layer (visible progression)
*What the learner actually sees as "the game".*

- [ ] **Fret mastery ○◐●★** — audit current state
  - `gameProgression.js`, `playbookData.js` — where is star state stored?
  - Ensure it's persisted and displayed consistently everywhere
- [ ] **Voice (long-horizon XP)** — where does it display?
  - `CharacterSheet.jsx` exists × 2 — audit which is active
  - Should: show total Voice, current fret chapter title
- [ ] **Streak display enhancement** — `StreakToast.jsx` exists ✅
  - Link streak → Resonance visually (high streak = warmer UI, subtle)
- [ ] **Fret 6 Ordeal moment** — special treatment for the tritone
  - When student enters Fret 6, Truebadour delivers a special message
  - "You're entering the hardest interval. The Tritone. This is The Ordeal."
  - One-time event, stored in `localStorage voixvive_ordeal_seen`

---

## SPRINT 5 — SONG layer (community / performance)
*RIFF is where music gets shared. This is the social layer.*

- [ ] **RIFF community** — `CommunityHub.jsx` exists
  - Audit current state — is it functional?
  - Minimum: students can post a recording or text note
- [ ] **Performance submissions** — `PracticeRecorder.jsx` / `MentorVideoRecorder.jsx`
  - Wire: recorded performance → submittable to RIFF
- [ ] **Mentor dashboard** — `MentorDashboard.jsx` exists
  - Audit: can Bertrand see student progress?
  - Should show: Voice level, current fret, Resonance (in plain language)

---

## SPRINT 6 — LMS / Online Academy Readiness
*Parallel Brightspace and Blackboard. Real school infrastructure.*

- [ ] **xAPI statement service** — `src/utils/xapi.js` (NEW)
  - 5 key statements to fire:
    1. `Actor attempted Activity` — session start (BE check-in)
    2. `Actor completed Activity` — session complete (PLAY phase done)
    3. `Actor progressed` — fret mastery star gained (○→◐→●→★)
    4. `Actor experienced` — Truebadour interaction (response received)
    5. `Actor mastered` — fret fully ★ complete
  - Each includes: actor (student ID), verb (xAPI verb), object (fret ID), result (score/completion), context (Voix Vive course ID)
- [ ] **LTI 1.3 launch handler** — `src/utils/ltiLaunch.js` (NEW)
  - Reads LTI launch params from URL (iss, login_hint, target_link_uri)
  - Maps `target_link_uri` to specific fret (e.g., `/fret/6`)
  - Stores LTI session context for grade passback
- [ ] **Grade passback** — after session complete
  - POST completion % back to LMS via LTI AGS (Assignment and Grade Services)
  - Score = mastery stars earned / total possible × 100
- [ ] **SCORM 1.2 export** — for legacy LMS
  - Package each fret as a SCORM module (imsmanifest.xml + content)
  - Lower priority — xAPI + LTI covers modern systems
- [ ] **Course structure metadata**
  - `src/data/courseManifest.js` (NEW) — defines 12 modules (one per fret)
  - Each module: title, description, learning objectives (Bloom's verb), estimated time, prerequisites
  - This is the "syllabus" Brightspace/Blackboard reads

---

## SPRINT 7 — Beta Polish
*Must be done before public beta.*

- [ ] **Mobile touch targets** — all interactive elements ≥ 44px
  - Audit: `PrimaryNav.jsx`, `TruebadourWidget.jsx`, all modal buttons
- [ ] **Offline mode** — what works without internet?
  - wllama fallback ✅ exists — test it
  - Truebadour offline message is clear and kind
- [ ] **Error boundaries** — `ErrorBoundary.jsx` exists ✅
  - Audit: is it wrapped around all major views?
- [ ] **Loading states** — no "AI loading" fallback text visible
  - Replace any raw loading spinners with musical equivalents (tuning, breathing)
- [ ] **12M document** — plain language version for Bertrand
  - Expand `voixvive_plain_language.md` with:
    - For students: what to expect in 12 months
    - For Bertrand: what the data shows at each milestone
    - For institutions: what standards are covered

---

## BACKLOG (future sprints)

- [ ] Archetype quiz — 4 questions → Sage/Hero/Caregiver/Jester → shapes Truebadour voice
- [ ] Interval visualizer tied to somatic legend — `IntervalVisualizer.jsx` exists, audit
- [ ] Fret → somatic → Hero's Journey chapter mapping rendered in Binder
- [ ] Kintsugi Journal — when Distortion hits `distorted`, offer a special journal entry: "cracks filled with gold"
- [ ] Certification export — completion of all 12 frets → PDF certificate (Bloom's evidence)
- [ ] Bertrand video integration — `VideoLibrary.jsx` exists — ensure Bertrand lesson videos per fret
- [ ] Multi-language — French first (Bertrand's heritage, `fr` locale already referenced in code)
- [ ] Supabase sync — user data persists across devices (Supabase already referenced in auth)

---

## NEMOTRON QUEUE
*Tasks handed directly to Nemotron for strategic analysis or code generation.*

- [ ] **Analyze `truebadourPrompt.js`** — propose exact modification to inject `playerModifier`
- [ ] **Audit `BEWorkbook.jsx`** — identify exact event where check-in answer is captured
- [ ] **Draft `courseManifest.js`** — 12-module structure with Bloom's objectives per fret
- [ ] **Draft `xapi.js`** — 5 statement templates with exact xAPI 1.0.3 data shapes
- [ ] **Analyze `MaturationMap.jsx`** — propose changes to surface Voice clearly
- [ ] **Draft xAPI + LTI architecture** — minimal backend needed (or can it be serverless?)
