# VOIX VIVE — PEARL Header Standard
> **The rule book for all source file headers in this codebase.**
> Written for: any AI assistant working on this project, and for Bertrand's future AI.
> Last Updated: 2026-05-25

---

## WHAT IS A PEARL HEADER?

Every source file in `src/` begins with a PEARL header — a 10-line structured comment block that tells any AI or developer exactly what the file does, why it exists, and what to do if it breaks.

PEARL stands for:
- **P — Perspective:** What role does this file play? (pedagogy, UI, data, game)
- **E — Engineering:** What does it do, technically, in one sentence?
- **A — Aesthetic:** What visual or UX intent does it carry?
- **R — Research:** Which design doc, protocol, or architectural decision backs this?
- **L — Layout:** What connects to this file? What does it import / what imports it?

Plus four operational lines:
- **STAGE:** Where in the ADDIECRAPEYE process is this file? (ANALYZE / DESIGN / DEVELOP / IMPLEMENT / EVALUATE / MAINTAIN)
- **IP:** Who owns this content? What is forbidden here?
- **RULES:** What must never be changed without a documented reason?
- **FIX AT:** If this file breaks, where do you start debugging?

---

## THE STANDARD FORMAT

Every field must be specific to that file — not generic. If it could apply to any file, rewrite it.

```jsx
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : [filename.jsx]                                      ║
// ║ WHAT    : [what this file does — one concrete sentence]       ║
// ║ WHY     : [why it exists in this platform specifically]       ║
// ║ WHO     : [student / Bertrand / developer / invisible]        ║
// ║ OWNS    : [state, data, or UI this file is responsible for]   ║
// ║ NEEDS   : [imports it depends on — hooks, stores, components] ║
// ║ RULES   : [what must never be changed without a reason]       ║
// ║ FIX AT  : [debugging chain — file → file → where to look]    ║
// ║ STAGE   : [ADDIECRAPEYE phase — IMPLEMENT / EVALUATE / etc.]  ║
// ╚═══════════════════════════════════════════════════════════════╝
```

**WHAT** — One sentence. Verb first. Concrete, not abstract.
- ❌ "Manages ambient state" 
- ✅ "Streams Troubadour AI chat via LM Studio and controls ambient music + metronome"

**WHY** — The pedagogical or architectural reason it exists.
- ❌ "Provides global context"
- ✅ "Every tool and AI panel needs student's Bard Level — one source of truth prevents drift"

**WHO** — Who actually experiences or calls this file.
- ❌ "Users"
- ✅ "Student (always on screen) — passive until they open the panel"

**OWNS** — What state, data, or rendered UI belongs to this file and nothing else.

**NEEDS** — The exact hook/store/component names it imports. An AI can use this to find dependencies fast.

**RULES** — Hard constraints. If you break these, document why in the commit.

**FIX AT** — The debugging chain. Where to start, where to go next. Written for someone who has never seen the codebase.

---

## WORKED EXAMPLES

### AmbientPlayer.jsx
```jsx
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : AmbientPlayer.jsx                                   ║
// ║ WHAT    : Streams Troubadour AI chat + controls ambient music ║
// ║           and metronome from a fixed top-left panel           ║
// ║ WHY     : Students need a calm sensory container and an AI   ║
// ║           coach available on every screen without navigating  ║
// ║ WHO     : Student — passive background, active on panel open  ║
// ║ OWNS    : mode state (music/click/troubadour), guideMessages, ║
// ║           metro BPM, volume, track index                      ║
// ║ NEEDS   : useLMStudio, useScaffolding, useLocale, useMetro   ║
// ║ RULES   : Never remove Troubadour tab. Never gate by fret.   ║
// ║           AI max 3 sentences. No scores in Troubadour output  ║
// ║ FIX AT  : useLMStudio.js → LM Studio port 1234 → model load  ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝
```

### VertiscaleEngine.jsx
```jsx
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : VertiscaleEngine.jsx                                ║
// ║ WHAT    : Runs the Fret 9 game — MENU→PHASE1→PHASE2→PHASE3   ║
// ║           state machine with pitch detection and scoring      ║
// ║ WHY     : Fret 9 is where all 3 protocols converge; the game ║
// ║           is the somatic proof that learning has happened     ║
// ║ WHO     : Student — full screen, immersive, self-directed     ║
// ║ OWNS    : engineState, rootNote, gameMode, roundScores,      ║
// ║           biometricsHistory, sessionLog                       ║
// ║ NEEDS   : sessionLogger, scoreCalculator, GameFretboard,     ║
// ║           OrbEngine, AdventurePlayer, usePitchDetector        ║
// ║ RULES   : Phase 3 MUST NOT show score — ever                 ║
// ║           Difficulty = Kinesthetic Awakening / Applied        ║
// ║           Practice / Flow State only. No Florins, no SQLite   ║
// ║ FIX AT  : sessionLogger.js → tractionStore.js → ScaffoldingProvider║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ╚═══════════════════════════════════════════════════════════════╝
```

### tractionStore.js
```js
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : tractionStore.js                                   ║
// ║ WHAT    : Read/write student progress in localStorage        ║
// ║ WHY     : Fast sync state — components read this on render   ║
// ║ WHO     : No UI — called by providers, game, and textbook    ║
// ║ OWNS    : bardLevel, totalTraction, streak, per-fret flags   ║
// ║ NEEDS   : Nothing — no imports, pure localStorage functions  ║
// ║ RULES   : bardLevel must always derive from totalTraction    ║
// ║           Never remove yinCompleted or yangCompleted flags   ║
// ║           "traction" = guitar practice only, not Great Game  ║
// ║ FIX AT  : Check localStorage key 'bard_traction' in DevTools ║
// ║           then localDatabase.js if IndexedDB backup is stale ║
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                   ║
// ╚═══════════════════════════════════════════════════════════════╝
```

---

## ADDIECRAPEYE STAGE DEFINITIONS

Use these exactly in the STAGE line:

| Stage | Meaning | When to use |
|---|---|---|
| `ANALYZE` | Requirements being gathered | New feature, unclear scope |
| `DESIGN` | Architecture decided, not built | Spec written, no code yet |
| `DEVELOP` | Actively being built | Feature in progress |
| `IMPLEMENT` | Built, tested, stable | Most production files |
| `EVALUATE` | Being reviewed for issues | After a bug or complaint |
| `MAINTAIN` | Stable, rarely changed | Legal pages, static data |

---

## RULES FOR ADDING HEADERS

1. **Always add to new files** — no file in `src/` ships without a PEARL header
2. **Update STAGE when status changes** — if you fix a bug, update STAGE to EVALUATE
3. **Update FIX AT when debugging** — if you trace a bug through 3 files, document that chain
4. **Never shorten the format** — all 10 lines are required
5. **Write for a stranger** — assume the reader has never seen this codebase
6. **The RULES line is a hard contract** — if you need to break a rule, document WHY in the same commit

---

## FOR BERTRAND'S FUTURE AI

If you are an AI assistant working on this project after Joshua, here is exactly what to do:

1. **Read `docs/00_MASTER.md` first** — every session, every time
2. **Check the PEARL header** of any file you are about to edit — read all 10 lines
3. **Never violate the RULES line** without writing a comment explaining why
4. **FIX AT is your debugging chain** — follow it in order
5. **If the STAGE says MAINTAIN** — be extremely careful; this file rarely changes for good reason
6. **IP line is a hard stop** — if your edit would introduce a forbidden term, stop and ask
7. **When you finish editing** — update the STAGE line and the "Last Touch" comment if present
