# 🤖 VOIX VIVE ACADEMY — AI SYSTEM PROMPT
**Welcome, new Agent.** If you are reading this in Cursor, Windsurf, or another IDE, this file is your source of truth. 

## 🗺️ Project Architecture: The Dual-Market Strategy
As of June 2026, Voix Vive operates on a **Dual-Market Architecture**. Do not conflate the two markets.

1. **The Broad Market (Audio AR Experience):** 
   - **Audience:** Absolute beginners (14-85 years old).
   - **Goal:** Compete with Yousician and Gibson. Immediate, fun, pitch-detected feedback.
   - **Code Location:** `src/features/audio-engine/` and `src/features/vr-fretboard/`
   - **Rule:** Keep it simple. NO heavy pedagogy here.

2. **The Somatic Masterclass (Advanced Track):**
   - **Audience:** Serious learners, true musicians, those seeking depth.
   - **Goal:** Compete with TrueFire, infused with Jungian psychology (The Truebadour, FHEAL, Somatic Gates).
   - **Code Location:** `src/features/somatic-masterclass/`
   - **Rule:** This is heavy, philosophical, and text-dense. It MUST be gated behind specific routes so it doesn't scare the Broad Market.

## 📚 Where Are The Documents?
The documentation is highly structured. You must read these files before making architectural changes:

### The "North Star" Product Documents (Read First)
- **`docs/product/plain_overview.md`**: The layman's elevator pitch. Read this to understand what we are building and who we are selling to.
- **`docs/product/roadmap.md`**: The living to-do list. **Currently executing Phase 1 (UI Routing Split)**.

### The "Bible" (Pedagogy)
- **`docs/pedagogy/12M.md`**: This is Joshua's 2000-line pedagogical dogma. It defines the "Somatic Masterclass." It contains everything about the Truebadour, the Monomyth, and the intervals. *Warning: Do not apply the rules of the Bible to the Broad Market AR app.*

### Engineering & Codebase Maps
- **`docs/engineering/ARCHITECTURE.md`**: The exact technical map of the React application, component hierarchy, state management, and offline-first data persistence. Read this before modifying the app.
- **`docs/engineering/LOCKED_DECISIONS.md`**: Hard rules on engineering constraints (e.g., how the Truebadour state machine works).
- **`_archive/`**: Contains hundreds of legacy architectural logs and old system prompts. Only reference if doing historical forensics.

## 🛠️ Current Development Phase
If you are taking over development, the immediate next task is:
**Phase 1: Dual-Market Routing (The UI Split)**
Currently, all `somatic-masterclass` UI elements load globally in `App.jsx`. Your job is to create an onboarding router that forces users to choose a path, and hides the masterclass behind a `/masterclass` URL.

## 🛑 Strict Instructions for AI
1. **Never use generic Tailwind colors:** We use specific brand variables (e.g., `text-[#f0e6d2]`, `bg-cf-void`, `rgba(201,169,110)`).
2. **Never delete the Masterclass:** Joshua values the deep pedagogy. Even if it seems like "bloat", it must be preserved in the `somatic-masterclass` directory, not deleted.
3. **Do not break Vite:** Use dynamic imports carefully, we use `vite-plugin-pwa`.
