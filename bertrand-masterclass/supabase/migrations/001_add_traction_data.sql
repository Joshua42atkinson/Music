-- ═══════════════════════════════════════════════════════════
-- MIGRATION: Add traction_data JSONB to profiles table
-- Run this in Supabase SQL Editor after schema.sql
-- ═══════════════════════════════════════════════════════════

-- Add traction_data JSONB column to profiles for cloud sync
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS traction_data JSONB DEFAULT NULL;

-- Add index for fast lookup by user
CREATE INDEX IF NOT EXISTS idx_profiles_traction_data
ON public.profiles USING GIN (traction_data);
