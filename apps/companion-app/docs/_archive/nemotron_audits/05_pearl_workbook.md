---
title: 05_pearl_workbook
status: archive
tags: []
date: 2026-06-14
---
# PEARL Audit: Workbook/Academy Section

## 1. PEARL Headers

### src/components/Workbook.jsx
```jsx
// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : Workbook.jsx                                        ║
// ║ P · Perspective  : Learning journey as somatic progression —   ║
// ║                    shows student's current state through       ║
// ║                    breath, pitch, memory stats and quest path  ║
// ║ E · Engineering  : Integrates traction data, tool suggestions, ║
// ║                    journal counts, and XP systems via          ║
// ║                    useScaffolding and localDatabase            ║
// ║ A · Aesthetic    : Uses parchment tones, protocol-colored     ║
// ║                    indicators, and motion-guided tab transitions║
// ║ R · Research     : Based on somatic pedagogy docs/01_SOMATIC.md§3║
// ║ L · Layout       : Used by: App.jsx                           ║
// ║                    Uses: ScaffoldingProvider, useLocale,      ║
// ║                    playbookData, toolsData, chapterData        ║
// ╠════════════════════════════════════════════════════════════════╣
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ║ IP      : No traditional LMS gradebook, no SCORM compliance   ║
// ║ RULES   : Somatic stats must update in real-time from traction║
// ║ FIX AT  : Traction computation in ScaffoldingProvider         ║
// ╚════════════════════════════════════════════════════════════════╝
```

### src/components/playbook/CharacterSheet.jsx (Canonical)
```jsx
// ╔══ VOIX VIVE ═══════════════════════════════════════════════════╗
// ║ FILE    : CharacterSheet.jsx                                  ║
// ║ P · Perspective  : Identity formation — shows who student     ║
// ║                    is becoming through Troubadour Type and     ║
// ║                    certification progress                      ║
// ║ E · Engineering  : Computes stats from traction, fetches       ║
// ║                    coaching tier from DaaS, handles file I/O   ║
// ║ A · Aesthetic    : Dark parchment base with gold accent bars,  ║
// ║                    esoteric badge system                       ║
// ║ R · Research     : docs/03_TROUBADOUR.md §Four Troubadour Types║
// ║ L · Layout       : Used by: Workbook.jsx (character tab),      ║
// ║                    PlaybookShell.jsx                           ║
// ║                    Uses: useScaffolding, playbookData, saveState║
// ╠════════════════════════════════════════════════════════════════╣
// ║ STAGE   : IMPLEMENT (ADDIECRAPEYE phase 4)                    ║
// ║ IP      : No Florins, no Great Game stats                     ║
// ║ RULES   : Troubadour Types are identity system — not CAGED    ║
// ║ FIX AT  : playbookData.js → computeTroubadourProfile          ║
// ╚════════════════════════════════════════════════════════════════╝
```

## 2. Current Tabs/Panels/Sections in Workbook

### Tabs (5 total)
1. **`workbook`** - Main learning interface  
2. **`projects`** - Student creative work submissions  
3. **`submissions`** - Journal entries & mentor feedback  
4. **`library`** - Reference materials (scales, theory, etc.)  
5. **`character`** - Progress tracking, achievements, identity  

### Workbook Tab Internal Sections (only tab with visible JSX in source)
| Section | Location in Code | Purpose |
|---------|------------------|---------|
| Character Header | Lines 140-189 | Student name, level, streak, practice minutes, completed frets |
| XP Progress Bar | Lines 191-200 | XP current/next, visual progress bar |
| Sensation Stats Grid | Lines 202-226 | Breath/Pitch/Memory stats with emojis, scores, progress bars |
| Active Quest Hero CTA | Lines 228-248 | Current quest suggestion with protocol, invitation, start button |
| 12-Fret Quest Timeline | Lines 250-318 (incomplete in source) | Fret-by-fret progress visualization |

*Note: Other tabs (`projects`, `submissions`, `library`) lack visible JSX in provided source but exist per `TABS` array.*

