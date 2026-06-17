---
title: 08_game_mode_analysis
status: archive
tags: []
date: 2026-06-14
---
# Voix Vive – Game‑Mode Focus Audit  
**Goal:** Turn the three current “game engines” into a single coherent focus system that drives daily practice and maps directly onto the Fret/Traction progression model used elsewhere in the app. All recommendations are **code‑ready**, reference existing file names, and can be dropped into the repo today.

---  

## 1️⃣ Current Focus Guidance & Pedagogical Outcomes  

| Mode | File (key) | How it Guides User Focus* | Primary Pedagogical Outcome |
|------|-------------|---------------------------|----------------------------|
| **VertiscaleEngine** – Phase 1/2 + BE_STEP → PHASE3 loop | `src/game/VertiscaleEngine.jsx` <br> (uses: `useFlashTimer`, `OrbEngine`, `PitchGateUI`) | • Forces a *breath‑first* intention (`BE_STEP`).<br>• Phase 1 = **SHEARL Flash** → visual pattern + imagined tap trains auditory memory & proprioceptive recall.<br>• Phase 2 = **PLING! Orbs** adds real‑time pitch gating, turning the same motor task into a feedback loop that ties breath to sound. | • Builds *inner ear* (interval recognition) and *body awareness* through timed flash/hold cycles + biometric logging.<br>• Scores are stored in `sessionLogger` → feeds Fret/Traction “skill points”. |
| **AdventurePlayer** – Narrative branching story with pitch gate & optional singing | `src/game/AdventurePlayer.jsx` <br> (uses: `narrativeEngine`, `PitchGateUI`) | • Starts each scene in *listening* mode → user must match a reference tone before any choice appears.<br>• The “gate” is the sole focus point; once passed, narrative branches open. Choice‑mode (`sing` vs `speak`) adds an extra layer of vocal embodiment when desired. | • Trains pitch accuracy in context (story) and links melodic contour to emotional intent – a direct somatic‑guitar link.<br>• Streaks & coaching cues reinforce habit formation via micro‑rewards after each successful gate. |
| **WalkingModeEngine** – 4 on/4 off LitRPG interval trainer for headphones, screen off | `src/game/WalkingModeEngine.jsx` <br> (uses: TROUBADOUR data, Web Speech API) | • Alternates *narration* → *listening window* → *silence*. The user’s only task during the “on” phase is to **sing** the interval they just heard; silence forces internal rehearsal. No visual UI – focus lives purely in auditory‑motor loop.<br>• Uses a simple pitch detector (`usePitchDetector`) and rewards with a chime on any detected sung pitch (POC). | • Develops *inner ear* retention while moving (embodied cognition) – the core of “walk‑and‑sing” practice for guitarists who need to internalize intervals away from the instrument.<br>• Logs each successful hit → can be mapped to Fret/Traction XP. |

\*Focus guidance = what the UI forces the user to attend to at any moment (visual, auditory, kinesthetic).  

---  

## 2️⃣ Pedagogical Mapping & Duolingo Comparison  

| Aspect | Voix Vive Current State | Duolingo‑style Gamification | What’s Better Here? | What’s Worse / Missing |
|--------|-------------------------|----------------------------|----------------------|------------------------|
| **Core Loop** | Three *separate* engines, each with its own state machine. No shared XP/level system that ties Vertiscale → Adventure → Walking progress together. | Single XP bar + skill tree; every completed lesson feeds the same progression metric. | Voix Vive’s focus on *breath‑first*, somatic awareness is unique – Duolingo has no body‑aware component. | No unified progression visible to the user → hard to see how a Vertiscale session improves Adventure performance or vice‑versa. |
| **Feedback Timing** | Immediate visual/audio flash (Phase 1), orb‑gate (Phase 2), pitch gate + optional singing (Adventure), delayed reward chime (Walking). Feedback is *task‑specific* but not aggregated into a “daily score”. | Instant XP + streaks after each lesson; visual celebrations (fireworks, level‑up). | Voix Vive gives richer biomechanical data (HRV, breath samples) that can be turned into *well‑being* feedback. | No daily XP or streak UI → users don’t get the habit‑forming dopamine hit Duolingo nails. |
| **Branching / Choice** | Adventure mode offers narrative branches; Vertiscale & Walking are linear. | Lessons are linear but skill tree lets you pick next skill after mastery. | Narrative branching adds *meaningful context* to pitch practice – a strong differentiator. | Lack of a *skill‑tree* view that shows which vertiscale patterns, adventure scenes, or walking intervals have been mastered. |
| **Social / Competitive** | None (only local biometrics). | Leaderboards, clubs, friend streaks. | Biometric data (HRV, flow) could become a *well‑being leaderboard* – a novel angle for music ed. | No social hooks → lower long‑term retention. |
| **Monetization / Gates** | None currently; all modes free. | Hearts, premium subscription, timed lives. | Free‑first approach aligns with the academy’s ethos (no paywall for core pedagogy). | Missing *progression gates* that could encourage optional premium content (e.g., advanced vertiscale patterns, exclusive adventure arcs) without blocking learning. |

