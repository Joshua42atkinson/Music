---
title: 15_data_model_audit
status: archive
tags: []
date: 2026-06-14
---
# Voix Vive Data Model and Supabase Schema Audit

## 1. Existing Supabase Tables/Collections

Based on code analysis, the following tables exist in Supabase:

| Table Name | Purpose | Key Columns |
|------------|---------|-------------|
| `profiles` | User profile summary (bard level, streak, etc.) | `id` (user UUID), `bard_level`, `practice_minutes`, `streak`, `traction_data` (JSONB) |
| `traction` | Per-fret progress tracking | `user_id`, `fret_id` (1-12), `traction_pct` (0-100), `attempts`, `completed` (boolean) |
| `journal_entries` | Student journal reflections | `user_id`, `fret_id` (nullable), `content`, `mood`, `entry_type`, `created_at` |
| `student_profiles` | Links user ID to submission metadata | `id`, `user_id` (foreign key to auth.users) |
| `submissions` | R2 submission metadata (practice videos) | `user_id`, `student_profile_id`, `exercise_name`, `video_url`, `duration`, `reviewed` |
| `video_submissions` | Async review queue for mentor feedback | `user_id`, `video_url`, `duration`, `reviewed` (boolean), `created_at` |
| `text_back_requests** | Paid quick-text requests ($5) | `user_id`, `question`, `status` ('pending'), `price_cents` (500), `created_at` |

*Note: Supabase Auth manages `auth.users` for authentication (email, encrypted password).*

## 2. LocalStorage vs Cloud Data Storage

### **LocalStorage** (`localStorage`)
- `voixvive_traction`: Full traction state object (fret progress, nodes, mastery levels)
- `voixvive_journal`: Array of journal entry objects
- `voixvive_practice_log`: Array of practice session logs
- `voixvive_migrated_v1`: Migration flag (`'true'` when local data synced to Supabase)

### **Cloud** (Supabase)
- **Summary data**: `profiles` table (bard_level, streak, etc.)
- **Granular progress**: `traction` table (per-fret traction_pct, attempts)
- **Journaling**: `journal_entries` table
- **Submissions**: 
  - `submissions` (R2 video metadata)
  - `video_submissions` (async review queue)
  - `text_back_requests`
- **Redundant backup**: `profiles.traction_data` JSONB stores full traction state (migration artifact)

### Key Separation
- **Local-first**: Core progress data lives in LocalStorage for offline operation
- **Cloud sync**: Supabase stores normalized, queryable data for backup and cross-device sync
- **Migration**: On first login, local data migrates to Supabase via `dataMigration.js`

## 3. Scalability of Traction/Fret Data Model

**Yes, scalable to 1,000+ students.**  
- Current schema: `traction` table has `(user_id, fret_id)` composite key
- For 1,000 students × 12 frets = **12,000 rows**
- Each row: ~200 bytes → **~2.4 MB total** (negligible for modern databases)
- Indexes on `user_id` and `fret_id` ensure O(log n) query performance
- Write frequency: Low (only when student completes phases/gates)

*Optimization note:* Consider adding `updated_at` timestamp for conflict resolution in multi-device scenarios.

## 4. Missing Data for Complete Student Profile

The current `profiles` table lacks critical identity and preference data:

| Missing Category | Specific Fields | Recommended Solution |
|------------------|-----------------|----------------------|
| **Identity** | `full_name`, `preferred_name`, `date_of_birth` (for age-gated content) | Add to `profiles` table |
| **Preferences** | `kid_mode` (boolean), `troubadour_type_override` (string: 'storyteller'\|'craftsman'), `commitment_tier` ('Gentle'\|'Intensive'), `notification_preferences` (JSONB) | Add to `profiles` or new `user_settings` table |
| **Practice Garden** | `garden_state` (JSONB: trees, nightGateTime, etc.) - used in `calendarService.js` | Store in `profiles.practice_garden` (JSONB) |
| **Subscription** | `subscription_tier` ('free'\|'premium'), `subscription_expires_at`, `payment_provider_id` | Add to `profiles` or new `subscriptions` table |
| **Social** | `privacy_level` ('public'\|'friends'\|'private'), `share_progress` (boolean) | Add to `profiles` |

*Current gap:* Personalization data (kid mode, troubadour type) is only tested in prompts but not persisted.

## 5. GDPR/Privacy Compliance

### **Personal Data Stored**
| Data Type | Location | Sensitivity |
|-----------|----------|-------------|
| Email | `auth.users` (Supabase Auth) | High (PII) |
| Name | *Not currently stored* → **Gap** | Medium |
| Journal content | `journal_entries.content` | High (personal reflections) |
| Practice videos | R2/Google Drive URLs in `submissions`/`video_submissions` | High (biometric data: voice, face) |
| Text-back questions | `text_back_requests.question` | Medium (could contain sensitive queries) |

### **Protection Measures**
- ✅ **Encryption at rest**: Supabase uses AES-256 for database/storage
- ✅ **TLS in transit**: All API/WebSocket connections use HTTPS/WSS
- ✅ **Access controls**: Row Level Security (RLS) policies implied but *not visible in code* → **Critical gap**
- ⚠️ **Data retention**: No automated deletion mechanism for GDPR right to erasure
- ⚠️ **Consent tracking**: No explicit consent logging for data processing

### **Required Actions**
1. Implement RLS policies:
   - `profiles`: Users can only read/update own row
   - `traction`/`journal_entries`: Users can only access own `user_id`
   - `submissions`: Students own submissions; mentor (fixed ID) can read all
2. Add GDPR endpoints:
   - `/api/gdpr/export`: JSON export of all user data
   - `/api/gdpr/delete`: Anonymize/delete personal data on request
3. Store consent timestamps in `profiles` for processing activities

## 6. Offline-First Capability Analysis

### **Works Without Internet**
| Feature | Status | Reason |
|---------|--------|--------|
| Core progress (traction, journal) | ✅ Fully functional | Lives in LocalStorage |
| UI rendering & navigation | ✅ Functional | No network dependencies |
| Local LM Studio text generation | ⚠️ Conditional | Requires pre-loaded model; works if LM Studio running locally |
| Somatic gate/phase completion | ✅ Functional | State updates in LocalStorage |

### **Breaks Without Internet**
| Feature | Failure Point | Impact |
|---------|---------------|--------|
| Supabase sync | Network calls to `supabase.js` | Progress not backed up; cross-device sync fails |
| Google Calendar/Drive | OAuth/API calls in `calendarService.js`/`driveService.js` | Cannot schedule reviews or save videos |
| Audio streaming service | WebSocket to StepAudio middleware/LM Studio DaaS | Voice interaction fails (text-only LMStudio fallback may work if local) |
| LLM quality scoring | Depends on network for some test suites? | Automated regression tests fail offline |

### **Critical Gap**
- No explicit offline queue for Supabase mutations → Local changes lost if app cleared before reconnect
- *Solution:* Implement IndexedDB outbox (like R2Service) for Supabase writes using `@supabase/realtime` or custom sync engine

## 7. .voixvive Save File Format Schema

The `voixvive_traction` LocalStorage object stores the complete traction state:

```json
{
  "frets": {
    "<fretId: 1-12>": {
      "id": <number>,
      "traction": <number 0-100>,
      "pitchAccuracy": <number 0-100?>,
      "tensionScore": <number 0-100?>,
      "beCompleted": <boolean>,
      "doCompleted": <boolean>,
      "playCompleted": <boolean>,
      "beMastery": <number 0-3>, // 0=Encountered,1=Experienced,2=Owned,3=Mastered
      "doMastery": <number 0-3>,
      "playMastery": <number 0-3>,
      "beAttempts": <number>,
      "doAttempts": <number>,
      "playAttempts": <number>,
      "beGatePassed": <boolean>,
      "doGatePassed": <boolean>,
      "playGatePassed": <boolean?>,
      "depthExplored": <boolean>,
      "beResonance": <boolean>,
      // ... (do/play resonance implied)
      "exercisesCompleted": [<string: exerciseId>],
      // Possibly: settingsOverride (kidMode, troubadourType)
    }
  },
  "completedNodes": [<string: nodeId e.g. "fret-1-class-be">],
  "totalTraction": <number>, // Sum of fret.traction? or overall progress metric
  "bardLevel": <number 1-12>,
  "streak": <number>, // Consecutive practice days
  "practiceMinutes": <number>, // Lifetime practice time
  "xp": <number>, // Experience points (from merge test)
  // Possibly: 
  //   "settings": { kidMode: boolean, troubadourTypeOverride: string }
}
```

*Validation:* Schema matches usage in `tractionStore.js` tests and migration logic.

## 8. Recommended Analytics/Events for Beta Launch

Track these events via analytics service (e.g., PostHog, Mixpanel, or Supabase edge functions):

| Event Name | Trigger | Properties | Purpose |
|------------|---------|------------|---------|
| `onboarding_complete` | After initial setup | `referral_source`, `commitment_tier_selected` | Measure activation funnel |
| `phase_completed` | Student marks BE/DO/PLAY complete | `fret_id`, `phase`, `mastery_before`, `mastery_after`, `traction_delta` | Track learning velocity |
| `somatic_gate_passed` | Gate passed via breath/body awareness | `fret_id`, `gate_type` (be/do/play), `biometric_data_available?` | Validate somatic pedagogy efficacy |
| `resonance_unlocked` | Resonance triggered (2+ attempts + Owned mastery) | `fret_id`, `phase`, `attempt_count` | Measure engagement depth |
| `journal_entry_created` | New journal saved | `fret_id`, `word_count`, `mood_tags?` | Assess reflective practice adoption |
| `practice_log_entry` | Practice session logged | `duration_minutes`, `focus_areas[]`, `kid_mode_active` | Quantify practice habits |
| `submission_created` | Video submitted for review | `fret_id`, `exercise_name`, `duration_s`, `video_has_audio` | Monitor async coaching pipeline |
| `text_back_requested** | Paid text-back requested | `question_length`, `topic_category[]` | Track monetization behavior |
| `settings_toggled` | User changes preference | `setting_name` (kidMode/troubadourType), `new_value` | Understand personalization impact |
| `ai_interaction_complete** | LLM response generated | `mode` (troubadour/chat), `fret_id`, `phase`, `scoring_dimensions[]` (from llmTestSuite), `response_latency_ms` | Validate AI quality & performance |

*Critical:* Correlate `somatic_gate_passed` and `resonance_unlocked` with long-term retention to validate pedagogical hypothesis.

## 9. Supabase Schema Additions

### A. RIFT Community Posts
```sql
-- Core posts table
CREATE TABLE community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  post_type TEXT CHECK (post_type IN ('practice_share', 'question', 'milestone', 'general')) DEFAULT 'general',
  media_urls TEXT[], -- Array of R2/CDN URLs for attached media
  visibility TEXT CHECK (visibility IN ('public', 'followers', 'private')) DEFAULT 'followers',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Comments on posts
