# The DAG eModule Funnel
## Voix Vive — Directed Acyclic Graph Learning Architecture

> **Version:** 1.1 — Google Drive Mentor Connect + Structured Practice (2026-05-27)
> **Author:** Joshua Atkinson
> **SME:** Bertrand Laurence
> **Framework:** ADDIECRAPEYE + DAG (Directed Acyclic Graph) Curriculum Funnel

---

## I. The Core Insight: Why a DAG?

Traditional e-learning is **linear**: Chapter 1 → Chapter 2 → Chapter 3. Students get bored, skip ahead, or get stuck and quit.

Voix Vive is **not linear**. A student might:
- Watch a lesson (Class) → practice with a tool (Guitar) → write a reflection (Workbook)
- Jump to the Pitch Room (Guitar) because they're struggling with hearing, then return to Chapter 3 slides
- Submit a video (Workbook) for feedback before finishing Chapter 5

**A DAG models this perfectly:**
- **Nodes** = Learning activities (slides, tools, exercises, reflections)
- **Directed edges** = Prerequisites (you should understand intervals before CAGED)
- **Acyclic** = No circular dependencies (you can't "unlock" Chapter 5 by doing Chapter 5)
- **Multiple paths** = Students traverse the graph at their own pace, branching and returning

---

## II. The Three Pillars

Every node in the DAG belongs to one of three pillars. No node exists outside these three.

```
                    ┌─────────────────────────────────────────┐
                    │         THE DAG eMODULE FUNNEL          │
                    └─────────────────────────────────────────┘
                                     │
              ┌──────────────────────┼──────────────────────┐
              │                      │                      │
              ▼                      ▼                      ▼
      ┌───────────────┐      ┌───────────────┐      ┌───────────────┐
      │   🎸 CLASS    │      │  🛠️ GUITAR   │      │  📓 WORKBOOK  │
      │  (The Song)   │◄────►│   (Tools)     │◄────►│  (Reflection) │
      │               │      │               │      │               │
      │ 12-chapter    │      │ 12 practice  │      │ Journal       │
      │ living        │      │ tools mapped │      │ entries       │
      │ textbook      │      │ to frets     │      │ Video logs    │
      │ Pythagorean   │      │ Vertiscale   │      │ Submissions   │
      │ Legacy slides │      │ Engine game  │      │ Progress      │
      │               │      │              │      │ timeline      │
      └───────────────┘      └───────────────┘      └───────────────┘
              │                      │                      │
              └──────────────────────┼──────────────────────┘
                                     │
                                     ▼
                    ┌─────────────────────────────────────────┐
                    │      LOGIN-AWARE PROGRESS ENGINE        │
                    │  (ScaffoldingProvider + Supabase sync)  │
                    └─────────────────────────────────────────┘
```

### Pillar 1: CLASS (`/song` — The Living Textbook)
- **What:** 12-chapter swipeable curriculum slides
- **Nodes:** Each chapter = title slide → Pythagorean Legacy → theory slides → exercises → meditation
- **DAG edges:** Chapter N must be "touched" before Chapter N+1 unlocks (but not completed — this is not a gate)
- **Progress tracking:** `lastViewedSlide`, `chapterProgress[chapterId]`

### Pillar 2: GUITAR (`/guitar` — The Workbench + Engine)
- **What:** 12 practice tools + Vertiscale Engine game + Adventure
- **Nodes:** Each tool = Breathing Gate, Practice Timer, Pitch Room, Metronome, etc.
- **DAG edges:** Tool at fret N is "suggested" after viewing chapter N slides. Tool at fret N+1 is "recommended" after using tool at fret N.
- **Progress tracking:** `toolUsage[toolId]`, `vertiscaleHighScore`, `adventureProgress`

### Pillar 3: WORKBOOK (`/playbook` — Journal + Submissions)
- **What:** Character sheet, quest log, journal entries, video submissions
- **Nodes:** Journal prompt at fret N, submission for chapter N, reflection after game session
- **DAG edges:** Journal prompt N unlocks after using tool N OR viewing chapter N. Submission unlocks after completing a tool session.
- **Progress tracking:** `journalEntries[]`, `submissions[]`, `reflectionStreak`

---

## III. The DAG Structure

### Node Types

```typescript
interface DAGNode {
  id: string;           // e.g., "fret-3-pitch-room" or "chapter-5-slides"
  pillar: 'class' | 'guitar' | 'workbook';
  fret: number;         // 1-12, or 0 for global
  type: 'slide' | 'tool' | 'game' | 'journal' | 'submission' | 'milestone';
  title: string;
  description: string;
  prerequisites: string[];  // node IDs that must be "touched" before this unlocks
  suggestedAfter: string[]; // node IDs that make this "recommended" (yellow glow)
  xpValue: number;      // intrinsic value, not gamified — for "Bard Level"
  yinContent?: string; // theory/ear training aspect
  yangContent?: string; // physical/kinesthetic aspect
}
```

### Example DAG for Frets 1-3

```
chapter-1-slides ──────┐
                       │
                       ▼
fret-1-breathing-gate ─┼──► journal-1-reflection ──► milestone-1-root
                       │                              ("I am safe here")
                       ▼
chapter-2-slides ──────┘
                       │
                       ▼
fret-2-practice-timer ─┼──► journal-2-reflection ──► milestone-2-commitment
                       │                              ("I commit to this")
                       ▼
chapter-3-slides ──────┘
                       │
                       ▼
fret-3-pitch-room ─────┼──► journal-3-reflection ──► milestone-3-awakening
                       │                              ("I can hear myself")
                       ▼
              (fret-4 suggested but not required)
```

**Key principle:** Prerequisites are "touched" (visited once), not "completed." A student who opens the Pitch Room once has "touched" it. They can still journal about it even if they didn't use it for 10 minutes. No punitive gates.

---

## IV. The Maturation Map: Visual DAG Navigator

The Maturation Map (`/guitar/map`) is the **primary navigation** for logged-in students. It shows the entire DAG as a 12-fret guitar neck.

```
┌──────────────────────────────────────────────────────────────┐
│                    THE MATURATION MAP                         │
│                                                               │
│  Fret 12  [🔒] → [🔒] → [🔒] → [🔒]  B — M7  Rhythm Engine  │
│  Fret 11  [🔒] → [🔒] → [🔒] → [🔒]  A# — m7 Multi-Key Hub   │
│  Fret 10  [🔒] → [🔒] → [🔒] → [🔒]  A — M6  Async Assessor │
│  Fret 9   [🔒] → [🔒] → [🔒] → [🔒]  G# — m6 Playable Guitar│
│  Fret 8   [🔒] → [🔒] → [🔒] → [🔒]  G — P5  Microtonal     │
│  Fret 7   [🔒] → [🔒] → [🔒] → [🔒]  F# — TT PLING! Trainer │
│  Fret 6   [🔒] → [🔒] → [🔒] → [🔒]  F — P4  Grid Map       │
│  Fret 5   [🔒] → [🔒] → [🔒] → [🔒]  E — M3  Interval Viz    │
│  Fret 4   [🔒] → [🔒] → [🔒] → [🔒]  D# — m3 Metronome      │
│  Fret 3   [✅] → [✅] → [📒] → [⭐]  D — M2  Pitch Room     │
│  Fret 2   [✅] → [✅] → [📒] → [⭐]  C# — m2 Timer          │
│  Fret 1   [✅] → [✅] → [📒] → [⭐]  C — Root Breathing Gate │
│                                                               │
│  Legend: [✅] = Touched  [📒] = Journal ready  [⭐] = Milestone │
│          [🔒] = Locked   [🎯] = Suggested      [🎮] = Game    │
│                                                               │
│  Each fret shows 4 states: Class → Tool → Workbook → Game    │
└──────────────────────────────────────────────────────────────┘
```

**For each fret, the student sees:**
1. **Class** (📖): Swipeable slides — gold checkmark if viewed
2. **Tool** (🛠️): Practice tool — gold checkmark if opened
3. **Workbook** (📓): Journal prompt — glowing if "suggested" (yellow), checkmark if written
4. **Game** (🎮): Vertiscale challenge — star if high score achieved

---

## V. Login-Aware Progress: The Engine

### When NOT Logged In (Anonymous)

```
┌─────────────────────────────────────────┐
│  ANONYMOUS MODE                         │
│                                         │
│  • Progress saved to localStorage only  │
│  • Character sheet shows local name     │
│  • Journal entries stored locally       │
│  • ⚠️ Warning banner: "Sign in to save   │
│    your progress across devices"        │
│  • "Try it free" — all content open     │
│                                         │
│  On Sign In:                            │
│    → Check Supabase for existing data   │
│    → If Supabase data exists: merge     │
│    → If Supabase empty: migrate local   │
│    → Show: "Welcome back, [name]!       │
│      Your journey continues."           │
└─────────────────────────────────────────┘
```

### When Logged In

```
┌─────────────────────────────────────────┐
│  AUTHENTICATED MODE                     │
│                                         │
│  • Progress synced to Supabase          │
│  • Character sheet shows Google avatar  │
│  • Cloud sync indicator (green dot)     │
│  • Journal entries in Supabase DB       │
│  • Submissions visible to Bertrand      │
│  • Progress persists across devices    │
│                                         │
│  Real-time updates:                     │
│    → onAuthStateChange triggers sync    │
│    → Every traction update → Supabase   │
│    → Every journal entry → Supabase     │
│    → Debounced (1s) to avoid spam      │
└─────────────────────────────────────────┘
```

### The Sync Strategy

```typescript
// Pseudocode for ScaffoldingProvider sync

function updateProgress(changes) {
  // 1. Always save to localStorage (instant, reliable)
  saveToLocalStorage(changes);
  
  // 2. If logged in, also save to Supabase (async, may fail)
  if (user) {
    saveToSupabase(changes).catch(err => {
      // Queue for retry — IndexedDB outbox
      queueForRetry(changes);
    });
  }
}

function onLogin(user) {
  // 1. Check if user has cloud data
  const cloudData = await loadFromSupabase(user.id);
  
  if (cloudData) {
    // 2. Merge: cloud wins for timestamps, local wins for newer entries
    const merged = mergeProgress(localData, cloudData);
    setProgress(merged);
    // 3. Push merged back to cloud
    await saveToSupabase(merged);
  } else {
    // 4. First login — migrate local data
    await saveToSupabase(localData);
    showToast("Your local progress has been saved to the cloud!");
  }
}
```

---

## VI. The Workbook: Journal + Submissions

### Journal Entries (Per Fret)

After every tool session or chapter view, the student sees a **reflection prompt**:

| Fret | Prompt |
|------|--------|
| 1 | "What did you notice about your breath? Were you holding tension anywhere?" |
| 2 | "How did 5 minutes of practice feel? Did time move fast or slow?" |
| 3 | "Could you hear the pitch before singing it? What changed?" |
| 4 | "What was harder — keeping time or keeping breath?" |
| 5 | "Did any interval surprise you? Which one felt 'brightest'?" |
| 6 | "What part of the neck still feels foreign to your hand?" |
| 7 | "Could you sing the tritone? What did it feel like in your body?" |
| 8 | "What micro-movement revealed something you didn't know was there?" |
| 9 | "Where did your fingers want to go when you weren't thinking?" |
| 10 | "What would you tell a student who is exactly where you were at Fret 1?" |
| 11 | "Which key feels like 'home'? Which feels like a stranger?" |
| 12 | "What does 'free improvisation' mean to you now?" |

### Video Submissions

```
┌─────────────────────────────────────────┐
│  ASYNC SUBMISSION SYSTEM                │
│                                         │
│  Student:                               │
│    1. Records video (MediaRecorder API)│
│    2. Uploads to Supabase Storage       │
│    3. Adds note: "Stuck on CAGED shift"│
│    4. Clicks "Submit to Bertrand"       │
│                                         │
│  Supabase:                              │
│    → submissions table: pending          │
│    → Storage bucket: student-videos    │
│                                         │
│  Bertrand (Mentor Dashboard):           │
│    → Sees queue: "3 new submissions"   │
│    → Clicks submission → watches video  │
│    → Records feedback video or types    │
│    → Clicks "Reviewed" → student notified│
│                                         │
│  Student (Notification):                │
│    → "Bertrand reviewed your submission!"│
│    → Clicks → sees feedback + video     │
└─────────────────────────────────────────┘
```

---

## VII. Implementation Order

### Sprint 1: Login-Aware Scaffolding (This Session)

1. **Fix ScaffoldingProvider** — Ensure `userId` is properly exposed and sync fires
2. **Add anonymous warning banner** — "Sign in to save progress" on LandingScreen + Workbench
3. **Build data migration** — `migrateLocalToCloud()` on first login
4. **Test sync** — Verify progress survives logout/login

### Sprint 2: Maturation Map (`/guitar/map`)

1. **Build fret grid** — 12 rows × 4 columns (Class/Tool/Workbook/Game)
2. **Add status indicators** — touched, suggested, locked, completed
3. **Wire to tractionStore** — Read progress, compute unlock state
4. **Add click handlers** — Navigate to relevant slide/tool/journal

### Sprint 3: Enhanced Workbook

1. **Journal prompts** — 12 reflection prompts mapped to frets
2. **Video recording** — MediaRecorder API in Journal tab
3. **Submission system** — Upload to Supabase Storage, create submission record
4. **Progress timeline** — Chronological feed of all activity

### Sprint 4: Mentor Dashboard (Phase 2)

1. **Bertrand's view** — `/mentor` route, protected by role check
2. **Submission queue** — Table of pending submissions
3. **Feedback recording** — Record video response back to student
4. **Notification system** — Student sees "Reviewed" badge

---

## VIII. Database Schema Additions

```sql
-- Journal entries (already have journal_entries table, extend)
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS fret_id INTEGER;
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS entry_type TEXT DEFAULT 'text'; -- text | video | submission
ALTER TABLE journal_entries ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Submissions (new table)
CREATE TABLE IF NOT EXISTS submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  fret_id INTEGER,
  video_url TEXT,
  notes TEXT,
  status TEXT DEFAULT 'pending', -- pending | reviewed | complete
  mentor_feedback TEXT,
  mentor_video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);

-- Progress tracking (extend existing progress table)
ALTER TABLE progress ADD COLUMN IF NOT EXISTS maturation JSONB DEFAULT '{}'; -- per-fret DAG state

-- RLS for submissions
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own submissions" ON submissions FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users create own submissions" ON submissions FOR INSERT WITH CHECK (user_id = auth.uid());
CREATE POLICY "Mentor sees all submissions" ON submissions FOR SELECT USING (auth.uid() IN (SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'mentor'));
```

---

## IX. The Promise

> *"You are an instrument playing an instrument."*

The DAG eModule Funnel is not a curriculum map. It is a **mirror of the student's inner journey**:

- **Class** shows them what is possible
- **Guitar** lets them feel what is possible
- **Workbook** helps them understand what they felt

Each fret is not a gate. It is a **question**. The DAG simply makes visible what questions the student has already asked themselves — and what questions are waiting.

**Login-aware progress means the mirror remembers.** When a student returns after a week away, their journey is intact. Their breath count. Their tritone terror. Their first free improvisation. All of it. In the cloud. Waiting.

---

> **Next Action:** Implement Sprint 1 — login-aware ScaffoldingProvider + data migration.