**Takeaway:** Voix Vive already has superior *pedagogical depth* (breath‑first, somatic, biometric) but lacks the *unified gamified progression* that makes Duolingo sticky. The fix is to **wrap the three engines in a shared game state** and expose a simple XP/level/dashboard UI.

---  

## 3️⃣ Unified Game Dashboard – Design & File‑Level Blueprint  

### 3.1 High‑Level Structure  

```
/src
  /components
    GameDashboard.jsx          ← top‑level container (route: /app/game)
    GameModeSelector.jsx       ← tabs / drawer for Vertiscale, Adventure, Walking
    GameProgressBar.jsx        ← shows XP, level, Fret/Traction tier, daily streak
    GameDailyRewards.jsx       ← streaks, freeze items, bonus XP popup
  /hooks
    useGameProgress.js         ← reads/writes Supabase `game_progress` table (XP, level, streaks)
    useVertiscaleEngine.js     ← thin wrapper that extracts state‑machine logic from VertiscaleEngine.jsx
    useAdventureEngine.js      ← same for AdventurePlayer.jsx
    useWalkingEngine.js        ← same for WalkingModeEngine.jsx
  /game
    VertiscaleEngine.jsx       ← refactored to be a *pure* UI component receiving props from hooks
    AdventurePlayer.jsx        ← same
    WalkingModeEngine.jsx      ← same
```

### 3.2 Core Hook – `useGameProgress.js` (≈30 LOC)

```tsx
// src/hooks/useGameProgress.js
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient'; // assuming you already have a Supabase init

export function useGameProgress(userId) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading]   = useState(true);

  // Load once on mount
  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    supabase
      .from('game_progress')
      .select('*')
      .eq('user_id', userId)
      .single()
      .then(({ data, error }) => {
        if (error && error.code !== 'PGRST116') console.error(error);
        setProgress(data || { xp:0, level:0, streak:0, lastPlayed:null });
        setLoading(false);
      });
  }, [userId]);

  const addXP = async (amount) => {
    if (!progress) return;
    const newXP = progress.xp + amount;
    const newLevel = Math.floor(newXP / 1000); // 1000 XP per level – tweak as needed
    await supabase
      .from('game_progress')
      .upsert({ user_id: userId, xp:newXP, level:newLevel, streak:progress.streak, lastPlayed: new Date().toISOString() })
      .onConflict('user_id');
    setProgress(p => ({ ...p, xp:newXP, level:newLevel }));
  };

  const incrementStreak = async () => {
    if (!progress) return;
    const today = new Date().toISOString().slice(0,10);
    const lastPlayed = progress.lastPlayed ? new Date(progress.lastPlayed).toISOString().slice(0,10) : null;
    const newStreak = (lastPlayed === today) ? progress.streak + 1 : 1;
    await supabase
      .from('game_progress')
      .upsert({ user_id: userId, streak:newStreak, lastPlayed: new Date().toISOString() })
      .onConflict('user_id');
    setProgress(p => ({ ...p, streak:newStreak }));
  };

  return { progress, loading, addXP, incrementStreak };
}
```

*Why this helps:* All three engines can now call `addXP(XP_PER_ROUND)` and `incrementStreak()` after a successful round/scenes. The dashboard reads the same `progress` object, guaranteeing a **single source of truth** for Fret/Traction level, XP, and daily streak.

