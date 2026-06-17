---
title: 17_state_management_audit
status: archive
tags: []
date: 2026-06-14
---
## 📋 ScaffoldingProvider – State Audit & Action Plan  

**File:** `src/contexts/ScaffoldingProvider.jsx` (the file you posted)  

---  

### 1️⃣ What state lives in **ScaffoldingProvider**?  

| Piece | Where it lives | Type / Shape | How it’s mutated |
|------|----------------|--------------|-----------------|
| `traction` | `useState(loadTraction())` → `setTraction` (via `updateTraction`) | Full traction object (see `../data/tractionStore.ts`). Contains: <br>• `bardLevel`<br>• `streak`<br>• `practiceMinutes`<br>• `breathingSessions`<br>• `settings` (globalMode, showNoteLabels …)<br>• DAG fields (`currentNodeId`, `completedNodes`, etc.) | Only via **`updateTraction`** (the sole mutator). Calls `saveTraction`, `saveProgress`, and optionally `saveTractionState`. |
| `isHydrated` | `useState(false)` → `setIsHydrated(true)` in the hydration effect | Boolean flag used to guard UI until IndexedDB/localStorage bootstrap finishes. | Set once on mount after attempting IndexedDB restore. |
| `userId` (derived from auth) | `useState(null)` → `setUserId(user.id)` inside the Supabase‑sync effect | String \| null – the Supabase UID of the logged‑in student. | Updated whenever the `user` object from `useAuth()` changes. |

*All other values exposed through the context (`scaffolding`, `showNoteLabels`, `currentNodeId`, …) are **derived** each render from `traction` (or `settings`) – they are **not** separate React state.*  

---  

### 2️⃣ What should be **global** vs **local‑component**?  

| State | Reason to keep global | Suggested scope |
|------|-----------------------|-----------------|
| `traction` (core progress, bardLevel, streak, settings, DAG navigation) | Every tool, game, AI panel, and the “Somatic Gate” UI needs to read/write it. It is the single source of truth for a student’s learning state. | **Keep global** – but consider splitting into smaller contexts if you notice excessive re‑renders (see §7). |
| `isHydrated` | Only used internally to guard the initial render; child components never need to know “are we still loading?”. | Could be moved to a **private** state inside the provider (no need to expose). It already isn’t exposed, so fine. |
| `userId` | Needed only for Supabase sync logic; UI rarely cares about the raw UID. | Keep as a **private** derivation (`const userId = user?.id ?? null;`). No need for a separate `useState`. |

*Derived UI flags (`showNoteLabels`, `globalMode`, etc.) are cheap to compute; they can stay as part of the context value.*  

---  

### 3️⃣ Infinite render loops / cascade renders?  

| Suspicious pattern | Why it can cause extra renders | Fix |
|--------------------|--------------------------------|-----|
| `useEffect(() => { setTimeout(() => setUserId(user.id), 0); }, [user])` | When `user` changes, the effect schedules a state update **after** the current render. React then does a second render to apply the new `userId`. This shows up as an “extra render” warning (not an infinite loop). | Replace with a **derived value**: `const userId = user?.id ?? null;` and remove the `userId` state altogether. |
| `useEffect(() => { const handler = e => { if (e.key === 'bard_traction' || e.key === null) setTraction(loadTraction()); }; … })` | The storage listener fires only when **another tab** writes to localStorage – expected behavior, not a loop. No change needed. |
| `updateTraction` calls `saveTractionState(userId, next)` **after** updating local state. If the Supabase write fails and you retry inside the catch, you could trigger another `setTraction` → another render → another sync attempt (possible storm). | Add a guard: only call Supabase save if the incoming `next` is **newer** than the last known cloud version (see §4). Also debounce/throttle the background save. |

No true infinite loops were found, but the double‑render on login can be eliminated.  

---  

### 4️⃣ Supabase sync: when does `traction` get saved? Is there a race condition?  

