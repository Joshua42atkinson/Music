# Portal Merger — Guitar + Playbook + Workbench Harmonization
> Maturation Map Entry for the Three-Portal Refactor
> Status: DESIGN (ready for Phase C planning)
> Date: 2026-06-01

---

## The Problem

The current 4-portal system has structural drift:

| Portal | Current State | Problem |
|--------|--------------|---------|
| **The Song** | SlideViewer, curriculum slides | ✅ Working well |
| **The Guitar** | GuitarWorkbench — tool grid + suggested practice | ❌ Haphazard catch-all. No clear relationship to progress. Tools feel like a developer menu, not a student journey. |
| **The Player** | Video library, recordings, submissions, journal, timeline | ❌ Too many concerns. "Record for Bertrand" is buried under tabs. Video library feels like an afterthought. |
| **The Playbook** | Character sheet, quests, journal, songwriting | ❌ Separated from the tools it describes. Quests have no direct action link. Journal duplicated in Player. |

**The Guitar page** literally looks like a developer "I want" menu — 12 tools in a grid with no narrative flow, no connection to the DAG, and no meaningful integration with the workbook progression system.

**The Playbook** is orphaned — students see their character sheet, but the tools that earn those stats are on a different page.

**The Player** has four tabs (Loom, Submissions, Library, Timeline) and no clear primary action.

---

## The Vision: Three Portals, One Journey

```
THE SONG        THE WORKBOOK          THE STUDIO
(/song)         (/workbook)           (/studio)
  │                  │                     │
  │   Living         │   Practice          │   Resources
  │   Textbook       │   + Progress        │   + Mentorship
  │                  │   + Game            │   + Community
  │                  │                     │
  ▼                  ▼                     ▼
Read & Learn    Play & Grow          Watch & Connect
```

### New Portal 1: THE SONG (unchanged)
- **What:** The Living Textbook. 12-fret curriculum slides.
- **Route:** `/song`
- **Pedagogy:** Theory as discovery. Read first, then touch.
- **Content:** SlideViewer, ChromaticMonomyth map, Glossary, References

### New Portal 2: THE WORKBOOK (merged Guitar + Playbook)
- **What:** The unified practice and progress hub. The binder IS the guitar.
- **Route:** `/workbook` (or `/guitar` with redirect)
- **Pedagogy:** Every tool lives inside the Hero's Journey. No orphaned pages.

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  CHARACTER HEADER                                           │
│  Bard Level 4 · The Craftsman · Streak 12 days              │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │
│  │ Breath │ │ Pitch  │ │ Rhythm │ │ Memory │ │ Express│   │
│  │  14/20 │ │  11/20 │ │   8/20 │ │  16/20 │ │  12/20 │   │
│  └────────┘ └────────┘ └────────┘ └────────┘ └────────┘   │
├─────────────────────────────────────────────────────────────┤
│  QUEST LOG — "The Ordeal" (Fret 7)                          │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ⚡ Current Quest: Can I sing and play?           │    │
│  │  Protocol: PLING! · Phase: DO                      │    │
│  │  [ Begin PLING! Trainer ]  [ View Fret 7 Slides ]  │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  THE 12 TOOLS — Organized by fret, not by grid              │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐           │
│  │ Fret 1  │ │ Fret 2  │ │ ...     │ │ Fret 12 │           │
│  │ Breathe │ │ Timer   │ │         │ │ Rhythm  │           │
│  │ [done]  │ │ [done]  │ │         │ │ [lock]  │           │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘           │
│  (NOT a 3x4 grid — a chromatic journey timeline)            │
├─────────────────────────────────────────────────────────────┤
│  GAME MODE — Vertiscale Engine                                │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎮 Enter the Chromatic Realm                       │    │
│  │  Phase 1: Flash (SHEARL) · Phase 2: Orbs (PLING!)   │    │
│  │  Phase 3: Freeplay (FHEAL)                          │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  JOURNAL — Reflections from practice                        │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  "When I sang the note and found it on the         │    │
│  │   guitar, I felt something click in my chest."     │    │
│  │   — Fret 7, yesterday                               │    │
│  └─────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

