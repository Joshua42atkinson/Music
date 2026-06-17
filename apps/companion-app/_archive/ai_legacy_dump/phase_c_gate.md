---
description: Pre-Phase C Quality Gate — fix critical bugs, inject Nemotron content, verify student flow
---

# Pre-Phase C Quality Gate

> **Do not start Tauri, Prompt v4, or any Phase C work until EVERY item below is checked.**
> This is the barrier between "Mechanical Mode works" and "production-ready curriculum."

---

## CRITICAL BUGS (Block Student Flow)

### 1. BEWorkbook Nodes Never Unlock
**Why:** `isNodeUnlocked()` checks `completedNodes` array, but `completePhase()` only updates `traction.frets[N].beCompleted`. The node ID is never added to `completedNodes`.
**Impact:** Student checks BE on Fret 1, but DO and PLAY stay locked forever. App looks broken.
**Fix in:** `BEWorkbook.jsx` + `ScaffoldingProvider.jsx`
**Approach:** Change `isNodeUnlocked` in BEWorkbook to check `traction.frets` phase completion instead of `completedNodes`. OR make `completePhase` also call `completeNode()`.
**Test:** Open BEWorkbook → check BE → verify DO checkbox becomes enabled.

### 2. PitchRoom Always Maps to Fret 1
**Why:** `GuitarWorkbench.jsx` stores **tool ID string** (`'pitch-room'`) into `voixvive_last_tool_fret`. PitchRoom does `parseInt('pitch-room', 10)` → `NaN` → falls back to `1`.
**Impact:** Student practices Fret 7, but DO phase completion and Somatic Gate record on Fret 1.
**Fix in:** `GuitarWorkbench.jsx` line ~170
**Approach:** Store the actual **fret number** when launching a tool: `localStorage.setItem('voixvive_last_tool_fret', String(currentFret))`
**Test:** Open Guitar Workbench → select Fret 5 → open PitchRoom → match pitch → verify BEWorkbook shows Fret 5 DO unlocked.

---

## NEMOTRON CONTENT INJECTION (Fret 2–12)

### 3. Parse Generated JSON Files
**Files:** `src/data/dag/generated/fret_2_prompts.json` through `fret_12_prompts.json`
**Action:**
- Extract `choices[0].message.content` from each file
- Parse the inner JSON string (some files have whitespace/newlines before the `{`)
- Validate all 9 keys exist: `class-be`, `class-do`, `class-play`, `class-milestone`, `guitar-be`, `guitar-do`, `guitar-play`, `workbook-be`, `workbook-do`, `workbook-play`, `workbook-reflection`

### 4. Fix Nemotron Syntax Errors
**Action for every prompt string:**
- Replace single quotes containing apostrophes with backtick template literals (build-breaker from Fret 1)
- Remove double "Over." at end of lines (e.g. `"...movie? Over. Over."`)
- Verify interval names match `FRET_METADATA` (e.g. Fret 2 must be "Minor 2nd", not "perfect fifth")
- Trim trailing whitespace

### 5. Inject into dagNodes.js
**File:** `src/data/dag/dagNodes.js`
**Action:**
- Create `FRET_2_NODES` through `FRET_12_NODES` arrays following the exact schema of `FRET_1_NODES`
- Map Nemotron keys to node fields:
  - `class-be` → `id: 'fret-N-class-be'`, `phase: 'be'`, `pillar: 'class'`, `troubadourPrompt: value`
  - `class-do` → `id: 'fret-N-class-do'`, `phase: 'do'`, `pillar: 'class'`
  - etc.
- Set `prerequisites` correctly (BE has none, DO requires BE, PLAY requires DO, milestone requires all three)
- Set `suggestedAfter` to point to next phase node
- Add `xpValue`, `estimatedMinutes`, `type` (slide/tool/game/journal/submission/reflection/milestone)
- Spread all arrays into `export const dagNodes = [...FRET_1_NODES, ...FRET_2_NODES, ...]`

### 6. Verify Node Count
**Expected:** 12 frets × 3 pillars × 3 phases + 12 milestones + 12 reflections = ~120 nodes
**Command:** `console.log(dagNodes.length)` in browser devtools after build

---

## SOFT SPOTS (Nurture Before Moving On)

### 7. Old Student State Migration
**File:** `src/data/tractionStore.js` line ~111 (`getFretState`)
**Action:** Change from:
```js
return state.frets[fretId] || getDefaultFretState(fretId);
```
To:
```js
return { ...getDefaultFretState(fretId), ...state.frets[fretId] };
```
**Why:** Students with pre-Phase B data will have old fret objects missing `beMastery`, `beResonance`, `beGatePassed`.

### 8. BEWorkbook Progress Bar
**File:** `src/components/playbook/BEWorkbook.jsx` line ~265
**Action:** Calculate progress from `traction.frets` phase completion instead of `completedNodes`:
```js
const completedPhases = Object.values(traction.frets).reduce((sum, f) => {
  return sum + (f.beCompleted ? 1 : 0) + (f.doCompleted ? 1 : 0) + (f.playCompleted ? 1 : 0);
}, 0);
const totalPhases = dagNodes.filter(n => n.phase !== 'all').length;
const percent = (completedPhases / totalPhases) * 100;
```

