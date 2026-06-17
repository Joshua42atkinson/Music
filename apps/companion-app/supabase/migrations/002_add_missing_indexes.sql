-- ═══════════════════════════════════════════════════════════
-- Migration 002: Add missing indexes and mentor_video_link column
-- Created: 2026-06-03
-- ═══════════════════════════════════════════════════════════

-- Missing index: student_profiles queried by user_id
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id
  ON public.student_profiles(user_id);

-- Missing index: video_submissions filtered by reviewed status
CREATE INDEX IF NOT EXISTS idx_video_submissions_reviewed
  ON public.video_submissions(reviewed, created_at DESC);

-- Missing index: text_back_requests filtered by status
CREATE INDEX IF NOT EXISTS idx_text_back_requests_status
  ON public.text_back_requests(status, created_at DESC);

-- Missing index: mentor_availability queried by slot_start
CREATE INDEX IF NOT EXISTS idx_mentor_availability_slot_start
  ON public.mentor_availability(slot_start, is_booked);

-- Missing column: mentor_video_link referenced in driveService.js markReviewed()
ALTER TABLE public.video_submissions
  ADD COLUMN IF NOT EXISTS mentor_video_link TEXT;

-- Admin UPDATE policy for video_submissions (needed for mentor review workflow)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Admin can update video submissions'
  ) THEN
    CREATE POLICY "Admin can update video submissions"
      ON public.video_submissions FOR UPDATE
      USING (auth.uid() IN (
        SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
      ));
  END IF;
END
$$;