## 3. KEEP/SIMPLIFY/MOVE/DELETE Rationale

### Tabs (Top-Level Navigation)
| Tab | Decision | Rationale |
|-----|----------|-----------|
| **workbook** | **KEEP** | Core learning path; contains somatic progression mechanics. Cannot remove without breaking primary user journey. |
| **projects** | **SIMPLIFY** | Currently undefined in source. Merge with `submissions` → **"Create & Reflect"**. Projects (songwriting/composition) naturally belong with reflective journaling as complementary creative acts. Reduces tab count while strengthening somatic feedback loop. |
| **submissions** | **MOVE** | Content (journal counts, voice prompts) belongs in new "Create & Reflect" tab. Current name is misleading — implies only graded work, but actually handles formative practice reflections. |
| **library** | **DELETE** | Reference materials should be contextual: <br>- Theory scales → embed in `FretboardExplorer` tool <br>- Technique guides → attach to specific quest steps <br>Global library tab creates unnecessary context-switching for just-in-time learning needs. |
| **character** | **KEEP** | Essential for longitudinal identity tracking (Troubadour Types, certifications). Separates *who I am becoming* from *what I'm doing now*. |

### Workbook Tab Internal Sections
| Section | Decision | Rationale |
|---------|----------|-----------|
| Character Header | **KEEP** | Critical for motivation: shows immediate somatic progress (streak, minutes). Well-designed with clear hierarchy. |
| XP Progress Bar | **SIMPLIFY** | Redundant with Character Header's level display. Remove bar; keep only `XP Current / Next` text label beside level. Saves vertical space. |
| Sensation Stats Grid | **KEEP** | Core to somatic pedagogy — breath/pitch/memory are foundational. Visual bars provide instant biofeedback. *Optimization:* Replace emojis with protocol-colored dots (matches existing design system) for faster scanning. |
| Active Quest Hero CTA | **KEEP** | Excellent just-in-time nudge. *Action:* Add micro-animation (pulse) on button when suggestion changes to draw attention without being distracting. |
| 12-Fret Quest Timeline | **MOVE** | Overwhelms cognitive load showing all 12 frets at once. Replace with: <br>**"Current Path"**: Shows only active fret + next 2 (progressive disclosure) <br>**"Mastery Map"** (separate button): Modal showing full 12-fret view *only* when user requests big-picture perspective |

## 4. Brightspace Comparison

### What Brightspace Does Better Here
- **Structured Deadlines**: Brightspace shows due dates prominently in course calendar; Workbook lacks temporal awareness (no streak-based reminders for overdue practice).
- **Grading Transparency**: Brightspace displays rubric scores per assignment; Workbook's journal system shows only submission count, not qualitative feedback depth.
- **Mobile-First Navigation**: Brightspace uses persistent bottom nav on mobile; Workbook's hamburger menu hides critical tabs behind extra tap.

### What This App Does BETTER Than Brightspace
| Dimension | Voix Vive Advantage |
|-----------|---------------------|
| **Feedback Loop** | Real-time somatic stats (breath/pitch/memory) update *during* practice via tool integration; Brightspace only shows delayed quiz grades. |
| **Identity Formation** | Troubadour Type system creates narrative identity ("I am a Sound Weaver"); Brightspace uses generic "student" label with no personal mythology. |
| **Contextual Help** | Voice prompts (CosyVoice) deliver fret-specific somatic cues *in flow*; Brightspace relies on static text help buried in menus. |
| **Progress Visualization** | Sensation Stats Grid shows embodied skill development; Brightspace only tracks completion percentages and scores. |

## 5. Simplified Workbook Design (Max 4 Tabs)