CREATE TABLE community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Reactions (likes, etc.)
CREATE TABLE community_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  reaction_type TEXT CHECK (reaction_type IN ('like', 'celebrate', 'support', 'curious')) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(post_id, user_id, reaction_type)
);

-- Indexes for performance
CREATE INDEX idx_community_posts_user ON community_posts(user_id);
CREATE INDEX idx_community_posts_visibility ON community_posts(visibility);
```

### B. Mentor Feedback/Submissions
```sql
-- Extend existing video_submissions table
ALTER TABLE video_submissions 
ADD COLUMN IF NOT EXISTS feedback_text TEXT,
ADD COLUMN IF NOT EXISTS feedback_video_url TEXT, -- R2 URL for mentor's video response
ADD COLUMN IF NOT EXISTS reviewed_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS reviewer_id UUID REFERENCES auth.users(id); -- Fixed to Bertrand's ID

-- Alternative: Separate feedback table (if complex feedback needed)
CREATE TABLE submission_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  submission_id UUID REFERENCES video_submissions(id) ON DELETE CASCADE NOT NULL,
  reviewer_id UUID REFERENCES auth.users(id) NOT NULL,
  feedback_text TEXT NOT NULL,
  feedback_media_url TEXT, -- For audio/video feedback
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### C. Cohort/Class Scheduling
```sql
-- Cohorts (groups of students)
CREATE TABLE cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  max_students INTEGER CHECK (max_students > 0),
  mentor_id UUID REFERENCES auth.users(id) DEFAULT 'fixed-bertrand-uuid', -- Hardcoded to Bertrand
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Class sessions within cohorts
CREATE TABLE class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  meeting_url TEXT, -- For virtual sessions (Zoom/etc.)
  location_text TEXT, -- For in-person
  recurrence_rule TEXT, -- iCal RRULE string (e.g., "FREQ=WEEKLY;BYDAY=MO")
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment junction table
CREATE TABLE cohort_enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID REFERENCES cohorts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  role TEXT CHECK (role IN ('student', 'mentor', 'assistant')) DEFAULT 'student',
  status TEXT CHECK (status IN ('active', 'completed', 'dropped', 'paused')) DEFAULT 'active',
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(cohort_id, user_id)
);

-- Attendance tracking
CREATE TABLE session_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES class_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  attended BOOLEAN NOT NULL,
  join_time TIMESTAMPTZ,
  leave_time TIMESTAMPTZ,
  UNIQUE(session_id, user_id)
);

-- Indexes
CREATE INDEX idx_class_sessions_cohort ON class_sessions(cohort_id);
CREATE INDEX idx_class_sessions_time ON class_sessions(starts_at, ends_at);
CREATE INDEX idx_cohort_enrollments_user ON cohort_enrollments(user_id);
```

### Implementation Notes
1. **RLS Policies**: Essential for all new tables (e.g., users can only see their own posts unless `visibility='public'`)
2. **Mentor ID**: Use a fixed UUID for Bertrand (from Supabase Auth) or create a service role
3. **Media Storage**: Store actual files in R2/Google Drive; DB only stores URLs
4. **Migration**: Backfill existing data with default values where applicable

This schema supports:
- Asynchronous community interaction (RIFT)
- Structured mentor feedback loop
- Scalable cohort management with attendance tracking
- GDPR-compliant data isolation via RLS policies