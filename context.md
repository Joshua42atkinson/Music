# Voix Vive — Session Context & Final Sprint Plan
> **Last day of beta. Last phase of the college course. Finish strong.**
> Updated: 2026-06-28

---

## 1. Project Snapshot

| What | Status |
|---|---|
| **Companion app** | 224/224 tests passing, build clean, 0 lint errors |
| **Git remote** | `origin → github.com:joshua42atkinson/music.git` |
| **Unpushed commits** | 2 (`e3352c9` + `dab20bd`) — need `git push` |
| **Hosting** | Cloudflare Pages (wrangler.toml exists, `_redirects` configured for SPA) |
| **PWA** | Configured (manifest, service worker, caching) |
| **i18n** | EN/FR infrastructure complete, StudioPage done, some components still hardcoded |

---

## 2. What's Done (Don't Revisit)

### Hands-Free Voice System ✅
- `useHandsFreeCoach.js` — VAD + STT + 16 commands (EN/FR), `onUnhandledTranscript` callback
- `HandsFreeCoachBar.jsx` — passes `onUnhandledTranscript` through to hook
- `CScaleHub.jsx` — full voice handler map, AI command event listener, auto-speak on chapter change
- **AI-driven intent interpretation** — unhandled transcripts → Truebadour AI with context (chapter, pitch state, practice mode) → `[TOOL:XXX]` tags → `voixvive:ai_command` events → UI actions
- `truebadourPrompt.js` — hands-free mode instructions added to compressed prompt (under 2500 char budget)

### C Scale Curriculum ✅
- 12 chapters with deepDive, practiceTips, commonMistakes, practicePlan
- 12 audio snippets (flite placeholder MP3s)
- ChapterContentPanel with collapsible sections
- Practice mode (collapses chrome, minimal UI)
- Back button navigation

### Tech Debt ✅
- P1-P4: 100% complete (20/20 audit, 4/4 P1, 4/4 P2, 6/6 P3, 6/6 P4)
- P5: 5/6 complete (only `P5-inline-to-css` remains — 884 inline styles, very large, not a blocker)
- Phase E (test coverage): 0/7 — not a blocker for submission

### Business/Marketing ✅
- 5-tier subscription model in `pricingData.js`
- `MentorshipGate.jsx` uses `SUBSCRIPTION_TIERS`
- `useAuth.js` persists subscription tier to localStorage
- AI pre-screening pipeline (`aiPreScreening.js`, `usePreScreening.js`, `PreScreeningResults.jsx`)
- SEO/OG tags, JSON-LD, email capture
- StudioPage i18n complete (40+ keys EN/FR)

---

## 3. What's Left Before Final Submission

### 🔴 Must Do (Blocks Submission)

| # | Task | Effort | Notes |
|---|---|---|---|
| 1 | **Push to GitHub** | 5 min | `git push origin main` — 2 unpushed commits |
| 2 | **Deploy to Cloudflare Pages** | 30 min | Build → deploy → verify site loads. wrangler.toml + `_redirects` already exist |
| 3 | **Verify hands-free works on deployed site** | 30 min | Test on phone: start → say "next" → say "read" → say "practice" → AI intent test ("can we skip ahead?") |
| 4 | **Update LDT White Paper** | 1 hr | Current white paper doesn't mention AI-driven hands-free (only keyword-based). Needs update to reflect the two-tier system: keyword matching + AI intent interpretation |

### 🟡 Should Do (Polish for Final)

| # | Task | Effort | Notes |
|---|---|---|---|
| 5 | **Google Login integration** | 2-3 hr | OAuth exists in code but needs testing. Student logs in with Google → their Gemini API key is used for AI chat. This is the "MCP for Gemini" idea — use the student's own Google account for AI assistance |
| 6 | **French locale completeness audit** | 1 hr | Infrastructure exists, some strings may be missing in `fr.json` |
| 7 | **Lighthouse audit** | 30 min | Target 90+ across all metrics. Run on deployed site |
| 8 | **Update roadmap.md** | 15 min | Mark hands-free items as complete, reflect current state |