**Key changes from current GuitarWorkbench:**
1. **Character header at top** — Playbook stats visible immediately (not on separate page)
2. **Quest log as primary CTA** — Not "pick a tool from a grid" but "here is your next quest"
3. **Tools organized by fret timeline** — Chromatic order, not arbitrary grid. Locked frets show as gray.
4. **Game mode integrated** — Vertiscale Engine is not a separate app, it's the capstone activity
5. **Journal inline** — Reflections from the current fret shown contextually
6. **No modal hell** — Tools open inline or in dedicated routes, not modal overlays

### New Portal 3: THE STUDIO (reimagined Player)
- **What:** Resources, video library, mentorship, community.
- **Route:** `/studio` (or `/player` with redirect)
- **Pedagogy:** The student is never alone. Bertrand is here. The community is here.

**Structure:**
```
┌─────────────────────────────────────────────────────────────┐
│  STUDIO HEADER                                              │
│  "Welcome back, Jean-Luc. Bertrand has left you feedback."  │
├─────────────────────────────────────────────────────────────┤
│  PRIMARY ACTION — Always visible                            │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  🎙️ Record Practice for Bertrand                    │    │
│  │     Async review queue: 2-day turnaround            │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  VIDEO LIBRARY — Bertrand's Teachings                      │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐         │
│  │ Breath  │ │ PLING!  │ │ FHEAL   │ │ Micro   │         │
│  │ 4:32    │ │ 6:15    │ │ 8:47    │ │ 5:22    │         │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘         │
│  (Filter by protocol, fret, or unlocked status)             │
├─────────────────────────────────────────────────────────────┤
│  MENTOR FEEDBACK — Your submissions                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │  ✓ "Your vibrato is intentional now." — Fret 8      │    │
│  │  ⏳ Pending review...                                │    │
│  └─────────────────────────────────────────────────────┘    │
├─────────────────────────────────────────────────────────────┤
│  RESOURCES — Downloadables                                  │
│  Vertiscale PDFs · CAGED Maps · Chord Grids · Printables    │
├─────────────────────────────────────────────────────────────┤
│  COMMUNITY — Inner Circle (if member)                       │
│  Next group Q&A: Thursday 7pm ET                           │
└─────────────────────────────────────────────────────────────┘
```

