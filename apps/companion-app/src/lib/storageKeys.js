// ═══════════════════════════════════════════════════════════
// STORAGE KEYS — Single source of truth for all localStorage keys
// Normalized to `vv_` prefix. Legacy aliases listed for migration.
// ═══════════════════════════════════════════════════════════

export const STORAGE_KEYS = {
  // ── Core app state ──
  ONBOARDED:          'vv_onboarded',          // was: voixvive_onboarded
  TRACTION:           'vv_traction',           // was: voixvive_traction, bard_traction
  LOCALE:             'vv_locale',             // was: voixvive_locale
  PLAYER_STATE:       'vv_player_state',       // was: voixvive_player_state
  STARTING_FRET:      'vv_starting_fret',      // was: voixvive_starting_fret

  // ── Progress & curriculum ──
  DAG_PROGRESS:       'vv_dag_progress',       // was: voix_vive_dag_progress
  CURRENT_FRET:       'vv_current_fret',       // was: voixvive_current_fret
  CSCALE_COMPLETED:   'vv_cscale_completed',   // was: voixvive_cscale_completed
  CSCALE_DISMISSED:   'vv_cscale_dismissed',   // was: voixvive_cscale_dismissed

  // ── Practice & streaks ──
  LAST_PRACTICE:      'vv_last_practice',      // was: voixvive_last_practice
  LAST_TOOL_FRET:     'vv_last_tool_fret',     // was: voixvive_last_tool_fret
  PRACTICE_LOG:       'vv_practice_log',       // was: voixvive_practice_log
  STREAK:             'vv_streak',             // was: voixvive_streak
  HABITS:             'vv_habits',             // was: bertrand_habits

  // ── AI & voice ──
  VOICE_PREFS:        'vv_voice_prefs',        // was: voixvive_voice_prefs
  VOICE_ID:           'vv_voice_id',             // was: voixvive_voice_id
  TTS_SPEED:          'vv_tts_speed',          // was: voixvive_tts_speed

  // ── Wllama cache ──
  WLLAMA_CACHED:      'vv_wllama_cached',      // was: vv_wllama_cached (already vv_)
  WLLAMA_RETRIES:     'vv_wllama_retries',     // was: vv_wllama_retries (already vv_)

  // ── Adventure & game ──
  ADVENTURE_SESSION:  'vv_adventure_session',  // was: voix_vive_adventure_session
  SWIPE_HINT_SEEN:    'vv_swipe_hint_seen',    // was: voix_vive_swipe_hint_seen
  MIGRATED_V1:        'vv_migrated_v1',        // was: voixvive_migrated_v1
  MOCK_STUDENT:       'vv_mock_student',       // was: voixvive_mock_student

  // ── Content ──
  JOURNAL:            'vv_journal',            // was: voixvive_journal, voixvive_journals
  SUBMISSIONS:        'vv_submissions',        // was: voixvive_submissions

  // ── Misc ──
  BETA_UNLOCKED:      'vv_beta_unlocked',      // was: voixvive_beta_unlocked
  ARCHETYPE:          'vv_archetype',          // was: voixvive_archetype
  ACTIVE_PROFILE:     'vv_active_profile',     // was: active_student_profile
  PROFILE_PHOTO:      'vv_profile_photo',      // already vv_ prefixed

  // ── C-Scale ──
  CSCALE_JOURNEY_PROGRESS: 'vv_cscale_journey_progress', // was: voixvive_cscale_journey_progress

  // ── Truebadour inbox ──
  TRUEBADOUR_INBOX:   'vv_truebadour_inbox',   // was: voix_vive_truebadour_inbox

  // ── Feedback ──
  BETA_FEEDBACK:      'vv_beta_feedback',      // was: voixvive_beta_feedback

  // ── RAG / curriculum indexing ──
  RAG_VERSION:        'vv_rag_version',        // was: voixvive_rag_version

  // ── Prompt versioning ──
  PROMPT_VERSIONS:    'vv_prompt_versions',    // was: voixvive_prompt_versions
  PROMPT_RESULTS:     'vv_prompt_results',     // was: voixvive_prompt_results

  // ── Google auth & cloud sync ──
  GOOGLE_TOKEN:       'vv_google_token',       // access token + expiry
  GOOGLE_USER:        'vv_google_user',        // profile cache
  CLOUD_ENABLED:      'vv_cloud_enabled',      // user opted into cloud sync
  SUBSCRIPTION_TIER:  'vv_subscription_tier',  // current subscription level (free/community/apprentice/journeyman/master)
  EMAIL_CAPTURE:      'vv_email_capture',      // launch notification sign-up
  CLOUD_SYNC:         'vv_cloud_sync',         // was: voixvive_cloud_sync
  USE_CLOUD_AI:       'vv_use_cloud_ai',       // was: voixvive_use_cloud_ai

  // ── Slide positions (per-fret, dynamic) ──
  // Pattern: vv_slide_{fretId} — was: voixvive-slide-{fretId}
};

