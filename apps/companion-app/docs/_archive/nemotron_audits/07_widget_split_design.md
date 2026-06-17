---
title: 07_widget_split_design
status: archive
tags: []
date: 2026-06-14
---
# Voix Vive Widget Split Specification  
*Target: Beta launch readiness | Priority: High impact*

---

## 1. Feature Allocation  
### 🎸 **Troubadour Guitar** (Red Pill → Creative/Jam/RIFT)  
*Purpose: Free-form AI musical improvisation partner*  
- **Core Features**:  
  - Voice-first conversational AI with Bertrand (no text input fallback)  
  - Real-time pitch reference tool (`PLAY_PITCH`) triggered by voice commands ("play fret X")  
  - Somatic feedback visualization: breath waveform + emotion detection overlay  
  - RIFT-mode exclusive: Jam session context awareness (current key, tempo, scale suggestions)  
  - *Excluded*: Inbox system, progress tracking, lesson navigation, file save/load  

### 📔 **Troubadour Binder** (Blue Pill → Academy/Progress/Workbook)  
*Purpose: Structured learning workflow hub*  
- **Core Features**:  
  - Workbook submission system (voice/text → Bertrand review) with 5s "thinking delay" UX  
  - Progress dashboard: Streak, practice minutes, completed nodes, next recommended lesson  
  - Lesson navigator: Curriculum map with fret/phase filtering  
  - Sound tab: Ambient tracks + metronome (mutually exclusive with music playback)  
  - Save/load system: Local state persistence (.vvx files)  
  - *Excluded*: Free-form voice chat, real-time jam tools, emotion detection during playback  

---

## 2. Component Migration Plan  
| Current Component       | Destination Widget      | New Location                     | Notes                                                                 |
|-------------------------|-------------------------|----------------------------------|-----------------------------------------------------------------------|
| `RiftChat`              | Troubadour Guitar       | `src/troubadour/GuitarChat.jsx`  | Rename + strip inbox dependencies; keep voice/tools only             |
| StudyChat logic         | Troubadour Binder       | `src/binder/WorkbookReviewer.jsx`| Extract from BookWidget's Study tab; add submission/review flow      |
| TroubadourWidget (core) | Troubadour Guitar       | `src/widgets/TroubadourGuitar.jsx`| Keep voice/AI wiring; remove inbox/progress/UI                       |
| BookWidget              | Troubadour Binder       | `src/widgets/TroubadourBinder.jsx`| Rename + add progress dashboard; keep all tabs/sound logic           |

> **Critical**: Remove `useTroubadourInbox()` from `TroubadourGuitar` and migrate to `TroubadourBinder`'s Workbook tab.

---

## 3. Shared State Requirements  
Both widgets need these from `ScaffoldingProvider`:  
```javascript
// Essential for both (read-only context)
const { 
  currentFret,    // For pitch reference & AI context 
  currentPhase,   // Adaptive difficulty scaling 
  bardLevel       // Personalize Bertrand's response tone 
} = useScaffolding();

// TroubadourBinder ONLY (progress tracking)
const {
  traction,       // Practice streak/logging
  completedNodes, 
  nextRecommended,
  practiceMinutes,
  streak          // Display in binder header
} = useScaffolding();
```

> ✅ **No duplication**: Guitar uses only `currentFret/currentPhase/bardLevel`; Binder adds progress metrics.

---

## 4. Route Visibility Rules  
| Widget              | Shown On Routes                          | Hidden On Routes               | Trigger Mechanism                     |
|---------------------|------------------------------------------|--------------------------------|---------------------------------------|
| Troubadour Guitar   | `/guitar/*`, `/jam/*`, `/improvise/*`    | `/workbook/*`, `/lessons/*`    | `ambient:open` with `{mode: 'rift'}`  |
| Troubadour Binder   | `/workbook/*`, `/lessons/*`, `/settings/*`| `/guitar/*`, `/jam/*`          | `ambient:open` with `{mode: 'binder'}`|

> **Implementation**: Update `useTroubadour()` provider to emit route-specific events:  
> ```javascript
> // In TroubadourProvider.js
> const openRift = () => {
>   setActiveWidget('rift');
>   window.dispatchEvent(new CustomEvent('ambient:open', {detail: {mode: 'rift'}}));
> };
> 
> const openBinder = () => {
>   setActiveWidget('binder');
>   window.dispatchEvent(new CustomEvent('ambient:open', {detail: {mode: 'binder'}}));
> };
> ```

---

