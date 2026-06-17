---
title: 19_beta_launch_checklist
status: archive
tags: []
date: 2026-06-14
---
# Voix Vive – Beta Launch Checklist  

*All items are **actionable** and reference concrete files/components that exist in the repo.*  

---  

## 1️⃣ MUST‑HAVE BEFORE PUBLIC BETA (P0) – App‑Breaking / Critical Issues  

| # | Action | File(s) to edit | Why it blocks launch |
|---|--------|-----------------|----------------------|
| P0‑1 | **Validate required env vars at startup** and fail fast with a clear console/message if missing. | `src/utils/envCheck.js` (create) → import in `main.jsx` <br>```js\n// src/utils/envCheck.js\nexport const checkEnv = () => {\n  const required = ['VITE_SUPABASE_URL','VITE_SUPABASE_ANON_KEY'];\n  missing = required.filter(k=>!import.meta.env[k]);\n  if (missing.length) {\n    console.error('❌ Missing env vars:', missing.join(', '));\n    alert('Configuration error – please contact support.');\n  }\n};\n```<br>Call `checkEnv();` in `src/main.jsx` before React renders. | Prevents silent auth/API failures that would leave users on a blank screen. |
| P0‑2 | **Fix broken redirect after Supabase sign‑in** – ensure the callback route exists and is whitelisted in Supabase Auth settings. | `src/routes/AppRouter.jsx` (add) <br>```jsx\nimport { Navigate } from 'react-router-dom';\nconst Callback = () => <Navigate to="/" replace />;\n// … inside <Routes>\n<Route path="/auth/callback" element={<Callback />} />\n``` | Without a working callback users cannot complete email/password login – core flow broken. |
| P0‑3 | **Remove unused `useTroubadour` hook import** from LandingScreen (causes unnecessary bundle weight & potential runtime warnings). | `src/components/LandingScreen.jsx` <br>Delete the import line and any call to `useTroubadour();`. | Keeps bundle size low; avoids “hook called conditionally” lint errors. |
| P0‑4 | **Convert `/onboarding` page to a modal** and hide the route from the public nav (keep as fallback only). | 1️⃣ `src/components/Onboarding.jsx` – wrap existing JSX in `<Modal>` (Framer Motion or your UI lib). <br>2️⃣ `src/components/LandingScreen.jsx` – add state `showOnboarding` (default true for first‑visit via localStorage) and render `<Onboarding isOpen={showOnboarding} onClose={()=>setShowOnboarding(false)} />`.<br>3️⃣ Keep route `/onboarding` in `AppRouter.jsx` but **do not** render it in the header nav; only serve as a fallback if JS fails. | Guarantees first‑time users see the flow immediately; eliminates an extra navigation step that could be missed. |
| P0‑5 | **Rename `/workbook` → `/binder` and update all internal links**. | - `src/routes/AppRouter.jsx`: change `<Route path="/workbook" element={<Workbook />} />` to `/binder`.<br>- Update any `<Link to="/workbook">` or programmatic `navigate('/workbook')` to `/binder` (search repo for “/workbook”).<br>- Rename file if desired: `src/components/Workbook.jsx → src/components/Binder.jsx` (update import). | Aligns URL with terminology used in UI (“Academy/Binder”) and prevents 404s when users click the nav item. |
| P0‑6 | **Add missing save/load imports** to CharacterSheet (already fixed today – double‑check). | `src/components/CharacterSheet.jsx` – ensure `import { loadCharacter, saveCharacter } from '../utils/characterStorage';` exists and is used in the component’s `useEffect`. | Prevents runtime errors when users try to persist their character data. |
| P0‑7 | **Guard against hoisting bugs** in any file that still uses a function before its declaration (run ESLint `no-use-before-define`). | Run `npm run lint -- --fix` and verify no new errors. | Guarantees stable execution order; avoids undefined reference crashes. |

---  

## 2️⃣ SHOULD‑HAVE BEFORE BETA (P1) – UX / Learning Flow Improvements  

