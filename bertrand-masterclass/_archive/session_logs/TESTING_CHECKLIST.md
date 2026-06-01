# Testing Checklist — Voix Vive Phase 2
## Google Drive Integration + Structured Practice Recorder

> **Last Updated:** 2026-05-27
> **Branch:** main
> **Commit:** 9adac4d

---

## ⚠️ Prerequisites for Testing

1. **Vercel env vars must include:**
   ```
   VITE_MENTOR_EMAIL=joshua42atkinson@gmail.com
   VITE_MENTOR_CALENDAR_ID=primary
   ```

2. **Supabase schema must be deployed:** `video_submissions`, `drive_config`, `mentor_availability`, `text_back_requests` tables

3. **Google OAuth must include scopes:** `openid`, `email`, `profile`, `drive.file`

4. **Browser:** Chrome/Edge recommended (best MediaRecorder + Google OAuth support)

---

## ✅ Phase 1: Auth & Progress (Already Tested)

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 1.1 | Landing page loads | Visit `/` | 4 portals shown, wordmark visible | ✅ |
| 1.2 | Google sign-in | Click "Sign In" → Choose Google account | Redirects to `/auth/callback` then `/song` | ✅ |
| 1.3 | Progress saves | Complete a fret → Refresh → Revisit `/guitar` | Fret shows as explored | ✅ |
| 1.4 | Journal sync | Write journal entry while logged in → Check Supabase | Entry appears in `journal_entries` table | ✅ |
| 1.5 | Anonymous fallback | Write journal while NOT logged in → Sign in | Local data preserved, new entries sync to cloud | ✅ |

---

## 🔧 Phase 2: Google Drive Integration (TEST NOW)

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 2.1 | **Re-authenticate for Drive scope** | Sign out → Sign in with Google | Consent screen mentions "Create and manage files in your Google Drive" | ⬜ |
| 2.2 | **Drive folder created** | Go to `/playbook` → Journal tab → Record video → Save | "Voix Vive Submissions" folder appears in your Google Drive | ⬜ |
| 2.3 | **Folder auto-shared** | Check folder sharing settings | `joshua42atkinson@gmail.com` has access | ⬜ |
| 2.4 | **Video upload to Drive** | Record 10-second test video → Upload | Video appears in Drive folder, webM format | ⬜ |
| 2.5 | **Supabase metadata** | Check `video_submissions` table in Supabase | Row with `drive_file_id`, `web_view_link`, `user_id` | ⬜ |
| 2.6 | **Mentor can view** | As mentor, visit `/mentor` | Submission appears in review queue | ⬜ |
| 2.7 | **Mentor marks reviewed** | Click "Mark Reviewed" with notes | Status changes to reviewed, notes saved | ⬜ |

---

## 🎯 Phase 2: Structured Practice Recorder (TEST NOW)

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 3.1 | **Intro screen** | Visit `/player` → "Start Guided Session" | 5 phases listed with durations | ⬜ |
| 3.2 | **Camera starts** | Click "Begin Session" | Camera preview appears, recording starts automatically | ⬜ |
| 3.3 | **Breathing Gate** | Wait 2 minutes | Breath circle animates, prompts rotate, timer counts down | ⬜ |
| 3.4 | **Phase auto-advance** | Wait for phase to end | Next phase starts automatically, dot indicators update | ⬜ |
| 3.5 | **All phases complete** | Wait full 14.5 minutes | Emotional state capture screen appears | ⬜ |
| 3.6 | **End early** | Click "End Session Early" | Recording stops, emotional input screen appears | ⬜ |
| 3.7 | **Emotional state** | Type "I feel calm and focused" → Save | Uploads to Drive, metadata saved with emotional_state | ⬜ |
| 3.8 | **Mobile test** | Repeat on phone with guitar | Layout fits phone screen, camera selfie mode works | ⬜ |

---

## 📅 Phase 2: Calendar & Scheduling (TEST AFTER DRIVE)

| # | Test | Steps | Expected | Status |
|---|------|-------|----------|--------|
| 4.1 | **Workload banner** | Visit `/player` when logged in | Banner shows Bertrand's current workload status | ⬜ |
| 4.2 | **Queue full** | Create 10+ fake submissions in Supabase | Banner turns red, "Queue full" message, text-back option shown | ⬜ |
| 4.3 | **Mentor dashboard workload** | Visit `/mentor` | Workload bar shows pending count, color changes at threshold | ⬜ |
| 4.4 | **Calendar free/busy** | Call `getAvailableSlots()` in console | Returns array of available 30-min slots | ⬜ |
| 4.5 | **Book slot** | Call `bookReviewSlot()` with test data | Calendar event created in mentor's calendar | ⬜ |

---

## 🐛 Known Issues & Workarounds

| Issue | Impact | Workaround | Fix Planned |
|-------|--------|-----------|-------------|
| Auth callback always redirects to `/song` | Medium | Student manually navigates to `/player` | Save `returnTo` before sign-in |
| PlayerPortal shows only local submissions | Medium | Doesn't show cross-device uploads | Query Supabase `video_submissions` |
| Text-back UI not built | Low | No student-facing form yet | Build form in PlayerPortal |
| Calendar booking UI not built | Low | No slot picker for students | Build slot picker |
| Mentor response recording not built | Medium | Bertrand can't record video response over student video | Add screen recorder overlay |

---

## 🔄 After Testing — Commit Checklist

- [ ] All tests above pass OR issues documented in this file
- [ ] `npm run build` passes with no errors
- [ ] No console errors on key pages (`/`, `/player`, `/mentor`, `/playbook`)
- [ ] This document updated with actual test results
- [ ] Maturation map updated with any scope changes

---

## 📝 How to Report a Bug

When you find an issue, document it here:

```
**Test #:** (e.g., 2.3)
**Browser:** Chrome 125 / iPhone Safari / etc
**Steps:** What you did
**Expected:** What should have happened
**Actual:** What actually happened
**Console errors:** (copy from DevTools)
```
