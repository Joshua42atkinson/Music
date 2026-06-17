-- ═══════════════════════════════════════════════════════════
-- Migration 003: Community & Blog tables for paid tiers
-- Created: 2026-06-03
-- ═══════════════════════════════════════════════════════════

-- ═══════════════════════════════════════════════════════════
-- COMMUNITY POSTS ($1/mo Community tier)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  category TEXT DEFAULT 'general', -- 'general', 'progress', 'question', 'jam-request', 'resource'
  fret_tag INTEGER, -- optional: which fret this relates to
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  is_pinned BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

-- Anyone with community tier+ can read all posts
CREATE POLICY "Community members can read posts"
  ON public.community_posts FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Users can create their own posts
CREATE POLICY "Users can create own posts"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- Index for feed ordering
CREATE INDEX IF NOT EXISTS idx_community_posts_created
  ON public.community_posts(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_community_posts_category
  ON public.community_posts(category, created_at DESC);

-- ═══════════════════════════════════════════════════════════
-- COMMUNITY COMMENTS
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Community members can read comments"
  ON public.community_comments FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Users can create own comments"
  ON public.community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments"
  ON public.community_comments FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_community_comments_post
  ON public.community_comments(post_id, created_at ASC);

-- ═══════════════════════════════════════════════════════════
-- COMMUNITY POST LIKES (prevent double-likes)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.community_likes (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  post_id UUID REFERENCES public.community_posts(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, post_id)
);

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own likes"
  ON public.community_likes FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- ═══════════════════════════════════════════════════════════
-- MENTOR BLOG POSTS ($5/mo Inner Circle tier)
-- ═══════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.mentor_blog_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL, -- Markdown content
  excerpt TEXT, -- Short preview for card display
  category TEXT DEFAULT 'reflection', -- 'reflection', 'history', 'technique', 'meditation', 'philosophy'
  cover_emoji TEXT DEFAULT '🎸', -- Visual marker (no image uploads needed)
  is_published BOOLEAN DEFAULT FALSE,
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.mentor_blog_posts ENABLE ROW LEVEL SECURITY;

-- Inner circle members can read published posts
CREATE POLICY "Inner circle can read published blog posts"
  ON public.mentor_blog_posts FOR SELECT
  USING (is_published = TRUE AND auth.uid() IS NOT NULL);

-- Only admins can create/edit blog posts
CREATE POLICY "Admins can manage blog posts"
  ON public.mentor_blog_posts FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  )
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM auth.users WHERE raw_user_meta_data->>'role' = 'admin'
    )
  );

CREATE INDEX IF NOT EXISTS idx_mentor_blog_published
  ON public.mentor_blog_posts(is_published, published_at DESC);

-- ═══════════════════════════════════════════════════════════
-- SEED: Initial blog posts from Bertrand
-- ═══════════════════════════════════════════════════════════

INSERT INTO public.mentor_blog_posts (title, content, excerpt, category, cover_emoji, is_published, published_at)
VALUES
  (
    'Why I Teach Guitar Differently',
    E'## The Body Knows Before The Mind\n\nIn thirty years of teaching, I have learned one thing above all: the body knows before the mind. When a student asks me \"how do I play this chord,\" I don''t show them a finger diagram. I ask them to breathe.\n\nWhy? Because the fingers are servants. The ear is the true instrument. And the breath is the conductor.\n\n### The Three Pillars\n\nEvery lesson in Voix Vive follows the same sacred pattern:\n\n1. **BE** — Imagine the sound before you play it\n2. **DO** — Hear it, hum it, let your voice find it\n3. **PLAY** — Now the fingers know where to go\n\nThis is not my invention. This is how troubadours learned in medieval France. This is how jazz musicians learn in New Orleans. This is how the great classical guitarists of Spain pass the torch.\n\nThe guitar is a mirror. It reflects what you bring to it.\n\n*— Bertrand*',
    'In thirty years of teaching, I have learned one thing above all: the body knows before the mind.',
    'philosophy',
    '🪷',
    TRUE,
    NOW() - INTERVAL '7 days'
  ),
  (
    'The Silence Between Notes',
    E'## What Debussy Taught Me About Guitar\n\nClaude Debussy once said: \"Music is the silence between the notes.\" I did not understand this until I was 40.\n\nAs young guitarists, we rush. We fill every beat. We fear the silence. But the silence is where the music breathes.\n\n### A Practice Exercise\n\nToday, try this:\n1. Play a single note — any note\n2. Let it ring until it fades completely\n3. Wait three seconds in pure silence\n4. Play the next note\n\nWhat happens in that silence? Your ear reaches forward. Your body anticipates. The next note means *more* because it was preceded by nothing.\n\nThis is the secret of phrasing. This is what separates a musician from someone who plays notes.\n\n*— Bertrand*',
    'Claude Debussy once said: \"Music is the silence between the notes.\" I did not understand this until I was 40.',
    'meditation',
    '🌙',
    TRUE,
    NOW() - INTERVAL '3 days'
  ),
  (
    'Your Guitar Has a History',
    E'## Every Instrument Carries Stories\n\nDo you know the history of your guitar? Not its brand or model number — its *story*.\n\nThe wood in your guitar was once a tree. It stood in rain and sun, grew rings year after year, absorbed vibrations from wind and birds. When a luthier shapes that wood, they are not creating something new. They are releasing the music that was already inside.\n\n### The Troubadour''s Instrument\n\nIn medieval Occitania, a troubadour''s instrument was not a possession. It was a companion. They named their lutes. They spoke to them. This is not superstition — it is relationship.\n\nWhen you pick up your guitar tomorrow, hold it for a moment before you play. Feel its weight. Its temperature. The smoothness of the neck. This is your partner in music.\n\n*— Bertrand*',
    'Do you know the history of your guitar? Not its brand or model number — its story.',
    'history',
    '🌳',
    TRUE,
    NOW() - INTERVAL '1 day'
  )
ON CONFLICT DO NOTHING;