| # | Action | File(s) | Impact |
|---|--------|---------|--------|
| P1‑1 | **Extract LandingScreen inline styles to a CSS module** (or Tailwind‑like utility). | Create `src/components/LandingScreen.module.css`; move the entire `<style>` block there. Update `LandingScreen.jsx`:<br>```jsx\nimport styles from './LandingScreen.module.css';\n// replace className=\"...\" with className={styles....}\n``` | Improves maintainability, lets designers tweak without touching JSX, and reduces bundle parsing time. |
| P1‑2 | **Collapse redundant “Trinity Label” & Wordmark into a single header component**. | Create `src/components/LandingHeader.jsx` containing the wordmark + Trinity label; replace the two separate blocks in `LandingScreen.jsx` with `<LandingHeader />`. | Reduces visual clutter, speeds up first‑time scan to the CTA portals. |
| P1‑3 | **Show CoachingPortal toggle only after first lesson completion** (or as a small badge). | In `LandingScreen.jsx`, replace constant `showCoaching` state with:<br>```js\nconst [showCoaching, setShowCoaching] = useState(false);\n// after a lesson is marked complete (listen via context or Supabase)\nif (lessonsCompleted > 0) setShowCoaching(true);\n```<br>Render `<CoachingPortal isOpen={showCoaching} … />`. | Avoids presenting an unused UI element to newcomers while still making the feature discoverable later. |
| P1‑4 | **Unify data‑layer for PlayerPortal** – create a custom hook that wraps IndexedDB + Supabase sync. | Create `src/hooks/usePlayerData.js`:<br>```js\nimport { useEffect, useState } from 'react';\nimport { supabase } from '../supabaseClient';\nimport { openDB } from 'idb';\nexport const usePlayerData = (studentId) => {\n  const [recordings, setRecordings] = useState([]);\n  useEffect(() => {\n    const dbPromise = openDB('voixvive-db', 1, {\n      upgrade(db){ db.createObjectStore('recordings'); }\n    });\n    // … load from IDB, subscribe to Supabase changes, push updates both ways\n  }, [studentId]);\n  return { recordings, addRecording, deleteRecording };\n};\n```<br>Replace scattered `useEffect`s in `PlayerPortal.jsx` with `const { recordings, … } = usePlayerData(student.id);`. | Reduces duplicated sync logic, makes state consistent, and simplifies future offline‑first features. |
| P1‑5 | **Increase tab‑bar contrast & touch target size** for accessibility (WCAG AA). | In `src/components/PlayerPortal.jsx` (or its CSS):<br>```css\n.tab-bar button {\n  min-height: 44px; /* touch target */\n  color: var(--text-primary);\n}\n.tab-bar button[aria-selected=\"true\"] {\n  border-bottom: 3px solid var(--accent);\n  color: var(--accent);\n}\n``` | Makes the active tab clearer for low‑vision users and improves mobile usability. |
| P1‑6 | **Fix hero section cramp on narrow screens (<360 px)** – switch to column layout & increase vertical spacing. | In `PlayerPortal.jsx` or its CSS module:<br>```css\n@media (max-width: 359px) {\n  .hero-section { flex-direction: column; gap: 1.5rem; }\n  .hero-section h2 { font-size: 1.25rem; }\n}\n``` | Ensures readable headings and tappable icons on the smallest phones. |
| P1‑7 | **Add a lightweight skeleton loader** while recordings are being fetched from IndexedDB/Supabase. | In `PlayerPortal.jsx`:<br>```jsx\nif (!recordings.length && isLoading) return <SkeletonLoader count={3} />;\n```<br>(Create `src/components/SkeletonLoader.jsx` using Framer Motion or simple CSS animation.) | Gives users immediate feedback that data is loading, reducing perceived latency. |
| P1‑8 | **Move `/studio` route to a redirect** (or fold its content into Player as a “Studio” tab). | In `AppRouter.jsx`:<br>```jsx\nimport { Navigate } from 'react-router-dom';\n<Route path=\"/studio\" element={<Navigate to=\"/player\" replace />} />\n```<br>Optionally add a `<Tab label=\"Studio\">` inside PlayerPortal’s tab bar if you want to keep the concept. | Eliminates duplicate navigation destination and simplifies the public surface to the 5 primary destinations defined in the route audit. |
| P1‑9 | **Add a fallback error boundary** that shows a friendly message and logs to Sentry (if configured). | Create `src/components/ErrorBoundary.jsx` (standard React error boundary) and wrap `<App>` in `main.jsx`. | Prevents whole‑app crash from bubbling up to a blank page; gives users a chance to retry or contact support. |

---  

## 3️⃣ NICE‑TO‑HAVE FOR BETA (P2) – Polish & Delight  