// Legacy → current key map for one-time migration
export const LEGACY_KEY_MAP = {
  voixvive_onboarded:          STORAGE_KEYS.ONBOARDED,
  voixvive_traction:           STORAGE_KEYS.TRACTION,
  bard_traction:               STORAGE_KEYS.TRACTION,
  voixvive_locale:             STORAGE_KEYS.LOCALE,
  voixvive_starting_fret:      STORAGE_KEYS.STARTING_FRET,
  voixvive_player_state:       STORAGE_KEYS.PLAYER_STATE,
  voix_vive_dag_progress:      STORAGE_KEYS.DAG_PROGRESS,
  voixvive_current_fret:       STORAGE_KEYS.CURRENT_FRET,
  voixvive_cscale_completed:   STORAGE_KEYS.CSCALE_COMPLETED,
  voixvive_cscale_dismissed:   STORAGE_KEYS.CSCALE_DISMISSED,
  voixvive_cscale_journey_progress: STORAGE_KEYS.CSCALE_JOURNEY_PROGRESS,
  voix_vive_truebadour_inbox:  STORAGE_KEYS.TRUEBADOUR_INBOX,
  voixvive_migrated_v1:        STORAGE_KEYS.MIGRATED_V1,
  voixvive_beta_feedback:      STORAGE_KEYS.BETA_FEEDBACK,
  voixvive_rag_version:        STORAGE_KEYS.RAG_VERSION,
  voixvive_prompt_versions:    STORAGE_KEYS.PROMPT_VERSIONS,
  voixvive_prompt_results:     STORAGE_KEYS.PROMPT_RESULTS,
  voixvive_last_practice:      STORAGE_KEYS.LAST_PRACTICE,
  voixvive_last_tool_fret:     STORAGE_KEYS.LAST_TOOL_FRET,
  voixvive_practice_log:       STORAGE_KEYS.PRACTICE_LOG,
  voixvive_streak:             STORAGE_KEYS.STREAK,
  bertrand_habits:             STORAGE_KEYS.HABITS,
  voixvive_voice_prefs:        STORAGE_KEYS.VOICE_PREFS,
  voixvive_voice_id:           STORAGE_KEYS.VOICE_ID,
  voixvive_tts_speed:          STORAGE_KEYS.TTS_SPEED,
  voix_vive_adventure_session: STORAGE_KEYS.ADVENTURE_SESSION,
  voix_vive_swipe_hint_seen:   STORAGE_KEYS.SWIPE_HINT_SEEN,
  voixvive_mock_student:       STORAGE_KEYS.MOCK_STUDENT,
  voixvive_journal:            STORAGE_KEYS.JOURNAL,
  voixvive_journals:           STORAGE_KEYS.JOURNAL,
  voixvive_submissions:        STORAGE_KEYS.SUBMISSIONS,
  voixvive_beta_unlocked:      STORAGE_KEYS.BETA_UNLOCKED,
  voixvive_archetype:          STORAGE_KEYS.ARCHETYPE,
  active_student_profile:      STORAGE_KEYS.ACTIVE_PROFILE,
  voixvive_cloud_sync:         STORAGE_KEYS.CLOUD_SYNC,
  voixvive_use_cloud_ai:       STORAGE_KEYS.USE_CLOUD_AI,
};
