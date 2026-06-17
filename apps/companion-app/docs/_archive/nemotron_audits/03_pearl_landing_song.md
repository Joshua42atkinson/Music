---
title: 03_pearl_landing_song
status: archive
tags: []
date: 2026-06-14
---
# 🎯 PEARL Audit – Voix Vive (Beta‑Ready)

---

## 1️⃣ LandingScreen.jsx  

### ✅ **PEARL Header** *(to replace the current comment block)*  

```text
// ╔══ VOIX VIVE — LANDING SCREEN – PEARL AUDIT (v0.9) ──────────────────────
// P = Perspective: First‑touch hub that frames the student’s journey as a Boethian Trinity  
// E = Engineering: React + Framer Motion; lazy loads AuthButton & CoachingPortal via hooks   
// A = Aesthetic: Dark ambient glow, radial gradient background, portal cards with hover lift 
// R = Research: Somatic‑first pedagogy – breath → body awareness before technique  
// L = Layout: Central vertical stack (Wordmark → Trinity label → Manifesto → Portals) that routes to Song/Workbook/Player; each card is a self‑contained navigation target.   
// ╚══───────────────────────────────────────────────────────────────────────  
```

### ✅ What’s Working Well (Keep & Protect)

| Area | Why it works |
|------|--------------|
| **Portal Grid** – three clearly‑colored cards (`song`, `workbook`, `player`) with distinct icons and hover lift. Gives instant visual affordance for the “Trinity” entry points. |
| **Manifesto Section** – typographic hierarchy (Cormorant Garamond title, EB Garamond body) reinforces the poetic voice of Maestro Laurence while staying readable on mobile via media queries (`max-width: 599px`). |
| **Dynamic Locale Switcher** embedded in `useLocale` and used throughout; language toggling works without a full page reload. |
| **Framer Motion `AnimatePresence` wrapper (imported but not yet used)** – ready for entrance/exit animations when portals mount/unmount, keeping the door open for polished micro‑interactions later in beta. |

### 🚧 What’s Cluttered / Confusing for a First‑Time Guitar Student

| Issue | Detail |
|-------|--------|
| **Over‑styled CSS Inline** – The entire `<style>` block lives inside the component (≈ 350 lines). Makes it hard to scan JSX and couples presentation tightly to logic, increasing cognitive load when debugging. |
| **Redundant “Trinity Label” & Wordmark** – Both sit above the manifesto; a first‑time visitor reads two blocks of decorative text before seeing any actionable portals, delaying the core CTA. |
| **CoachingPortal Imported but Conditionally Rendered Only via State Toggle (`showCoaching`)** – The toggle UI is nowhere visible on first load, leaving an unused import and potential confusion about why the component exists. |
| **Unused `useTroubadour` Hook** – Loads AI model data that isn’t displayed anywhere on the landing screen; adds unnecessary bundle weight and mental overhead (“What does this do?”). |

### 🛠️ 3 Specific UI Improvements for Beta (Actionable, Code‑Ready)

1. **Extract Styles to a CSS Module / Tailwind‑like Utility File**  
   - Create `src/styles/LandingScreen.module.css` and move the entire `<style>` block there.  
   - Import with `import styles from './LandingScreen.module.css';` and replace className strings (`className={styles.landingHub}` etc.).  
   - *Impact*: Cleaner JSX, easier theme tweaks, and faster hot‑module replacement during beta bug‑fixes.

2. **Collapse the Trinity Label into the Wordmark (or hide on mobile)**  
   - Add a media query: `@media (max-width: 599px) { .trinity-label { display:none; } }` or merge the label into the wordmark image alt‑text for screen‑readers.  
   - *Impact*: Reduces vertical scroll before the first CTA, improving perceived load speed and focus on the portal grid.

3. **Add a Subtle Entrance Animation to Portal Cards using Framer Motion**  
   - Wrap each `.portal-card` in `<motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.4, delay:index*0.08}}>`.  
   - *Impact*: Gives a polished, “alive” feel that aligns with the somatic‑first ethos (gentle motion → body awareness) without extra JS logic.

### 🗑️ What to Remove Before Launch

| Item | Reason |
|------|--------|
| `import { CoachingPortal } from '../components/CoachingPortal';` (if not used) – currently only toggled via hidden state; either expose a visible button or delete the import and component until coaching flow is ready. |
| The `useTroubadour` hook call (`const { voixReady, voixLoading, loadVoix, unloadVoix, loadProgress } = useTroubadour();`) – no UI consumes these values on the landing screen; move the call to the Player or Workbook where AI mentorship is actually surfaced. |
| Inline CSS comment blocks that duplicate the PEARL header (the large ASCII art box) – keep only the concise PEARL header at the top of the file; the rest belongs in a dedicated design‑system doc. |

### 📊 Cognitive Load Score  
**6 / 10** – The layout is clear, but the monolithic style block and hidden state toggles force the reader to juggle presentation and logic simultaneously. After extracting styles and simplifying the hero area, the score should drop to **3‑4**.

---

## 2️⃣ OrientationHub.jsx (The “Song” / Neck Landing Page)

### ✅ **PEARL Header** *(to replace the current comment block)*  