| # | Action | File(s) | Reason |
|---|--------|---------|--------|
| P2‑1 | **Add subtle Framer Motion entrance animations** to the three portal cards on LandingScreen. | In `LandingScreen.jsx` wrap each `<PortalCard>` with `<motion.div initial={{y:20, opacity:0}} animate={{y:0, opacity:1}} transition={{duration:0.4}}>`. | Polishes first‑impression; aligns with the existing `AnimatePresence` import that’s currently unused. |
| P2‑2 | **Implement a dark‑mode toggle** that persists user preference via localStorage and updates CSS variables. | Create `src/hooks/useTheme.js`; expose a button in the header (maybe next to locale switcher). | Gives power users control; matches modern web‑app expectations. |
| P2‑3 | **Show a “streak freeze” notification** when a user misses a day but has a streak‑protect token (if you plan to gamify later). | In `PlayerPortal.jsx` after computing `streak`, conditionally render a toast (`sonner` or custom). | Encourages habit formation without penalizing occasional lapses. |
| P2‑4 | **Add a “Download PDF” button** for each resource in `/binder/resources`. | In `src/components/BinderResources.jsx`: `<a href={resource.url} download>Download</a>`. | Makes offline study straightforward; aligns with the academy’s material‑centric vibe. |
| P2‑5 | **Localize static strings** (manifesto, portal labels) using the existing `useLocale` hook and move them to `src/locales/{en,fr}.json`. | Replace hard‑coded text in `LandingScreen.jsx`, `PlayerPortal.jsx`, etc., with `t('landing.manifesto.title')` via a small `useTranslation` wrapper. | Prepares the app for future language expansion; minimal effort now pays off later. |
| P2‑6 | **Add a “Report a bug” floating button** that opens a pre‑filled email to `support@voixvive.com`. | Create `src/components/FeedbackButton.jsx` using `<a href=\"mailto:support@voixvive.com?subject=Bug%20report&body=...\">`. | Empowers early users to surface issues quickly, improving beta quality. |

---  

## 4️⃣ POST‑BETA ROADMAP (Future Sprints)  

| Epic | Description | Target |
|------|-------------|--------|
| **Adaptive Learning Paths** | Use completion data + AI (Troubadour) to suggest next lesson based on somatic readiness scores. | Sprint 4 |
| **Community Jam Sessions** | Real‑time audio/video rooms powered by WebRTC; integrate with RIFT jam concept. | Sprint 5 |
| **Advanced Analytics Dashboard** | Mentor view of streak, practice time, submission trends (charts via Recharts or Vizzu). | Sprint 6 |
| **Offline‑First PWAs** | Register service worker, cache assets & lesson media for low‑connectivity environments. | Sprint 7 |
| **Accessibility Certification** | Full WCAG AA audit, keyboard navigation, screen‑reader labels, ARIA live regions. | Sprint 8 |

---  

## 5️⃣ RESPONSIBILITY MATRIX  

| Role | Items (by priority) |
|------|---------------------|
| **Joshua (Lead Developer)** | P0‑1 … P0‑7, P1‑1, P1‑3, P1‑4, P1‑5, P1‑6, P1‑7, P1‑8, P1‑9, P2‑1, P2‑2 |
| **Bertrand (Content & Pedagogy Lead)** | Verify that all lesson metadata (`song/:slug` data) is correct; approve onboarding modal copy; review manifesto & portal wording; ensure PDF resources are correctly linked in `/biner/resources`. Provide any new somatic prompts for `SomaticStudioPrompter.jsx` if they evolve. |
| **AI Agents (Automated)** | - Run `npm run lint -- --fix` and `npm test` on each commit.<br>- Generate a changelog from conventional commits (`standard-version`).<br>- Optimize bundle with `vite build --mode production` and report size; fail CI if > 2.5 MB gzipped.<br>- Deploy preview URLs on each PR (Vercel/Netlify) for QA. |

---  

## 6️⃣ DEPLOYMENT CHECKLIST – ENV VARS, SECRETS & DOMAINS  

| Item | Value / Example | Where to set | Verification step |
|------|-----------------|--------------|--------------------|
| `VITE_SUPABASE_URL` | `https://xyzcompany.supabase.co` | `.env.production` (never commit) | `curl $VITE_SUPABASE_URL/rest/v1/` → 200 |
| `VITE_SUPABASE_ANON_KEY` | `public‑anon‑key…` | Same as above | Try a sign‑up request via Supabase JS client in console; expect 200/400 (not network error). |
| `SERVICE_ROLE_KEY` *(only needed for server‑side scripts)* | `service_role…` | `.env` (server) – **never** expose to client. | Run a node script that reads Supabase admin API; confirm 200. |
| `LM_STUDIO_ENDPOINT` *(if using local LLM via LM Studio)* | `http://127.0.0.1:1234/v1` | `.env` (optional) – only needed for AI‑agent scripts. | Ping endpoint; expect JSON response with `"models"` array. |
| **Domain** | `beta.voixvive.com` (CNAME → Vercel/Netlify) | Provider DNS settings | `dig beta.voixvive.com +short` returns the CDN IP; SSL cert issued (Let’s Encrypt). |
| **Redirect URLs for Supabase Auth** | `https://beta.voixvive.com/auth/callback` | Supabase Dashboard → Authentication → URL Configuration | Test login flow: after confirming email, you land back on `/`. |
| **Google / Apple OAuth (if added later)** | Same pattern as above – add to provider list. | Same as above. | N/A for beta (email/password only). |
| **Feature flags** (e.g., `VITE_ENABLE_AI_TUTOR`) | `false` for beta | `.env.production` | Confirm UI does not show AI‑tutor button when flag false. |

