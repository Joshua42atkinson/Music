# Kriya Yoga Workbook vs. Voix Vive — Delivery System Comparison

> **Goal:** Understand how the "workbook" medium delivers transformation in Kriya Yoga, then use that science to reinforce the Voix Vive game-mode delivery system — calendar, drive, AI, notifications, and commitment-based progression.

---

## 1. What Is a "Workbook Delivery System"?

A workbook isn't just content — it's a **delivery vehicle** for behavioral change. Both Kriya and Voix Vive use the workbook medium, but they deliver through fundamentally different architectures:

| Layer | Kriya Workbook (Paper) | Voix Vive Workbook (Digital) |
|-------|----------------------|---------------------------|
| **Medium** | Physical book, fill-in worksheets | React SPA, localStorage + Supabase |
| **Scheduler** | Fixed daily routine table (p.124) | `practiceEngine.js` generates 20-min sessions |
| **Calendar** | None — self-discipline only | Google Calendar API for mentor reviews |
| **Drive/Storage** | Paper worksheets, date/level columns | localStorage → IndexedDB → Supabase (3-tier) |
| **AI/Mentor** | The book itself ("Do not wait for advice") | AI Troubadour + async mentor video reviews |
| **Notifications** | None — the mantra IS the notification | **MISSING** — no push/notification system exists |
| **Commitment Tracking** | 3-level depth table (Level 1→2→3) | `commitmentTier`: gentle/committed/intensive |
| **Save State** | Date started, sets completed, level reached | `tractionStore.js`: full DAG state per fret |
| **Game Mode** | None — pure discipline | Vertiscale Engine, XP, streaks, scaffolding fade |

---

## 2. Kriya's Delivery System — The Full Pipeline

### 2.1 The Daily Routine Table (Core Scheduler)

Kriya's scheduler is a **static table** printed in the book. It never changes. The student internalizes it:

```
Level 1 (21 min):  Mantra×5 + Silent×5 + Nadi×3 + Ujjayi×3 + Talabya×30 + Maha×3 + Navi×4 + OmJapa×6 + Kriya×12-24 + Concentration×5
Level 2 (26 min):  Same + Silent Mantra×10
Level 3 (26 min):  Same + Silent Mantra runs 75%+ of waking hours
Night Gate:        Nadi×3 + Maha×3 + Yoni×1-3 (before sleep)
```

**Key insight:** The schedule doesn't adapt. **The student adapts to the schedule.** This is by design — Kriya's science says the fixed structure creates a container that the nervous system learns to rely on. The routine becomes a **neural anchor**.

### 2.2 The Worksheet System (Save State)

Each lesson includes a worksheet:
- **Date Started** — when the student began this technique
- **Sets Completed** — numeric tracking (e.g., Talabya: 30 sets)
- **Level Reached** — 1, 2, or 3
- **Graduation Criteria** — somatic markers, not time-based

This is the **paper equivalent of `tractionStore.js`** — but it's filled by hand, which creates a different relationship. Writing by hand engages motor memory and intention in a way that clicking a button doesn't.

### 2.3 The Mantra-as-Notification System

Kriya has **no external notifications**. Instead, it engineers an **internal notification system**: the mantra.

- Level 1: 5 min aloud + 5 min silent = external practice
- Level 2: 10 min silent = internalizing
- Level 3: 75%+ of waking hours = **the mantra becomes autonomous**

When the mind wanders, the mantra pulls it back. When a problem arises, the mantra solves it. The mantra IS the reminder, the notification, the scheduler — all in one. It's a **self-generating notification system** that runs on the student's own nervous system rather than on a phone.

### 2.4 Graduation by Somatic Marker (Not Time)

Kriya doesn't say "practice for 2 weeks then advance." It says:
- "When the mantra becomes automatic, move on"
- "When you feel a release (sweetness, radiating colors in Kutastha)"
- "When you can repeat the mantra in the background of your mind"

This is **qualitative progression** — the body tells you when you're ready, not the clock.

### 2.5 The Workbook IS the Guru

Lahiri Mahasaya: *"Do not wait for advice to practice Kriya."*

The book is designed so a sincere student can progress alone. The guru is internalized through the practice itself. This is the deepest form of "scaffolding fade" — the book gradually becomes unnecessary as the student's own inner guidance strengthens.

---

## 3. Voix Vive's Delivery System — Current State

### 3.1 What Exists