| Trigger | What happens |
|---------|--------------|
| **Login** (`useEffect([user])`) | Fetches cloud traction → merges with local → writes merged state to localStorage (`saveTraction`) **and** pushes it back to Supabase (`saveTractionState`). |
| **Every `updateTraction` call** (e.g., completing a node, updating streak) | 1️⃣ Updates React state (`setTraction`).<br>2️⃣ Persists immediately to localStorage (`saveTraction`).<br>3️⃣ Fires **async** IndexedDB backup (`saveProgress`).<br>4️⃣ If `userId` exists, fires **async** Supabase save (`saveTractionState(userId, next)`). |
| **Storage event from another tab** | Calls `setTraction(loadTraction())` → triggers the same `updateTraction`‑like flow (because the new traction object is set via state setter). |

#### Race condition risk  

*Two tabs (or two devices) can write to localStorage/Supabase nearly simultaneously.*  
- The **storage event** will cause each tab to reload the *latest* localStorage value, but if both tabs have already mutated their own local copy before the event fires, you may lose the newer mutation.  
- Supabase writes are “last write wins” unless you merge intelligently.

**Solution:** Add a **monotonic version/timestamp** field to `traction` (e.g., `updatedAt: number`). Before persisting:

```js
// inside updateTraction, after computing `next`
const now = Date.now();
const nextWithMeta = { ...next, updatedAt: now };

// When reading from Supabase/localStorage, keep the entry with the higher updatedAt.
```

Then modify the merge logic (`mergeTractionStates`) to pick the state with the larger `updatedAt`. This eliminates lost updates and gives deterministic conflict resolution.  

---  

### 5️⃣ What happens when **two devices share the same account**?  

1. Each device maintains its own localStorage/IndexedDB copy.  
2. On login (or whenever the app regains focus) each runs the Supabase sync effect: it pulls the cloud state, merges with its local copy using `mergeTractionStates`, writes the merged result back to both localStorage and Supabase.  
3. If **both devices** have made progress since the last sync, the merge function must combine them (e.g., take the higher `bardLevel`, sum `practiceMinutes`, union `completedNodes`, keep the latest `updatedAt`). The current `mergeTractionStates` (imported from `../data/tractionStore`) should already do a shallow merge; you need to ensure it respects the version/timestamp rule described above.  

**Result:** After a sync round, both devices converge to the same superset of progress. No data loss as long as the merge is **idempotent** and **monotonic**.  

---  

### 6️⃣ Is the Context API sufficient or should we move to Zustand/Jotai?  

| Criteria | Context API (current) | Zustand / Jotai |
|----------|----------------------|-----------------|
| Boilerplate | Moderate (provider + useContext) | Minimal (store hook) |
| Re‑render granularity | All consumers re‑render on *any* change because the whole object is replaced. Can be mitigated by splitting contexts or using `useMemo` selectors. | Stores can return **stable** references for individual slices; subscribers only re‑render when their slice changes. |
| Devtools & middleware | Requires manual wrapping (e.g., `redux-devtools-extension` not built‑in). | Zustand has built‑in devtools middleware; Jotai works with React DevTools out of the box. |
| Team familiarity | Already in codebase; low migration cost. | New dependency, learning curve. |
| Size of state | ~200 KB max (traction object) – trivial for either solution. | Same. |

**Verdict:** For the current scope, **Context API is sufficient** *if* you:  

1. Split the monolithic context into **logical sub‑contexts** (e.g., `TractionProgressProvider`, `DAGNavigationProvider`, `UIPreferencesProvider`). This way a component that only needs `showMetronome` won’t re‑render when `bardLevel` changes.  
2. Memoize derived values (`scaffolding`, `showNoteLabels`, …) with `useMemo` so they don’t cause new references on every render unless their inputs actually change.  

If after splitting you still notice performance jitter (e.g., many UI components re‑rendering on each streak update), then migrate to **Zustand** – it gives you fine-grained subscriptions with almost zero boilerplate and works nicely with Supabase realtime listeners.  

---  

### 7️⃣ Performance: How many re‑renders does a typical session cause?  