### 3.3 Refactoring the Engines (example – VertiscaleEngine)

1. **Extract pure UI** – keep only JSX and presentation logic.
2. **Move state‑machine & scoring** into a custom hook `useVertiscaleEngine` that returns:
   - `engineState`, `setEngineState`
   - `startFlash`, `startHoldRound`, `submitTaps`, etc.
   - `currentScore`, `round`, `pattern`
3. **Consume the game‑progress hook** inside the UI component to award XP/streak.

```tsx
// src/hooks/useVertiscaleEngine.js (≈120 LOC – copy/paste the logic from VertiscaleEngine.jsx, strip JSX)
import { useState, useCallback, useEffect, useRef } from 'react';
import { useFlashTimer } from '../hooks/useFlashTimer';
import { usePitchDetector } from '../hooks/usePitchDetector';
import { computePhase1Score, computeSustainScore, checkStreakEligible, computePhaseUnlock } from './scoreCalculator';
// … import other helpers …

export function useVertiscaleEngine({ rootNote, scaleType, difficulty, onSessionComplete }) {
  // all the state & effects that previously lived inside VertiscaleEngine.jsx
  // return an object with:
  return {
    engineState,
    setEngineState,
    startFlash,
    startHoldRound,
    submitTaps,
    submitHold,
    flashState,
    tapProgressPct,
    holdProgressPct,
    pattern,
    round,
    roundScores,
    // … plus any callbacks needed …
  };
}
```

Then the **UI component** becomes:

```tsx
// src/game/VertiscaleEngine.jsx (refactored)
import React from 'react';
import { useVertiscaleEngine } from '../hooks/useVertiscaleEngine';
import { useGameProgress } from '../hooks/useGameProgress';
import GameFretboard from './GameFretboard';
import OrbEngine from './OrbEngine';
import PitchGateUI from './PitchGateUI';
import NeckMenu from '../components/NeckMenu';
import { useNavigate, useLocation } from 'react-router-dom';
import { useLocale } from '../hooks/useLocale';

export default function VertiscaleEngine({ onClose }) {
  const navigate = useNavigate();
  const { t } = useLocale();
  const { user } = useAuth(); // assuming you have an auth hook; otherwise pull from context
  const { progress, addXP, incrementStreak } = useGameProgress(user?.id);
  const engine = useVertiscaleEngine({
    rootNote: /* … */,
    scaleType: /* … */,
    difficulty: /* … */,
    onSessionComplete: async (scores, logs) => {
      // award XP based on average score
      const avg = scores.reduce((a,b)=>a+b,0)/scores.length;
      const xpGain = Math.round(avg * 10); // tune factor
      await addXP(xpGain);
      await incrementStreak();
      if (onSessionClose) onSessionClose(); // optional
    }
  });

  // … render JSX using engine.* values …
  // Example: <GameFretboard pattern={engine.pattern} onTap={engine.handleTap} />
}
```

Apply the same pattern to `AdventurePlayer.jsx` and `WalkingModeEngine.jsx`. The **only** thing that stays in each file is the presentational JSX + any mode‑specific UI (e.g., Adventure’s scene art, Walking’s status ring). All heavy logic lives in the hooks.

### 3.4 GameDashboard Component (route `/app/game`)

```tsx
// src/components/GameDashboard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@reach/tabs'; // or your UI lib of choice
import GameModeSelector from './GameModeSelector';
import GameProgressBar from './GameProgressBar';
import GameDailyRewards from './GameDailyRewards';
import VertiscaleEngine from '../game/VertiscaleEngine';
import AdventurePlayer from '../game/AdventurePlayer';
import WalkingModeEngine from '../game/WalkingModeEngine';

export default function GameDashboard({ onClose }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = React.useState('vertiscale'); // default

  return (
    <div style={{ minHeight: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      {/* Top bar – progress + rewards */}
      <header style={{ padding: '12px 16px', background: 'rgba(8,8,14,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <GameProgressBar />
        <GameDailyRewards />
      </header>

      {/* Tabs to switch modes */}
      <Tabs>
        <TabList>
          <Tab onClick={() => setActiveTab('vertiscale')}>Vertiscale</Tab>
          <Tab onClick={() => setActiveTab('adventure')}>Adventure</Tab>
          <Tab onClick={() => setActiveTab('walking')}>Walking</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {activeTab === 'vertiscale' && (
              <VertiscaleEngine onClose={onClose} />
            )}
          </TabPanel>
          <TabPanel>
            {activeTab === 'adventure' && (
              <AdventurePlayer onClose={onClose} />
            )}
          </TabPanel>
          <TabPanel>
            {activeTab === 'walking' && (
              <WalkingModeEngine onClose={onClose} />
            )}
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
```