| System | File | Status |
|--------|------|--------|
| **Practice Engine** | `practiceEngine.js` | ✅ Generates 20-min BE/DO/PLAY sessions |
| **Traction Store** | `tractionStore.js` | ✅ Full DAG state, mastery, resonance, gates |
| **Workbook UI** | `BEWorkbook.jsx` | ✅ 3 daily ritual cards (Breathe/Practice/Reflect) |
| **Practice Journal** | `PracticeJournal.jsx` | ✅ Streak tracking, session logging |
| **Calendar Service** | `calendarService.js` | ✅ Google Calendar for mentor review slots |
| **Supabase Auth** | `supabase.js` | ✅ Google OAuth with Calendar + Drive scopes |
| **Game Engine** | `VertiscaleEngine.jsx` | ✅ 3-phase game with scoring |
| **Score Calculator** | `scoreCalculator.js` | ✅ Placement/Pitch/Breath/Consistency weights |
| **Session Logger** | `sessionLogger.js` | ✅ Game→Traction wire, Dexie + localStorage |
| **Scaffolding Provider** | `ScaffoldingProvider.jsx` | ✅ 3-tier persistence (localStorage→IDB→Supabase) |
| **Commitment Tier** | `tractionStore.js:37` | ✅ `commitmentTier`: gentle/committed/intensive |
| **Scaffolding Fade** | `tractionStore.js:206` | ✅ Auto-reduces visual aids as traction grows |

### 3.2 What's Missing

| System | Gap | Kriya Equivalent |
|--------|-----|-----------------|
| **Push Notifications** | No notification system at all | Mantra-as-notification (internal) |
| **Background Practice** | Session-only, no carry-over | Mantra running 75%+ of day |
| **Paravastha Tracking** | No after-effect measurement | Paravastha state explicitly tracked |
| **Night Gate** | "Evening Reflect" is weak | Structured before-sleep routine |
| **Somatic Journal** | Gates are binary checkboxes | Qualitative sensory markers |
| **Calendar Integration** | Mentor-only, not student practice | (Kriya has none — self-scheduled) |
| **Drive Integration** | OAuth scope exists but unused | Paper worksheets (hand-written) |
| **Commitment-Adaptive Schedule** | `commitmentTier` exists but unused | 3-level table adapts depth |

---

## 4. How the Two Systems Help Each Other in Game Mode

### 4.1 Kriya → Voix Vive: What Kriya's Science Adds

| Kriya Principle | Voix Vive Game Enhancement |
|----------------|--------------------------|
| **Fixed daily container** | The 20-min session should feel as non-negotiable as brushing teeth. Kriya's insight: the **rigidity of the container** is what creates safety for exploration within it. |
| **Mantra-as-notification** | Replace push notifications with a **"Living Voice" hum** — a short melodic cell that the student internalizes during BE phase. It becomes their internal practice alarm. No phone notification needed. |
| **3-level depth on same technique** | Add a depth dimension to each DAG node. A node at Level 1 = mechanical. Level 2 = musical. Level 3 = autonomous (plays itself). Mastery isn't "done" until Level 3. |
| **Graduation by somatic marker** | Replace binary somatic gates with **sensory journal prompts**: "Where did you feel the resonance?" "Did the sound surprise you?" The gate becomes a reflection, not a checkbox. |
| **Paravastha (after-effect)** | Add a **Paravastha Timer** to Evening Reflect: "How long after your session did the feeling last? 5 min? 1 hour? All day?" This metric tracks the real goal — not practice time, but practice *impact*. |
| **Night Gate** | Transform "Evening Reflect" into a **Night Gate**: 3-min routine done in bed — slow breathing + replay best musical moment + set tomorrow's intention. Leverages hypnagogic state. |
| **Workbook IS the guru** | AI Troubadour should be framed as a **mirror**, not a teacher. "The Troubadour doesn't teach — it reminds." The student's own living voice is the authority. |
| **Chakra = body's fretboard** | Map each fret to a body zone. Fret 1 = root/pelvis. Fret 12 = crown. "Feel where each fret lives in your body." Guitar becomes extension of subtle body. |

### 4.2 Voix Vive → Kriya: What Digital Systems Engineering Adds