```markdown
# Proposed Tab Structure (4 Tabs)
1. **📚 Learn** (formerly `workbook`)  
   - *Core somatic journey*: Current quest CTA + Progressive Path (current fret + next 2)  
   - *Removed*: XP bar (merged into level text), full 12-fret timeline (now modal)  

2. **🎵 Create & Reflect** (merged `projects` + `submissions`)  
   - Left: Journal entries with voice-to-text + mentor feedback threads  
   - Right: Project workspace (songwriting companion, recording tools)  
   - *Unified*: Creative output and reflective practice as complementary acts  

3. **👤 Character** (unchanged)  
   - Troubadour Type profile, certification progress, achievement badges  
   - *Added*: "Mastery Map" button (opens full 12-fret modal view)  

4. **🔧 Tools** (new)  
   - Persistent sidebar in Learn tab: BreathingGate, PitchRoom, etc.  
   - *Replaces*: Library tab + scattered tool imports  
   - *Why*: Just-in-time access to somatic tools without leaving learning flow  
```

### Implementation Notes
- **Tools Sidebar**: In `Workbook.jsx`, replace fixed-width container with:
  ```jsx
  <div style={{ display: 'flex', gap: '16px' }}>
    <aside style={styles.toolsSidebar}> {/* Tools components */}</aside>
    <main style={styles.learnContent> {/* Learn tab content */}</main>
  </div>
  ```
- **Progressive Path**: Replace `QUEST_DATA.map()` with:
  ```jsx
  const activeFret = traction?.currentFret || 1;
  QUEST_DATA.slice(activeFret - 1, activeFret + 2).map(...) // Show current + next 2
  ```
- **Mastery Map Modal**: Add button in Character tab header that opens full fret timeline in dialog.

## 6. Troubadour Binder Widget Placement

- **Current Location**: Not explicitly visible in source, but implied by CharacterSheet's certification section (lines 40-120 in CharacterSheet.jsx).
- **Recommended Fit**: **Character tab** → as a collapsible "Binder" panel below certifications.
  ```jsx
  {/* In CharacterSheet.jsx */}
  <div style={styles.binderSection}>
    <h3>{lang === 'fr' ? 'Classeur du Troubadour' : 'Troubadour Binder'}</div>
    <div style={styles.binderGrid}>
      {/* Certificates, badges, milestone artifacts */}
    </div>
  </div>
  ```
- **Rationale**: 
  - Binder represents *collected evidence of identity* (certificates, reflections, projects) → belongs with Character tab's identity focus.
  - Keeps Workbook tab focused on *present-moment learning flow* without archival distractions.
  - Enables one-click access to portfolio during mentor reviews (avoids navigating to separate Library tab).

## 7. Cognitive Load Score

### Current Workbook Tab: **4.7/5**  
*(1 = minimal load, 5 = overwhelming)*  

**Breakdown**:
- **Extraneous Load**: 3.2/5  
  *(Redundant XP bar + sensation stats duplicate information already in Character Header; timeline shows all 12 frets forcing split attention)*
- **Germane Load**: 2.1/5  
  *(Strong somatic feedback loop via stats/tools, but buried under navigational complexity)*
- **Intrinsic Load**: 3.8/5  
  *(High due to 12 concurrent progress paths + real-time voice prompts + tool suggestions)*

**Primary Pain Points**:
1. Timeline forces simultaneous processing of 12 fret states (working memory overload)
2. Sensation stats require cross-referencing with Active Quest to understand relevance
3. No visual hierarchy between "current action" (Quest CTA) and "context" (timeline/stats)

### Target Post-Simplification: **2.3/5**  
*(Achieved by progressive disclosure, tab reduction, and contextual tool access)*  

**Key Improvements**:
- Progressive path reduces timeline elements from 12 → 3 (-75% visual items)
- Tools sidebar puts somatic aids in constant peripheral vision (no context-switching)
- Create & Reflect tab unifies output/reflection into single creative flow state
- Character tab isolates identity work from immediate learning tasks

> **Final Note**: This redesign aligns with PEARL's *Layout* principle by prioritizing **present-moment somatic awareness** over administrative overhead — directly targeting Brightspace's weakness in embodied learning environments while amplifying Voix Vive's unique neuropedagogical advantage.