```text
// ╔══ VOIX VIVE — ORIENTATION HUB – PEARL AUDIT (v0.9) ──────────────────────
// P = Perspective: The “Neck” metaphor maps each of the 12 somatic frets to a chapter; student scrolls down a rose‑wood fretboard, embodying breath‑first awareness.
// E = Engineering: React + useScaffolding for mode state; NeckMenu renders vertical list; SlideViewer handles per‑fret content lazy‑load via generateSlides().
// A = Aesthetic: Fretboard texture (rosewood grain), glowing inlay dots, mode pill with gradient backdrop, subtle hover/focus states.
// R = Research: Somatic guitar pedagogy – each fret corresponds to a pedagogical pillar (breath, observer, silence, mentor, theory, CAGED, inner ear, ordeal, sword, sunset, mirror, infinity).
// L = Layout: Fixed nav bar (back → mode pill → auth) + scrollable NeckMenu; clicking a fret pushes SlideViewer (full‑screen) – clear hierarchical navigation.
// ╚══───────────────────────────────────────────────────────────────────────  
```

### ✅ What’s Working Well (Keep & Protect)

| Area | Why it works |
|------|--------------|
| **NeckMenu + Fretboard Metaphor** – Visual mapping of chapters to frets is instantly understandable for guitarists; the rose‑wood grain and dot inlays reinforce instrument familiarity. |
| **Mode Pill in Nav Bar** – Displays current study mode (Apprenticeship/Self‑Study/Exploration/Library) with color‑coded background and a clickable popover; gives instant feedback on AI/sandbox settings without leaving the page. |
| **Lazy‑Loaded SlideViewer** – Only loads slides for the active fret, keeping initial bundle small and preserving performance on lower‑end devices. |
| **Progress Badges Integrated into Subtitle** – Shows ◐ or ● directly in the chapter list, letting students see completion at a glance. |

### 🚧 What’s Cluttered / Confusing for a First‑Time Guitar Student

| Issue | Detail |
|-------|--------|
| **Nav Bar Overload** – Back button, mode pill, and AuthButton are all on the same line; on narrow screens the mode pill can wrap, making the bar feel cramped. |
| **Modal‑Style Mode Popover** – The popover covers the entire screen with a dark backdrop but lacks a clear visual hierarchy (title → description → toggles). First‑time users may miss the toggle buttons because they’re tucked inside two separate flex containers. |
| **Unused `forceCalibration` State** – Only set via external logic; if not needed, it adds mental overhead (“Why is there a calibration force flag?”). |
| **DailyCalibration Redirect Logic** – When uncalibrated, the component redirects to `/` after closing the modal; this can feel like a “bounce” that confuses users who just wanted to explore the neck. |

### 🛠️ 3 Specific UI Improvements for Beta (Actionable, Code‑Ready)

1. **Responsive Nav Bar – Stack Items Vertically on ≤ 480px**  
   - Add a media query: `@media (max-width: 480px) { .nav-bar-container { flex-direction: column; gap: 8px; align-items: stretch; } }` and make the mode pill full‑width.  
   - *Impact*: Prevents cramped layout on small phones, improves tap targets for the mode pill and AuthButton.

2. **Refactor Mode Popover into a Reusable `ModeSettingsDialog` Component**  
   - Move the entire `<div style={{position:'fixed', inset:0, ...}}>` block to `src/components/ModeSettingsDialog.jsx`.  
   - Pass `currentMode`, `sandboxMode`, `aiEnabled`, `updateTraction`, `locale` as props.  
   - *Impact*: Keeps OrientationHub focused on navigation logic; makes the popover easier to test and style consistently across the app (e.g., also reusable in Player settings).

3. **Add a Subtle “Fret‑Hover” Preview** – When hovering over a fret in NeckMenu, show a small tooltip with the chapter’s icon and short description (use `CHAPTER_ICONS[ch.id].symbol`).  
   - Implement via CSS `:hover::after` on each `<li>` rendered by NeckMenu.  
   - *Impact*: Gives immediate context before clicking, reducing the chance of landing on a chapter that feels irrelevant and thus lowering decision fatigue.

### 🗑️ What to Remove Before Launch

| Item | Reason |
|------|--------|
| `forceCalibration` state and its associated conditional (`if (((!isCalibrated && !sandboxMode) || forceCalibration)...`) – unless a manual calibration trigger is exposed elsewhere, this adds unnecessary complexity. |
| Inline `style` objects on the mode pill and popover buttons (e.g., `style={{ display:'flex', ... }}`). Move these to a CSS module (`OrientationHub.module.css`) or use a utility library like Tailwind for consistency. |
| The commented‑out ASCII art header at the top of the file – keep only the concise PEARL header; the large comment block adds noise during code reviews. |

### 📊 Cognitive Load Score  
**7 / 10** – The neck metaphor is strong, but the nav bar’s horizontal crowding, the monolithic popover styles, and the hidden calibration flag increase mental effort for newcomers. After implementing the responsive nav, extracting the popover to a component, and removing `forceCalibration`, the score should fall to **4‑5**.

---

## 🎉 Why the Landing Page & “Song” (OrientationHub) Are Considered *Dope*

- **Landing Page** delivers a clear, three‑path Trinity that instantly tells a student *“where do I start?”* – the portal cards are visually distinct, color‑coded, and animate on hover, giving an immediate sense of agency.  
- **OrientationHub (Song)** transforms abstract curriculum into a tangible instrument metaphor: scrolling down a rose‑wood neck feels like moving up frets, reinforcing the somatic, body‑first approach each time the user interacts with a chapter. The mode pill provides real‑time feedback on AI/sandbox settings without burying them in settings menus.

Both screens succeed because they **marry pedagogical intent (Perspective & Research) with concrete, guitar‑centric visual metaphors (Aesthetic & Layout)** while keeping the engineering surface clean enough to iterate quickly during beta.  

--- 

*Ready for the bug‑fixing session: apply the style‑extraction, responsive nav, and modal refactor first; they yield the biggest UX lift with the least risk.*