**Routing:** Add a single route in `App.jsx` (or your router file):

```tsx
import { GameDashboard } from './components/GameDashboard';
...
<Route path="/app/game" element={<GameDashboard onClose={() => navigate(-1)} />} />
```

*Result:* Users land at `/app/game`, see their XP/level/streak bar, pick a mode via tabs, and **all modes share the same progression data**. No duplicate state; no scattered XP logic.

---  

## 4️⃣ Missing Mechanics for Daily Retention (Beta‑Ready)

| Mechanic | Why it matters for Voix Vive | Quick Implementation Sketch |
|----------|-----------------------------|-----------------------------|
| **Daily Streak UI + “Streak Freeze”** (biometric‑based) | Encourages habit; freeze can be earned when HRV > baseline (indicates good recovery). | In `useGameProgress.js` add `earnFreeze()` that checks latest `activeBiometrics.hrv` (from `useBackendBridge`) and, if above user’s 7‑day avg +10%, grants a freeze token stored in Supabase (`game_progress.freezeCount`). UI shows a shield icon; on missed day, consume a freeze instead of breaking streak. |
| **XP‑Based Level Badges tied to Fret/Traction** | Makes the abstract “Fret/Traction” progression visible and rewarding. | Define thresholds: Level 1 = “Novice”, Level 5 = “Intermediate”, Level 10 = “Advanced”. In `GameProgressBar.jsx` render a badge icon + tooltip using `progress.level`. When level increments, fire a confetti animation (`framer-motion` `<AnimatePresence>`). |
| **Adventure‑Mode Narrative Rewards** | Completing an adventure arc should unlock exclusive vertiscale patterns or walking intervals. | Add a table `arc_completions(user_id, arc_id)`. In `useAdventureEngine.js`, after an ending scene, insert a row and call `unlockReward(arc_id)` which adds a new pattern to the user's `availablePatterns` array (stored in Supabase). UI shows a “New Pattern!” toast. |
| **Social Leaderboard (Opt‑In)** | Light competition boosts retention without compromising privacy. | Create a Supabase function `get_leaderboard(limit)` that returns top 10 users by `xp` (or `streak`). In `GameDashboard.jsx` add a “Leaderboard” button that opens a modal showing avatars, names, XP, and a “Well‑Being” column (average HRV). Only show if user toggles `shareProgress = true` in settings. |
| **Micro‑Challenge Notifications** | Short, time‑boxed goals drive daily opens. | Use a Supabase cron (or Netlify function) to push a daily challenge: e.g., “Play Vertiscale in C minor pentatonic for 3 rounds → +50 XP”. Store pending challenges in `user_challenges`. When user completes, award XP and clear the challenge. Show a bell badge in the top‑bar. |
| **Well‑Being Feedback Card** | Leverages the unique biometric data to differentiate from Duolingo. | In `GameDashboard.jsx` render a small card: “Your Flow: X.X • HRV: Y ms • Stress: Z”. Update it each frame from `useBackendBridge`. When values are in optimal range, grant a small XP bonus (“Zen Bonus”). |

All of the above can be **added incrementally**; none require a redesign of the core engines—just hook calls and UI tweaks.

---  

## 5️⃣ Navigation Recommendation – Where Does Game Live?