**Key changes from current PlayerPortal:**
1. **Primary action always visible** — "Record for Bertrand" is THE button, not a tab
2. **Video library is front-and-center** — Not buried under a tab
3. **Mentor feedback inline** — Students see reviews as they arrive
4. **Resources section** — DigitalBinder moves here (it's a resource, not a workbook)
5. **Community section** — Inner Circle events, group Q&A
6. **Timeline removed** — Timeline moves to Workbook (it's progress, not resources)

---

## Harmonization with DAG and Game Mode

### DAG Integration in Workbook
```
Current Node: fret-7-guitar-play
├─ BE: Complete ✓
├─ DO: Complete ✓
├─ PLAY: In Progress → [ Open PlingTrainer ]
└─ Milestone: Locked (needs all 3 pillars)
```

Each fret in the Workbook timeline shows:
- **Status:** locked / unlocked / in-progress / complete
- **Pillar progress:** class ✓ / guitar ○ / workbook ○
- **Next action:** "Complete DO phase to unlock PLAY"
- **Tool link:** Direct button to the relevant tool

### Game Mode Integration
The Vertiscale Engine is not a separate portal. It lives inside the Workbook:
- **Access:** "Enter the Chromatic Realm" card at bottom of Workbook
- **Unlock condition:** All 12 frets at least partially complete (or sandbox mode)
- **Phases map to protocols:**
  - Phase 1 (Flash) = SHEARL → practiced in BreathingGate, FretboardExplorer
  - Phase 2 (Orbs) = PLING! → practiced in PitchRoom, PlingTrainer
  - Phase 3 (Freeplay) = FHEAL → practiced in MicrotonalTracker, RhythmEngine

### Aesthetic Harmonization
All three portals share:
- **Same header pattern:** Character name, level, streak
- **Same color tokens:** Protocol colors (SHEARL=blue, PLING!=green, FHEAL=purple)
- **Same card pattern:** Rounded, subtle border, protocol-tinted background
- **Same typography:** Cormorant Garamond for headings, Inter for body, JetBrains Mono for data
- **Same animation:** Slow transitions (The Slow Web Mandate)

---

## Execution Phases

### Phase 1: Design & Component Audit (1 day)
- [ ] Audit all components in GuitarWorkbench, PlayerPortal, PlaybookShell
- [ ] Identify shared sub-components (CharacterHeader, QuestCard, ToolCard, JournalEntry)
- [ ] Design new Workbook layout in Figma/sketch
- [ ] Design new Studio layout
- [ ] Update route map in App.jsx

### Phase 2: Extract Shared Components (2 days)
- [ ] Create `src/components/workbook/` directory
- [ ] Create `CharacterHeader.jsx` — shared across all three portals
- [ ] Create `QuestLog.jsx` — shows current quest with CTA
- [ ] Create `FretTimeline.jsx` — chromatic tool timeline (replaces tool grid)
- [ ] Create `JournalStream.jsx` — inline journal reflections
- [ ] Create `GameLauncher.jsx` — Vertiscale Engine entry card
- [ ] Create `src/components/studio/` directory
- [ ] Create `VideoLibrary.jsx` — extracted from PlayerPortal
- [ ] Create `MentorFeedback.jsx` — submission reviews
- [ ] Create `ResourceDownloads.jsx` — extracted from DigitalBinder

### Phase 3: Build New Workbook (3 days)
- [ ] Create `WorkbookPage.jsx` — new merged portal
- [ ] Integrate CharacterSheet data (from Playbook)
- [ ] Integrate tool launcher (from GuitarWorkbench)
- [ ] Integrate quest system (from dagNodes + tractionStore)
- [ ] Integrate journal (from PlayerPortal + localDatabase)
- [ ] Add fret timeline with lock/unlock states
- [ ] Add game launcher card
- [ ] Remove modal-based tool launching → inline or route-based

### Phase 4: Build New Studio (2 days)
- [ ] Create `StudioPage.jsx` — reimagined Player portal
- [ ] Extract video library as primary component
- [ ] Extract mentor feedback stream
- [ ] Move DigitalBinder content here
- [ ] Add community/Inner Circle section
- [ ] Keep PracticeRecorder as primary CTA

### Phase 5: Deprecate & Redirect (1 day)
- [ ] Deprecate `GuitarWorkbench.jsx` (keep for reference, remove from routes)
- [ ] Deprecate `PlaybookShell.jsx` (merge into Workbook)
- [ ] Deprecate old `PlayerPortal.jsx` tabs (keep timeline data, move to Workbook)
- [ ] Add redirects: `/guitar` → `/workbook`, `/playbook` → `/workbook`, `/player` → `/studio`
- [ ] Update LandingScreen PORTALS array
- [ ] Update all `useNavigate` calls

### Phase 6: Polish & Test (2 days)
- [ ] Test all tool launches from new fret timeline
- [ ] Test quest progression through DAG
- [ ] Test journal flow (practice → reflection → Workbook)
- [ ] Test video library in Studio
- [ ] Test mentor submission flow
- [ ] Verify mobile responsiveness
- [ ] Run full test suite (168 tests)

**Total estimated time: 11 days**

---

## Migration Notes

**Data that moves:**
| Data | From | To |
|------|------|-----|
| Character stats | Playbook | Workbook header |
| Quest log | Playbook | Workbook main area |
| Tool grid | GuitarWorkbench | Workbook fret timeline |
| Journal entries | PlayerPortal | Workbook sidebar |
| Timeline | PlayerPortal | Workbook activity feed |
| Video library | PlayerPortal | Studio main area |
| Submissions | PlayerPortal | Studio mentor section |
| Resources | DigitalBinder | Studio downloads |

**No data loss:** All localStorage/IndexedDB keys remain the same. Only UI organization changes.

**Routes that change:**
| Old Route | New Route | Redirect? |
|-----------|-----------|-----------|
| `/guitar` | `/workbook` | Yes |
| `/playbook` | `/workbook` | Yes |
| `/player` | `/studio` | Yes |
| `/guitar/map` | `/workbook/map` | Yes |
| `/song` | `/song` | No change |

---

## Success Criteria

- [ ] Student opens Workbook and sees their character, current quest, and next tool in one scroll
- [ ] Student never sees a 12-tool grid again — tools are contextual to fret progress
- [ ] Student opens Studio and the primary action is "Record for Bertrand"
- [ ] Video library is browsable by protocol, fret, or unlocked status
- [ ] Mentor feedback appears as a stream, not buried in tabs
- [ ] All three portals share visual language (colors, cards, typography)
- [ ] Game mode is accessible from Workbook, not a hidden portal
- [ ] DAG progression is visible and actionable in Workbook
- [ ] Zero data loss for existing students
- [ ] All 168 tests passing