| Voix Vive Capability | Kriya Enhancement |
|---------------------|-------------------|
| **3-tier persistence** (localStorage→IDB→Supabase) | Kriya worksheets can be lost. Digital state survives device failure, browser crashes, and multi-device use. |
| **Google Calendar API** | Kriya has no scheduling aid. A digital calendar could auto-schedule the daily routine at the student's preferred time, with smart rescheduling on miss. |
| **Google Drive scope** (already in OAuth) | Store practice journal entries, reflection notes, and worksheet data in Drive — accessible anywhere, searchable, backed up. |
| **Commitment tier system** | Kriya assumes everyone does the same routine. A `commitmentTier` system could offer: Gentle (10 min), Committed (20 min), Intensive (30 min) — matching the student's life context. |
| **Scaffolding fade** | Kriya has no adaptive scaffolding. A digital system can auto-reduce aids (metronome, note labels, CAGED overlay) as mastery grows — exactly what `calculateScaffolding()` already does. |
| **Game scoring (placement/breath/consistency)** | Kriya has no feedback mechanism. The Vertiscale Engine's scoring system (35% placement, 25% pitch, 20% breath, 20% consistency) gives **objective evidence** of progress — complementing Kriya's subjective somatic markers. |
| **Streak tracking** | Kriya relies on self-discipline alone. Digital streak tracking with visual feedback creates **accountability without guilt** — the streak is a companion, not a judge. |
| **Cross-pillar resonance** | Kriya's chakra system is linear (1→7). Voix Vive's DAG with cross-pillar resonance detection is **non-linear** — a student can unlock insights by completing related nodes in different pillars simultaneously. |

---

## 5. The Notification & Commitment System — Detailed Design

### 5.1 Current State: No Notifications

The codebase has **zero notification infrastructure**. The `PracticeJournal.jsx` has a placeholder:
```javascript
// Line 99:
alert('Schedule feature: integrate calendarService.getAvailableSlots()')
```

The `calendarService.js` only handles **mentor review slots** — not student practice reminders.

### 5.2 Kriya's Answer: Internal Notifications

Kriya solves the notification problem without technology: the **mantra becomes the notification**. At Level 3, the mantra runs autonomously 75%+ of waking hours. The student doesn't need a phone reminder because their own nervous system is the alarm clock.

**Translation to Voix Vive:** The "Living Voice" melodic cell learned in BE phase should be designed to become **intrinsically sticky** — a short, memorable pattern that the student catches themselves humming during the day. This is the musical equivalent of the Kriya mantra. No push notification needed.

### 5.3 Hybrid Approach: External + Internal Notifications

For students not yet at Level 3 (mantra-not-yet-autonomous), a **graduated notification system** based on `commitmentTier`:

| Commitment Tier | Session Duration | Notification Strategy | Kriya Level Equivalent |
|----------------|-----------------|----------------------|----------------------|
| **Gentle** | 10 min | Push notification at preferred time + end-of-day nudge if missed | Level 1 (external practice) |
| **Committed** | 20 min | Calendar event auto-created + smart reschedule on miss | Level 2 (internalizing) |
| **Intensive** | 30 min | Minimal notifications — the practice is self-sustaining | Level 3 (autonomous) |

### 5.4 Save-State-Driven Notifications

The `tractionStore` already tracks everything needed for intelligent notifications:

```javascript
// Available in tractionStore:
state.lastPracticeDate       // When did they last practice?
state.streak                 // How many consecutive days?
state.commitmentTier         // gentle / committed / intensive
state.currentNodeId          // Where are they in the DAG?
state.bardLevel              // Overall progress level
state.frets[fretId].beCompleted  // Phase completion per fret
state.frets[fretId].beMastery    // Mastery level per phase
state.frets[fretId].beGatePassed // Somatic gate status
```

**Notification triggers based on save state:**

| Trigger | Condition | Notification |
|---------|-----------|-------------|
| **Morning Call** | `lastPracticeDate !== today` && time = preferred morning time | "Your breath is waiting. 3 breaths to begin." |
| **Streak Guardian** | `streak >= 7` && no practice by afternoon | "7-day streak at risk. Even 3 minutes counts." |
| **Gate Unlock** | `beGatePassed && !doGatePassed` on current fret | "You heard it. Now play it. DO phase unlocked." |
| **Resonance Alert** | Cross-pillar resonance detected | "Resonance! Same phase completed across pillars. Depth unlocked." |
| **Paravastha Prompt** | Evening (8pm+) && practice logged today | "How long did the feeling last after today's practice?" |
| **Night Gate** | 30 min before bedtime (user-configured) | "Night Gate: Breathe 3×, replay today's best moment, set tomorrow's intention." |
| **Scaffolding Fade** | `scaffoldingLevel` drops below threshold | "Note labels fading — your fingers know the way now." |
| **Commitment Check** | 3+ days missed at `committed` tier | "Would you like to switch to Gentle pace? No judgment." |

### 5.5 Calendar Integration — Beyond Mentor Reviews

The `calendarService.js` currently only books mentor reviews. It should also:

1. **Auto-create daily practice events** based on `commitmentTier`:
   - Gentle: 10-min block at preferred time
   - Committed: 20-min block with BE/DO/PLAY breakdown
   - Intensive: 30-min block + Night Gate event

2. **Smart rescheduling**: If the student misses their morning slot, auto-propose an afternoon slot (not a guilt trip, a **gentle redirect**).