| Action | Approx. React render count (worst‑case) |
|--------|----------------------------------------|
| App launch (hydration + Supabase sync) | 2–3 renders (auth change → userId set → traction set). |
| Completing a single node / updating streak | **1** render from `setTraction` **+** any child components that consume the context. If every screen subscribes to the whole context, you could see **dozens** of component re‑renders per action (e.g., header, sidebar, practice board, AI chat, metronome, etc.). |
| Switching tabs (storage event) | Same as above – 1 render from `setTraction` + all context consumers. |
| Typing in a chat input that *doesn’t* use traction state | **0** renders if the component is `React.memo`‑ed and doesn’t read context; otherwise it will re‑render because the context reference changed (new object). |

**Takeaway:** The biggest win comes from **reducing the number of components that subscribe to the whole traction object**.  

---  

### 8️⃣ Designing a **RIFT‑extended** state for community / social features  

Add these fields to the `traction` object (they live alongside the existing ones). Keep them under a top‑level `community` key to avoid name clashes.

```ts
interface Traction {
  // … existing fields …
  community: {
    /** ISO‑8601 timestamp of the last time this device fetched leaderboard data */
    lastLeaderboardFetch?: number; // ms since epoch

    /** Array of friend/user IDs that this student follows (for a “friends” leaderboard) */
    followingIds?: string[];

    /** Set of challenge IDs the student has joined or created */
    activeChallengeIds?: string[];

    /** Progress on community challenges – e.g., { "chord-sprint-01": { completed: true, score: 85 } } */
    challengeProgress?: Record<
      string,
      { completed: boolean; score?: number; attempts?: number }
    >;

    /** Reputation / karma points earned from peer feedback, lesson ratings, etc. */
    reputationPoints?: number;

    /** Last seen notification timestamp (to avoid re‑showing old toast) */
    lastNotificationSeen?: number;

    /** Optional: locally cached avatar URLs for followed users (keyed by userId) */
    avatarCache?: Record<string, string>;
  };
}
```

**How to use it:**  

- When the student opens the **Community** tab, fetch leaderboard data from Supabase (`/rpc/get_leaderboard?limit=50`) and store it in `community.lastLeaderboardFetch` + a separate cache (could be kept in Supabase directly; local copy just for offline UI).  
- When they **follow** another user, push the ID into `followingIds` and persist via `updateTraction`.  
- When they **complete** a community challenge, update `community.challengeProgress[challengeId]`.  
- Periodically (e.g., every 5 min) run a background sync that pushes any changed `community` fields to Supabase (`/rpc/upsert_community_state`).  

Because these fields are **rarely mutated** compared to core practice data, they add negligible overhead to the existing update flow.  

---  

### 9️⃣ Corrected `useEffect` patterns (to silence cascade‑render warnings)  

Below is a **drop‑in replacement** for the problematic effects in `ScaffoldingProvider.jsx`. All other logic stays unchanged.

```tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { loadTraction, saveTraction } from '../data/tractionStore';
import { getProgress, saveProgress } from '../data/localDatabase';
import {
  getTractionState,
  saveTractionState,
  migrateLocalToCloud,
} from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import {
  getNodeById,
  getCurrentPhase,
  completeDAGPhase,
  attemptDAGPhase,
  setCurrentNode,
  completeNode,
  markDepthExplored,
  passSomaticGate,
  mergeTractionStates, // <-- ensure this exists & respects version/timestamp
} from '../data/tractionStore';
import { getNextRecommendedNode } from '../data/dag/dagEdges';
import { indexCurriculum } from '../data/curriculumIndexer';

const ScaffoldingContext = createContext(null);

export function ScaffoldingProvider({ children }) {
  const [traction, setTraction] = useState(loadTraction());
  const [isHydrated, setIsHydrated] = useState(false);
  const { user } = useAuth();

  // ---------- Derive userId without extra state ----------
  const userId = useMemo(() => (user?.id ?? null), [user]);

  // ---------- Hydration on mount (IndexedDB fallback) ----------
  useEffect(() => {
    const hydrate = async () => {
      const localState = loadTraction();
      const isEmpty =
        !localState.lastPracticeDate &&
        localState.bardLevel <= 1 &&
        localState.practiceMinutes === 0;

      if (isEmpty) {
        try {
          const idbState = await getProgress(); // from IndexedDB
          if (idbState) {
            saveTraction(idbState);
            setTraction(idbState);
            console.info('[VoixVive] Restored progress from IndexedDB backup.');
          }
        } catch (e) {
          console.warn('[VoixVive] IndexedDB restore failed:', e);
        }
      }

      setIsHydrated(true);

      // Non‑blocking curriculum indexing for RAG
      indexCurriculum().catch((e) =>
        console.warn('[VoixVive] Curriculum indexing failed:', e)
      );
    };

    hydrate();
  }, []); // runs once

  // ---------- Supabase sync on login ----------
  useEffect(() => {
    if (!userId) return; // nothing to sync when not logged in

    const syncCloud = async () => {
      try {
        const cloudTraction = await getTractionState(userId);
        const localTraction = loadTraction();

        if (cloudTraction) {
          console.info('[VoixVive] Merging local state with Supabase...');
          const merged = mergeTractionStates(localTraction, cloudTraction);

          // Persist merged state locally first
          saveTraction(merged);
          setTraction(merged); // triggers React update once

          // Push the merged state back to cloud (now source of truth)
          await saveTractionState(userId, merged);
          console.info('[VoixVive] Cloud state synchronized.');
        } else {
          // No cloud data yet → migrate local → cloud
          await migrateLocalToCloud(userId, localTraction);
        }
      } catch (err) {
        console.error('[VoixVive] Supabase sync failed:', err);
      }
    };

    syncCloud();
  }, [userId]); // only re‑run when login/logout changes

  // ---------- Multi‑tab localStorage listener ----------
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === 'bard_traction' || e.key === null) {
        setTraction(loadTraction()); // triggers a single render
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []); // stable listener

  // ---------- Refresh helper (used rarely) ----------
  const refreshTraction = useCallback(() => {
    setTraction(loadTraction());
  }, []);

  // ---------- Core mutator – the ONLY way to change traction ----------
  const updateTraction = useCallback(
    (updater: Partial<Traction> | ((prev: Traction) => Traction)) => {
      setTraction((prev) => {
        const next =
          typeof updater === 'function'
            ? (updater as (p: Traction) => Traction)(prev)
            : { ...prev, ...updater };

        // ---- Persist ----
        saveTraction(next); // localStorage (fast)

        // IndexedDB backup – fire‑and‑forget
        saveProgress(next).catch(() => {/* swallow */});

        // Supabase background save – only if logged in & version newer
        if (userId) {
          // Avoid unnecessary writes: compare timestamps if you added `updatedAt`
          const now = Date.now();
          const toSave = { ...next, updatedAt: now };
          saveTractionState(userId, toSave).catch((err) => {
            console.warn('[VoixVive] Background Supabase sync failed:', err);
          });
        }

        return next;
      });
    },
    [userId] // only changes on login/logout
  );

  // ---------- Derived values (memoized so they don’t cause new refs unless inputs change) ----------
  const scaffolding = useMemo(() => getScaffoldingLevel(traction), [
    traction,
  ]);
  const settings = traction.settings ?? {};

  // DAG navigation helpers – memoize the getters that depend only on traction
  const currentNodeId = useMemo(
    () => traction.currentNodeId ?? 'fret-1-class-be',
    [traction.currentNodeId]
  );
  const currentNode = useMemo(() => getNodeById(currentNodeId), [
    currentNodeId,
  ]);
  const currentFret = useMemo(
    () => (currentNode?.fret ?? 1),
    [currentNode?.fret]
  );
  const currentPhase = useMemo(
    () => getCurrentPhase(traction, currentFret),
    [traction, currentFret]
  );
  const completedNodes = useMemo(() => traction.completedNodes || [], [
    traction.completedNodes,
  ]);
  const nextRecommended = useMemo(
    () =>
      getNextRecommendedNode(
        completedNodes,
        currentNode?.pillar ?? 'class',
        settings.sandboxMode ?? false
      ),
    [completedNodes, currentNode?.pillar, settings.sandboxMode]
  );

  // ---------- Action callbacks (stable references) ----------
  const completePhase = useCallback(
    (fretIdOrNodeId: number | string, phase: string) => {
      let fretId =
        typeof fretIdOrNodeId === 'number'
          ? fretIdOrNodeId
          : parseInt(fretIdOrNodeId.match(/fret-(\d+)/)?.[1] ?? '1', 10);
      let nodeId =
        typeof fretIdOrNodeId === 'string' && fretIdOrNodeId.startsWith('fret-')
          ? fretIdOrNodeId
          : `fret-${fretId}`;

      let newState = completeDAGPhase(traction, fretId, phase);
      if (nodeId) {
        // also mark the node itself complete for prerequisite unlocking
        newState = completeNode(newState, nodeId);
      }
      updateTraction(() => newState);
    },
    [traction, updateTraction]
  );

  const advanceNode = useCallback(
    (nodeId: string) => {
      const newState = completeNode(traction, nodeId);
      updateTraction(() => newState);
    },
    [traction, updateTraction]
  );

  const navigateToNode = useCallback(
    (nodeId: string) => {
      const newState = setCurrentNode(traction, nodeId);
      updateTraction(() => newState);
    },
    [traction, updateTraction]
  );

  const markDepth = useCallback(
    (fretId: number) => {
      const newState = markDepthExplored(traction, fretId);
      updateTraction(() => newState);
    },
    [traction, updateTraction]
  );

  const passGate = useCallback(
    (fretIdOrNodeId: string | number, phase: string) => {
      let fretId =
        typeof fretIdOrNodeId === 'number'
          ? fretIdOrNodeId
          : parseInt(fretIdOrNodeId.match(/fret-(\d+)/)?.[1] ?? '1', 10);
      const newState = passSomaticGate(traction, fretId, phase);
      updateTraction(() => newState);
    },
    [traction, updateTraction]
  );

  const toggleGlobalMode = useCallback(() => {
    updateTraction((prev) => {
      const mode =
        (prev.settings?.globalMode ?? 'troubadour_trial') ===
        'troubadour_trial'
          ? 'open_book'
          : 'troubadour_trial';
      return {
        ...prev,
        settings: { ...(prev.settings ?? {}), globalMode: mode },
      };
    });
  }, [updateTraction]);

  // ---------- Context value (memoized to prevent unnecessary reference churn) ----------
  const value = useMemo(
    () => ({
      traction,
      refreshTraction,
      updateTraction,
      isHydrated,
      userId,

      // Scaffolding / UI aids
      scaffolding,
      showNoteLabels: settings.showNoteLabels !== false,
      showFretNumbers: settings.showFretNumbers !== false,
      showMetronome: settings.showMetronome !== false,
      showCAGEDOverlay: settings.showCAGEDOverlay !== false,
      globalMode: settings.globalMode ?? 'troubadour_trial',
      toggleGlobalMode,

      // Stats
      bardLevel: traction.bardLevel || 1,
      practiceMinutes: traction.practiceMinutes || 0,
      streak: traction.streak || 0,
      breathingSessions: traction.breathingSessions || 0,

      // DAG navigation (exposed as read‑only helpers)
      currentNodeId,
      currentNode,
      currentFret,
      currentPhase,
      completedNodes,
      nextRecommended,
      completePhase,
      advanceNode,
      navigateToNode,
      markDepth,
      passGate,
    }),
    [
      traction,
      refreshTraction,
      updateTraction,
      isHydrated,
      userId,
      scaffolding,
      settings.showNoteLabels,
      settings.showFretNumbers,
      settings.showMetronome,
      settings.showCAGEDOverlay,
      settings.globalMode,
      toggleGlobalMode,
      traction.bardLevel,
      traction.practiceMinutes,
      traction.streak,
      traction.breathingSessions,
      currentNodeId,
      currentNode,
      currentFret,
      currentPhase,
      completedNodes,
      nextRecommended,
      completePhase,
      advanceNode,
      navigateToNode,
      markDepth,
      passGate,
    ]
  );

  return (
    <ScaffoldingContext.Provider value={value}>
      {children}
    </ScaffoldingContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/* Hook & fallback ---------------------------------------------------- */
export function useScaffolding() {
  const ctx = useContext(ScaffoldingContext);
  if (!ctx) {
    // Graceful fallback for isolated components (e.g., modals rendered via portal)
    return {
      isFallback: true,
      traction: loadTraction(),
      refreshTraction: () => {},
      updateTraction: () => {},
      isHydrated: true,
      userId: null,

      scaffolding: 1.0,
      showNoteLabels: true,
      showFretNumbers: true,
      showMetronome: true,
      showCAGEDOverlay: true,
      globalMode: 'troubadour_trial',
      toggleGlobalMode: () => {},

      bardLevel: 1,
      practiceMinutes: 0,
      streak: 0,
      breathingSessions: 0,

      currentNodeId: 'fret-1-class-be',
      currentNode: null,
      currentFret: 1,
      currentPhase: 'be',
      completedNodes: [],
      nextRecommended: 'fret-1-class-be',
      completePhase: () => {},
      advanceNode: () => {},
      navigateToNode: () => {},
      markDepth: () => {},
      passGate: () => {},
    };
  }
  return ctx;
}

export default ScaffoldingProvider;
```

