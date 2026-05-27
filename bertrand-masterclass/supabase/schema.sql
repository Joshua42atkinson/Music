-- ═══════════════════════════════════════════════════════════
-- VOIX VIVE — Supabase Schema
-- Run this in Supabase SQL Editor after project creation.
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- PROFILES (extends auth.users)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  instrument TEXT DEFAULT 'guitar',
  traction_data JSONB DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ═══════════════════════════════════════════════════════════
-- STUDENT PROFILES (Bertrand's teaching records)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.student_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  current_chapter INTEGER DEFAULT 1,
  bard_level TEXT DEFAULT 'seeker',
  coaching_tier TEXT DEFAULT 'free',
  florins INTEGER DEFAULT 0,
  xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own student profiles"
  ON public.student_profiles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own student profiles"
  ON public.student_profiles FOR ALL
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- PROGRESS (fret completion tracking)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  fret_id INTEGER NOT NULL CHECK (fret_id BETWEEN 1 AND 12),
  slide_index INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  time_spent_seconds INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, fret_id, slide_index)
);

ALTER TABLE public.progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own progress"
  ON public.progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own progress"
  ON public.progress FOR ALL
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- SUBMISSIONS (async video submissions to Bertrand)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  exercise_name TEXT,
  video_url TEXT,
  duration INTEGER,
  feedback TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can create own submissions"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Bertrand (admin) can view all submissions
CREATE POLICY "Admin can view all submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

-- ═══════════════════════════════════════════════════════════
-- VIDEO SUBMISSIONS (Google Drive metadata index)
-- Videos live in student Google Drive. Supabase stores only IDs.
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.video_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  drive_file_id TEXT NOT NULL,
  drive_folder_id TEXT,
  file_name TEXT,
  web_view_link TEXT,
  fret_id INTEGER CHECK (fret_id BETWEEN 1 AND 12),
  entry_type TEXT DEFAULT 'practice',
  emotional_state TEXT,
  reviewed BOOLEAN DEFAULT FALSE,
  mentor_notes TEXT,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.video_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own video submissions"
  ON public.video_submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own video submissions"
  ON public.video_submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all video submissions"
  ON public.video_submissions FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));

-- ═══════════════════════════════════════════════════════════
-- JOURNAL ENTRIES
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  student_profile_id UUID REFERENCES public.student_profiles(id) ON DELETE CASCADE,
  title TEXT,
  body TEXT,
  prompt TEXT,
  fret_id INTEGER CHECK (fret_id BETWEEN 1 AND 12),
  mood TEXT,
  entry_type TEXT DEFAULT 'text',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal"
  ON public.journal_entries FOR ALL
  USING (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- FUNCTIONS
-- ═══════════════════════════════════════════════════════════

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tables with updated_at
DROP TRIGGER IF EXISTS profiles_updated_at ON public.profiles;
CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS student_profiles_updated_at ON public.student_profiles;
CREATE TRIGGER student_profiles_updated_at
  BEFORE UPDATE ON public.student_profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS progress_updated_at ON public.progress;
CREATE TRIGGER progress_updated_at
  BEFORE UPDATE ON public.progress
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- ═══════════════════════════════════════════════════════════
-- INDEXES
-- ═══════════════════════════════════════════════════════════

CREATE INDEX IF NOT EXISTS idx_progress_user_fret
  ON public.progress(user_id, fret_id);

CREATE INDEX IF NOT EXISTS idx_submissions_user
  ON public.submissions(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_journal_user
  ON public.journal_entries(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_video_submissions_user
  ON public.video_submissions(user_id, created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- DRIVE CONFIG (Template architecture — reusable per instructor)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.drive_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_email TEXT NOT NULL UNIQUE,
  mentor_email TEXT NOT NULL,
  folder_template_name TEXT DEFAULT 'Voix Vive Submissions',
  folder_template_id TEXT,
  share_role TEXT DEFAULT 'writer',
  color_theme JSONB DEFAULT '{"primary": "#c9a96e", "secondary": "#7aaa88"}',
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.drive_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active drive configs"
  ON public.drive_config FOR SELECT
  USING (active = TRUE);

-- ═══════════════════════════════════════════════════════════
-- MENTOR AVAILABILITY (Async review scheduling)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.mentor_availability (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  instructor_email TEXT NOT NULL,
  slot_start TIMESTAMPTZ NOT NULL,
  slot_end TIMESTAMPTZ NOT NULL,
  is_booked BOOLEAN DEFAULT FALSE,
  booked_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  submission_id UUID REFERENCES public.video_submissions(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mentor_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view mentor availability"
  ON public.mentor_availability FOR SELECT
  USING (is_booked = FALSE);

CREATE POLICY "Users can book their own slots"
  ON public.mentor_availability FOR UPDATE
  USING (auth.uid() = booked_by OR is_booked = FALSE);

-- ═══════════════════════════════════════════════════════════
-- TEXT-BACK REQUESTS ($5 quick text response)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.text_back_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  status TEXT DEFAULT 'pending', -- pending | answered | refunded
  price_cents INTEGER DEFAULT 500,
  mentor_response TEXT,
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.text_back_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own text-back requests"
  ON public.text_back_requests FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own text-back requests"
  ON public.text_back_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admin can view all text-back requests"
  ON public.text_back_requests FOR SELECT
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
  ));
