---
description: Pre-session drift audit — verify code still matches docs before writing new features
---

# Voix Vive Drift Check

Run this at the start of every coding session to catch architecture drift.

## 1. Routing Table Check

Read `docs/02_ARCHITECTURE.md` § Routing Table.

Verify every route in `App.jsx` matches the documented table.
If a route exists in code but not docs → **DRIFT: document or remove.**

## 2. AI Persona Check

Read `docs/03_TROUBADOUR.md` § Hard Rules.

Open `src/components/AmbientPlayer.jsx` → `buildSystemPrompt()`.

Verify:
- [ ] Max 3 sentences per response
- [ ] No self-reference as "AI" / "bot" / "assistant"
- [ ] No scores, speed, difficulty levels
- [ ] French expressions used naturally
- [ ] Ends with breath, imagination, or next step
- [ ] **NEW rules added since last session are documented in 03_TROUBADOUR.md**

## 3. 12-Fret Map Check

Read `research/10_design_doc_02_curriculum.md` § 12-fret tool map.

Verify every component/feature maps to a fret, protocol, or phase.
If something doesn't map → **DRIFT: justify or defer.**

## 4. Naming Convention Check

Grep codebase for forbidden words:
- "Dojo" → should be "Practice Nook"
- "Forge" → should not exist
- "Player/Character split" → should be "The Player portal"
- "Easy/Medium/Hard" → should be "Kinesthetic Awakening / Applied Practice / Flow State"
- "score rings" / "leaderboards" / "AP points" → should not exist

## 5. New Feature Documentation

If any `.jsx` or `.js` file was created in the last session:
- [ ] Is it in the Component Dependency Map in `docs/02_ARCHITECTURE.md`?
- [ ] Is its purpose documented?
- [ ] Does it map to a fret, protocol, or phase?

## 6. Dependency Check

Compare `package.json` against `docs/02_ARCHITECTURE.md` § Tech Stack.
Any new dependency must be justified.

## 7. Output

If all checks pass → proceed with feature work.
If drift found → **fix docs first, then code.** Never let docs lag behind code.