3. **Milestone events**: When a fret is completed, create a "Milestone: Fret X Complete" calendar event — visible proof of progress.

4. **Seasonal rhythm**: Kriya's practice intensity varies by season (more in winter, lighter in summer). The calendar could adapt practice duration seasonally.

### 5.6 Drive Integration — The Living Journal

The Google Drive scope is already in the OAuth (`supabase.js:40`):
```javascript
scopes: 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/drive.file'
```

But `drive.file` scope is **unused**. It should store:

1. **Practice journal entries** — the Evening Reflect and Paravastha Check responses
2. **Sensory gate reflections** — the qualitative answers to somatic prompts
3. **Session summaries** — auto-generated from game scores + practice logs
4. **Weekly synthesis** — AI-generated reflection on the week's progress patterns

This creates a **searchable, portable, lifelong practice archive** — something no paper worksheet can offer.

---

## 6. The Complete Delivery Pipeline — Unified Model

```
┌─────────────────────────────────────────────────────────────────┐
│                    VOIX VIVE DELIVERY SYSTEM                     │
│                                                                  │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ ONBOARD  │───→│ DAILY    │───→│ GAME     │───→│ NIGHT    │   │
│  │          │    │ PRACTICE │    │ ENGINE   │    │ GATE     │   │
│  │ Choose   │    │          │    │          │    │          │   │
│  │ tier     │    │ BE:7min  │    │ SHEARL   │    │ Breathe  │   │
│  │ Set time │    │ DO:8min  │    │ PLING!   │    │ Replay   │   │
│  │ Cal sync │    │ PLAY:5min│    │ FHEAL    │    │ Intend   │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│       │               │               │               │         │
│       ▼               ▼               ▼               ▼         │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │              TRACTION STORE (save state)                   │   │
│  │  streak · commitmentTier · currentNodeId · bardLevel      │   │
│  │  per-fret: mastery · gates · resonance · depth · time    │   │
│  └──────────────────────────────────────────────────────────┘   │
│       │               │               │               │         │
│       ▼               ▼               ▼               ▼         │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐   │
│  │ CALENDAR │    │ NOTIFY   │    │ DRIVE    │    │ AI       │   │
│  │          │    │          │    │          │    │ MENTOR   │   │
│  │ Auto-    │    │ State-   │    │ Journal  │    │          │   │
│  │ schedule │    │ driven   │    │ archive  │    │ Mirror   │   │
│  │ practice │    │ alerts   │    │ search   │    │ (not     │   │
│  │ Mentor   │    │ Streak   │    │ Weekly   │    │ teacher) │   │
│  │ reviews  │    │ guardian │    │ synthesis│    │          │   │
│  └──────────┘    └──────────┘    └──────────┘    └──────────┘   │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │         PERSISTENCE (3-tier, Kriya-proof)                 │   │
│  │  localStorage (fast) → IndexedDB (durable) → Supabase    │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 7. Priority Implementation Order

Based on what's missing vs. what would have the most impact (informed by Kriya's science):

| Priority | Feature | Kriya Principle | Effort |
|----------|---------|----------------|--------|
| **P0** | Notification system (save-state-driven) | Mantra-as-notification (external bridge) | Medium |
| **P0** | Night Gate (structured before-sleep routine) | Night Gate practice | Small |
| **P1** | Paravastha Check (after-effect tracking) | Paravastha state | Small |
| **P1** | Commitment-adaptive schedule (use `commitmentTier`) | 3-level depth table | Medium |
| **P1** | Sensory journal gates (replace binary checkboxes) | Graduation by somatic marker | Medium |
| **P2** | Auto-calendar practice events | (Digital enhancement) | Medium |
| **P2** | Drive journal archive | (Digital enhancement) | Medium |
| **P2** | Fret-to-body resonance mapping lesson | Chakra = body's fretboard | Small |
| **P3** | Depth dimension within DAG nodes | Same-technique 3-level depth | Large |
| **P3** | "Living Voice" background hum mode | Autonomous mantra | Large |

---

## 8. Key Insight: The Session Is a Seed, Not a Container

The single most important lesson from Kriya for Voix Vive:

**Kriya treats the daily session as a seed that grows into an all-day living state. Voix Vive currently treats the 20-minute session as a closed container.**

Every enhancement in this document serves one purpose: **opening the container** — letting the living voice spill into the rest of the day, the rest of the night, and the rest of the student's life.

The notification system isn't about reminding people to practice. It's about **extending the practice beyond the session boundary** — until, like Kriya's mantra at Level 3, the practice becomes self-sustaining and the notifications become unnecessary.

That's the game: **build notifications that make themselves obsolete.**