| Option | Pros | Cons | Verdict for Beta |
|--------|------|------|-----------------|
| **A. Top‑level destination `/app/game`** (as proposed) | • Clear entry point; progress bar always visible.<br>• Easy to add shared UI (XP, streaks, rewards).<br>• Keeps game logic isolated from lesson/content pages → simpler routing. | • Requires an extra tap to reach a mode if the user is currently in a lesson page. | **Recommended** – gives the unified dashboard a home and makes the progression system immediately visible. |
| **B. Embedded game entry on every page** (e.g., a floating “Play” button) | • Zero‑click access; users can start a mode from anywhere.<br>• Reinforces that practice is always available. | • UI clutter; risk of accidental launches.<br>• Harder to show a consistent progress bar (would need to be duplicated or pulled via context). | **Nice‑to‑have** as a secondary shortcut (e.g., a Fab button) *after* the dashboard is live. |
| **C. Game as a sub‑tab inside each lesson page** | • Contextual practice (e.g., after a theory lesson, jump to Vertiscale in that key). | • Fragments the XP system; each page would need its own progress sync.<br>• Increases complexity of route guards. | **Not recommended** for beta – adds unnecessary coupling. |

**Implementation:** Add the `/app/game` route (see §3.4) and keep the existing lesson/routes (`/lessons/*`, `/practice/*`) unchanged. Optionally, add a **Floating Action Button** (FAB) in `App.jsx` that calls `navigate('/app/game')` for quick access—this can be toggled off later if UI feels crowded.

---  

## 6️⃣ Prioritized Action List for Beta Launch (Impact → Effort)

| Priority | Task | Files to Touch | Estimated Effort |
|----------|------|----------------|-----------------|
| **1** | Create `useGameProgress` hook + Supabase table (`game_progress`). Add XP & streak calls in each engine’s completion callback. | `src/hooks/useGameProgress.js`, migration SQL, `src/game/VertiscaleEngine.jsx`, `AdventurePlayer.jsx`, `WalkingModeEngine.jsx` (completion callbacks) | 2‑3 h |
| **2** | Refactor each engine: extract state‑machine into `use*Engine` hooks; keep JSX thin. | `src/hooks/useVertiscaleEngine.js`, `useAdventureEngine.js`, `useWalkingEngine.js` + corresponding `.jsx` files (strip logic) | 4‑5 h |
| **3** | Build `GameDashboard.jsx` with tabs, progress bar, rewards UI; wire route. | `src/components/GameDashboard.jsx`, `GameProgressBar.jsx`, `GameDailyRewards.jsx`, `App.jsx` (route add) | 3‑4 h |
| **4** | Implement daily streak logic + freeze token (biometric‑based). | `src/hooks/useGameProgress.js` (add HRV check), `src/components/GameDailyRewards.jsx` (UI), optional tweak to `useBackendBridge` to expose latest HRV. | 2‑3 h |
| **5** | Add level badge & XP-to-level conversion in progress bar. | `src/components/GameProgressBar.jsx` (logic + UI) | 1‑2 h |
| **6** | (Optional but high‑value) Adventure arc completion reward → unlock new vertiscale pattern. | `src/hooks/useAdventureEngine.js` (DB write), `src/hooks/useVertiscaleEngine.js` (read unlocked patterns), small UI toast. | 2‑3 h |
| **7** | (Optional) Leaderboard modal – requires Supabase RLs & a simple fetch. | `src/components/LeaderboardModal.jsx`, `src/hooks/useLeaderboard.js`. | 2‑3 h |

*Total core effort for a shippable unified game system*: **≈15‑18 hours** (well within a bug‑fixing session if the team splits tasks).

---  

### 📌 TL;DR – What to Ship Today

1. **Unified progress hook** (`useGameProgress`) that writes XP/streaks to Supabase and reads them for the dashboard.  
2. **Thin‑wrapper hooks** for each engine (`useVertiscaleEngine`, `useAdventureEngine`, `useWalkingEngine`).  
3. **`GameDashboard` component** at `/app/game` with tabs, XP/level bar, streak UI, and mode‑specific screens rendered via the thin wrappers.  
4. **Streak‑freeze mechanic** using HRV from `useBackendBridge`.  
5. **Level badge** in the progress bar to make Fret/Traction tangible.  

Once these are live, every practice session—whether a flash round, an adventure scene, or a walking interval—feeds the same visible progression system, giving students the *focus‑guiding*, *somatic‑rich* experience Voix Vive promises while delivering the habit‑forming power Duolingo is known for.  

---  

**Ready to code?** Start with `src/hooks/useGameProgress.js` and the route addition; the rest follows naturally. Good luck with the beta launch! 🎸✨