### 9. Audiation Timer Cleanup
**File:** `src/components/PitchRoom.jsx` lines 52–66
**Action:** Replace interval-in-effect with a single `setTimeout` approach:
```js
useEffect(() => {
  if (!audiationActive) return;
  const endTime = Date.now() + 4000;
  const tick = () => {
    const remaining = Math.ceil((endTime - Date.now()) / 1000);
    if (remaining <= 0) {
      setAudiationActive(false);
      setAudiationReady(true);
      setAudiationSeconds(0);
    } else {
      setAudiationSeconds(remaining);
      requestAnimationFrame(tick);
    }
  };
  requestAnimationFrame(tick);
}, [audiationActive]);
```

### 10. Triple Save on Last Slide
**File:** `src/components/SlideViewer.jsx` lines 80–87
**Action:** Merge into single state update inside `updateTraction`:
```js
updateTraction(prev => {
  const fretState = getFretState(prev, fretId);
  if (fretState.yinCompleted) return prev;
  const merged = {
    ...prev,
    frets: {
      ...prev.frets,
      [fretId]: {
        ...getDefaultFretState(fretId),
        ...prev.frets[fretId],
        yinCompleted: true,
        beGatePassed: true,
        lastAccessed: new Date().toISOString(),
      }
    }
  };
  saveTraction(merged);
  return merged;
});
```

---

## TUTORIAL SCRIPT (Re-run Nemotron)

### 11. Generate 20-Minute Guided Tutorial
**Task for Nemotron:**
- Input: `src/data/dag/generated/tutorial_script.json` (previous attempt hit token limit)
- Split into 3 smaller prompts:
  - Part A: Introduction + BE phase (6 min)
  - Part B: DO phase + Net Protocol (7 min)
  - Part C: PLAY phase + Hands-free nav + Wrap-up (7 min)
- Each part: JSON array of `{ section, speaker, text, duration_seconds }`
- Every line ends with "Over."
- Speaker: "Bertrand Laurence"
- Warm mentor voice with occasional French

### 12. Inject Tutorial Script
**File:** Create `src/data/dag/tutorialScript.js`
**Export:** `export const TUTORIAL_SCRIPT = [ ... ]`
**Usage:** Feed to `AmbientPlayer.jsx` `buildSystemPrompt()` when student clicks "Start Guided Tutorial"

---

## VERIFICATION CHECKLIST

### 13. Build Verification
```bash
npm run build
```
**Gate:** Zero errors. Zero warnings about chunk size (acceptable for now).

### 14. Student Flow Test
```bash
npx vitest run src/data/__tests__/tractionStore.studentFlow.test.js
```
**Gate:** All 12 tests pass.

### 15. Browser Walkthrough
```bash
npm run preview -- --port 4173
```
**Manual steps:**
- [ ] Open landing page → navigate to "The Song"
- [ ] Swipe through Fret 1 slides to the end
- [ ] Verify "Mark BE Phase Complete" button is initially locked (🔒)
- [ ] After reaching last slide, verify button unlocks
- [ ] Click "Mark BE Phase Complete" → haptic feedback
- [ ] Open Troubadour's Playbook → Workbook tab
- [ ] Verify Fret 1 BE shows ✓, DO and PLAY are enabled
- [ ] Navigate to Guitar Workbench → select Fret 3 → open Pitch Room
- [ ] Click "Begin Silent Space" → verify 4-second countdown
- [ ] After countdown, click "Start Challenge" → guess interval correctly
- [ ] Verify "Mark DO Phase Complete" appears and unlocks
- [ ] Return to BEWorkbook → verify Fret 3 DO shows ✓
- [ ] Verify overall progress bar > 0%

### 16. Multi-Fret Verification
- [ ] Complete BE on Fret 1, 2, 3
- [ ] Verify `totalTraction` = 99 (3 × 33)
- [ ] Verify `bardLevel` = 2
- [ ] Verify Fret 4 auto-unlocks in fret selector

---

## DOCUMENTATION UPDATE

### 17. Update Maturation Map
**File:** `.windsurf/workflows/ai-dag-maturation.md`
**Action:**
- Change Phase A status from "60%" to "95%" after Fret 2–12 injection
- Add "Pre-Phase C Gate" section with link to this workflow
- Update "What's Left" for Phase A to: "Tutorial script re-generation + injection"

### 18. Update README or CONTEXT.md
**Action:** Add a "Student Flow" section documenting:
- How to mark phases complete
- What the Somatic Gates require
- How 4-level mastery works
- What ⚡ Resonant means

---

## EXIT CRITERIA (All Must Pass)

| # | Gate | How to Verify |
|---|------|-------------|
| 1 | Build succeeds | `npm run build` exits 0 |
| 2 | All tests pass | `npx vitest run` → 0 failures |
| 3 | Student can complete Fret 1 end-to-end | Browser walkthrough checklist |
| 4 | Student can complete Fret 3 end-to-end | Multi-fret verification checklist |
| 5 | BEWorkbook shows >0% progress | Visual confirmation |
| 6 | All 12 frets have node data | `dagNodes.length >= 100` |
| 7 | No console errors | Browser DevTools → Console is clean |
| 8 | Maturation map updated | Phase A = 95%, link to this workflow exists |

**When all 8 gates are green:** You may proceed to Phase C (Tauri Scaffold).

---

## REMEMBER

- Nemotron content is **raw ore**, not **finished steel**. Parse, validate, fix quotes, verify intervals.
- A student who can't unlock Fret 1 DO phase will never see Fret 2. Fix the unlocking bug first.
- A student whose pitch match records on the wrong fret will lose trust in the app. Fix the fret tracking bug first.
- The 144-node DAG is beautiful theory. Two working frets with perfect flow is better than twelve ghost frets.

**The goal is not to be done. The goal is to be ready.**