### 🟢 Nice to Have (Post-Submission)

| # | Task | Effort | Notes |
|---|---|---|---|
| 9 | Bertrand voice audio (CosyVoice/StepAudio) | 2-3 hr | Replace flite placeholders with cloned voice |
| 10 | Practice mode voice coach prompts | 1 hr | Periodic TTS encouragement during practice |
| 11 | P5-inline-to-css (Tailwind migration) | Very large | 884 inline styles, 62 components — not a 1-day task |
| 12 | Phase E test coverage (T1-T7) | 2 days | Not a blocker for submission |
| 13 | Stripe real payment links | 1 hr | Blocked on LLC + Stripe account (business setup, not code) |

---

## 4. Google Login / Student Gemini Integration

The user asked about "MCP for Gemini" — using the student's own Google account for AI assistance. Here's the approach:

### What Exists
- `useAuth.js` — has Google OAuth infrastructure
- `useGeminiTruebadour.js` — calls Gemini API with a server-side key
- `useTruebadourChat.js` — routes between Gemini Nano (on-device), WebGPU, and Firebase Vertex AI

### What We Could Do (If Time Permits)
1. **Google OAuth login** → student authenticates with their Google account
2. **Use student's Gemini access** → instead of our API key, use OAuth token to call Gemini API on behalf of the student
3. **Benefit:** No API costs for us. Each student uses their own Google AI quota. Free tier = wllama (offline), Community+ = their own Gemini via OAuth

### Reality Check
This is a 2-3 hour integration minimum. If we're doing the final today, prioritize:
1. Push + deploy (must)
2. Verify hands-free on deployed site (must)
3. Update white paper (must)
4. Then Google login if time remains

---

## 5. Deployment Steps (Cloudflare Pages)

```bash
# 1. Build the app
cd apps/companion-app && npm run build

# 2. Deploy via wrangler
npx wrangler pages deploy dist --project-name voix-vive

# 3. Or connect GitHub repo to Cloudflare Pages dashboard
#    → Set build command: npm --prefix apps/companion-app run build
#    → Set output directory: apps/companion-app/dist
#    → Auto-deploys on every push
```

---

## 6. File Map (Key Files for Final Sprint)

| File | Purpose |
|---|---|
| `apps/companion-app/src/hooks/useHandsFreeCoach.js` | VAD + STT + command matching + AI fallback |
| `apps/companion-app/src/components/handsfree/HandsFreeCoachBar.jsx` | UI toggle + passes onUnhandledTranscript |
| `apps/companion-app/src/pages/CScaleHub.jsx` | Main hub — voice handlers, AI intent, tool mapping |
| `apps/companion-app/src/data/truebadourPrompt.js` | AI system prompt (compressed + full) |
| `apps/companion-app/src/hooks/useTruebadourChat.js` | Streaming chat → Gemini Nano / WebGPU / Cloud |
| `apps/companion-app/src/hooks/TruebadourProvider.jsx` | Context provider for AI + TTS |
| `apps/companion-app/src/data/cScaleCurriculum.js` | 12 chapters with content |
| `apps/companion-app/src/data/pricingData.js` | 5-tier subscription model |
| `apps/companion-app/docs/LDT_SUBMISSION_WHITE_PAPER.md` | White paper for Purdue submission |
| `docs/VOIX_VIVE_HANDS_FREE_GAMEPLAN.md` | Full hands-free architecture plan |
| `docs/VOIX_VIVE_TECH_PLAN.md` | Technical development plan |
| `docs/VOIX_VIVE_BUSINESS_PLAN.md` | Business & financial plan |
| `apps/companion-app/docs/product/roadmap.md` | Living roadmap (source of truth for what's next) |

---

## 7. Session Workflow

1. **Push to GitHub** → deploy to Cloudflare
2. **Verify on phone** → hands-free flow end-to-end
3. **Update white paper** → reflect AI-driven hands-free
4. **Google login** → if time permits, wire OAuth → student's Gemini
5. **Final lint + build + test + commit + push**
6. **Submit to Purdue**

---

*This file is the session context. Update as tasks complete.*