## 5. Icon/Visual Metaphor Update  
| Widget              | Current Icon       | New Icon (Lucide)     | Rationale                                                                 |
|---------------------|--------------------|-----------------------|---------------------------------------------------------------------------|
| Troubadour Guitar   | 🎸 Guitar          | **Zap** (`Zap`)       | Represents creative spark/jam energy; avoids confusion with actual guitar  |
| Troubadour Binder   | 📖 BookOpen        | **Folder** (`Folder`) | Better conveys "binder/workbook" metaphor; aligns with academy filing    |

> **CSS Update**:  
> - Guitar: Keep red theme but replace `Guitar` icon with `<Zap size={22} />` in toggle button  
> - Binder: Replace `BookOpen` with `<Folder size={22} />`; keep blue theme  

---

## 6. PEARL Headers (File-Level Documentation)  
### 🎸 `src/widgets/TroubadourGuitar.jsx`  
```markdown
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : TroubadourGuitar.jsx                                 ║
// ║ WHAT    : Red Pill — AI Jam Partner (Voice-First Improvisation)⌲
// ║ WHY     : Embodied musical dialogue; breath-aware, somatic      │
// ║           interaction with Bertrand as creative catalyst.       │
// ║ POSITION: top-4 left-4                                         │
// ║ PAIR    : TroubadourBinder.jsx (top-4 right-4)                 │
// ╚═══════════════════════════════════════════════════════════════╝
```

### 📔 `src/widgets/TroubadourBinder.jsx`  
```markdown
// ╔══ VOIX VIVE ══════════════════════════════════════════════════╗
// ║ FILE    : TroubadourBinder.jsx                                 ║
// ║ WHAT    : Blue Pill — Academy Workbook & Progress Tracker      │
// ║ WHY     : Structured learning loop: submit → review → advance  │
// ║           (Workbook-side) + curriculum navigation.             │
// ║ POSITION: top-4 right-4                                        │
// ║ PAIR    : TroubadourGuitar.jsx (top-4 left-4)                  │
// ╚═══════════════════════════════════════════════════════════════╝
```

---

## 7. Refactoring Effort Estimate  
| Task                                      | Hours | Complexity | Risk Mitigation                                  |
|-------------------------------------------|-------|------------|--------------------------------------------------|
| Extract `RiftChat` → `GuitarChat.jsx`     | 2     | Low        | Unit test voice tool calls                       |
| Strip inbox/progress from Guitar widget   | 1.5   | Low        | Verify AI context still works                    |
| Build Workbook tab in Binder              | 3     | Medium       | Reuse existing submission logic                  |
| Add progress dashboard to Binder          | 2     | Low        | Use existing ScaffoldingProvider hooks           |
| Rename icons + update PEARL headers       | 0.5   | Trivial      | Visual regression check                          |
| Route visibility logic                    | 1     | Low        | Test ambient event routing                       |
| **TOTAL**                                 | **10**| **Medium**   | **<12h total; safe for beta bug-fix session**    |

> ✅ **Beta-safe**: All changes are isolated to widget files; no core provider modifications.

---

## 8. Chat Component Strategy: Consolidate or Separate?  
### ❌ **Do NOT consolidate**  
- **TroubadourGuitarChat**: Pure voice jam tool (no text input, optimized for low-latency somatic feedback)  
- **TroubadourBinderWorkbookReviewer**: Text/voice submission → review workflow (with 5s delay UX)  

### Why Separate?  
1. **Different UX Flows**:  
   - Guitar: Real-time turn-taking (<1s latency critical)  
   - Binder: Asynchronous submission/review (5s "thinking" delay intentional)  
2. **State Isolation**:  
   - Guitar needs voice connection state; Binder needs inbox/submission state  
3. **Future-Proofing**:  
   - Enables independent scaling (e.g., Guitar for mobile jam mode, Binder for desktop workflow)  

> 📌 **Action**: Create two distinct components:  
> - `src/troubadour/GuitarChat.jsx` (voice-only, no text input)  
> - `src/binder/WorkbookReviewer.jsx` (handles submissions + review display)

---

## ✅ Beta Launch Readiness Checklist  
1. [ ] Guitar widget shows **only** Zap icon + voice controls (no progress/text input)  
2. [ ] Binder widget shows **Folder** icon + progress dashboard + Workbook tab  
3. [ ] Voice jam triggers `PLAY_PITCH` tool correctly in Guitar mode  
4. [ ] Submitting practice in Binder creates review with 5s delay UX  
5. [ ] Routes `/guitar/*` → Guitar visible; `/workbook/*` → Binder visible  
6. [ ] Icons updated per spec (Zap/Folder) + PEARL headers added  

**Estimated completion**: 2 refactor sessions (fits within bug-fix window)