*Run the deployment script:*  

```bash
# 1️⃣ Build
npm run build   # outputs to dist/
# 2️⃣ Preview locally
npm run preview # serves dist on localhost:4173 – spot‑check env var usage
# 3️⃣ Deploy (example for Vercel)
vercel --prod --token $VERCEL_TOKEN
```

After deploy, hit `https://beta.voixvive.com` and verify:

- No console errors related to missing env vars.  
- LandingScreen loads three portal cards.  
- Clicking “Song” → `/song` shows lesson hub; clicking a lesson navigates to `/song/:slug`.  
- Onboarding modal appears for first‑time visitors (check localStorage `voixvive:onboarded`).  

---  

## 7️⃣ BETA USER COMMUNICATION – EMAIL TO FIRST 10 STUDENTS  

**Subject:** Welcome to Voix Vive – Your First Guitar Journey Starts Today 🎸  

**Body (Markdown‑friendly, copy‑paste into your mail tool):**  

```markdown
Hi {{first_name}},

Welcome aboard! You’re among the very first students to experience **Voix Vive**, Maestro Bertrand Laurence’s somatic‑first guitar academy.

### What to do next
1. **Check your inbox** for a temporary password (or use the magic link we just sent).  
2. **Log in** at https://beta.voixvive.com – you’ll be taken straight to the **Onboarding modal**.  
3. Follow the three quick steps: set your practice goal, choose a starter song, and enable microphone access for the somatic check‑in.  

### First lesson recommendation
- Start with **“Open Chords & Breath”** (found under **Song → Beginner → Lesson 1**).  
- Record a short video using the **Player → Record for Bertrand** button – Maestro will review it personally within 48 h.

### Need help?
- Reply to this email or ping us in the in‑app **Help** bubble (bottom‑right).  
- For urgent issues, contact Bertrand directly at bertrand@voixvive.com.

We’re excited to hear your first recordings and see how the body‑aware approach transforms your playing. Keep an eye out for weekly practice tips and community jam invites coming soon!

Rock on,  
The Voix Vive Team  
```

*Placeholders:* `{{first_name}}` – replace with merge field from your mailing list (e.g., Mailchimp `|FNAME|`).  

---  

## 8️⃣ SUCCESS METRICS – HOW TO KNOW THE BETA IS WORKING  

| Metric | Target (Beta) | How to measure |
|--------|----------------|----------------|
| **Activation Rate** (% of sign‑ups who complete at least one lesson) | ≥ 70 % | Supabase `lessons_completed` count > 0 per user. |
| **Time‑to‑First‑Recording** (minutes from login to first submission) | ≤ 15 min | Log `first_recording_at - signup_at` in analytics. |
| **Average Session Length** | ≥ 12 min | Sum of `session_end – session_start` per user, averaged over beta week. |
| **Day‑1 Retention** (users returning next day) | ≥ 50 % | Cohort analysis on `last_seen_at`. |
| **Day‑7 Retention** | ≥ 30 % | Same as above, 7‑day window. |
| **Net Promoter Score (NPS)** after first week | ≥ 40 | In‑app survey: “On a scale of 0‑10, how likely are you to recommend Voix Vive?” |
| **Error Rate** (uncaught exceptions captured by Sentry) | < 2 % of sessions | Sentry → `sessions_with_error / total_sessions`. |
| **AI‑Agent Usage** (if Troubadour widget enabled for power users) | ≥ 10 % of active users interact | Event `troubadour_query` count. |

Set up a simple dashboard (Supabase Metrics or Mixpanel) to track these numbers daily; flag any metric falling below threshold for immediate triage.

---  

**End of checklist.** All items are concrete, file‑specific, and ready to be tackled before the public beta launch. Good luck! 🎶