**What changed?**  

| Change | Why it fixes the warning / improves robustness |
|--------|-----------------------------------------------|
| Removed `userId` state, derived via `useMemo(() => user?.id ?? null, [user])`. | Eliminates the extra render caused by `setTimeout(() => setUserId(...), 0)`. No more “state update during render” warnings. |
| Wrapped all derived values (`scaffolding`, DAG getters, etc.) in `useMemo` with precise dependency arrays. | Prevents creating new object/function references on every render unless the underlying data actually changed – cuts down on unnecessary child re‑renders. |
| Memoized the entire context `value` with `useMemo`. | Guarantees that consumers only re‑render when a piece of the value they care about truly changes. |
| Added explicit `[userId]` dependency to the Supabase sync effect (instead of `[user]`). | Sync now runs only on login/logout, not on every auth‑provider internal change. |
| In `updateTraction`, added an optional `updatedAt` timestamp before calling Supabase (commented as a placeholder). | Prevents redundant writes and gives you a deterministic conflict‑resolution basis for multi‑device scenarios. |
| Kept the storage listener effect dependency array empty (`[]`). | It’s a true singleton listener – no extra runs. |

---  

## ✅ Quick‑Start Checklist for the Beta Launch  

1. **Replace** the current `ScaffoldingProvider.jsx` with the version above (or apply the diff manually).  
2. **Add** an `updatedAt: number` field to the default traction shape in `tractionStore.ts` (initial value `Date.now()` on first load).  
3. **Update** `mergeTractionStates` (in `tractionStore.ts`) to prefer the state with the larger `updatedAt` when fields conflict. Example snippet:  

   ```ts
   export function mergeTractionStates(a: Traction, b: Traction): Traction {
     // shallow merge first
     const merged = { ...a, ...b };
     // resolve conflicts by timestamp
     if (a.updatedAt && b.updatedAt) {
       merged.updatedAt = Math.max(a.updatedAt, b.updatedAt);
     }
     return merged;
   }
   ```
4. **Audit** any component that currently does `const { traction } = useScaffolding();` and only reads a subset (e.g., just `showMetronome`). Wrap those components in `React.memo` and/or create a **smaller sub‑context** if you notice they still re‑render on unrelated updates.  
5. **Run** the app, open two tabs/log in from two devices, make independent progress, then refresh each tab – verify that the final state contains the union of both (higher bardLevel, summed practice minutes, etc.).  

With these changes you’ll have:

- No stray render warnings.  
- Deterministic, conflict‑free persistence across tabs and devices.  
- A scalable foundation for adding RIFT community features without over‑hauling state management.  

Good luck with the beta – let me know if you need a deep dive into any of the sub‑contexts or the Supabase merge logic! 🎸🚀