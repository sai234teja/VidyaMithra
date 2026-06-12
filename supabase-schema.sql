-- ============================================
-- VidyaMitra – Supabase Database Schema (Idempotent)
-- Run this in Supabase SQL Editor
-- (Dashboard → SQL Editor → New Query → Paste & Run)
-- ============================================

-- 1. User Profiles
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT,
  domain TEXT DEFAULT 'software',
  target_role TEXT DEFAULT '',
  experience_level TEXT DEFAULT 'fresher',
  skills TEXT DEFAULT '',
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Resume Analyses
CREATE TABLE IF NOT EXISTS resume_analyses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  file_name TEXT,
  overall_score INTEGER DEFAULT 0,
  formatting_score INTEGER DEFAULT 0,
  skills_score INTEGER DEFAULT 0,
  experience_score INTEGER DEFAULT 0,
  education_score INTEGER DEFAULT 0,
  projects_score INTEGER DEFAULT 0,
  keywords_score INTEGER DEFAULT 0,
  detected_skills TEXT[],
  recommendations JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Quiz Results
CREATE TABLE IF NOT EXISTS quiz_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  topic TEXT NOT NULL,
  score INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  correct_answers INTEGER NOT NULL,
  time_taken_seconds INTEGER,
  answers JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Interview Sessions
CREATE TABLE IF NOT EXISTS interview_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  overall_score INTEGER,
  technical_score INTEGER,
  communication_score INTEGER,
  questions JSONB,
  answers JSONB,
  feedback JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Learning Progress
CREATE TABLE IF NOT EXISTS learning_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  title TEXT,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, week_number)
);

-- 6. Activity Log
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  activity_type TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resume_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_log ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid "already exists" errors
DO $$
BEGIN
    DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
    DROP POLICY IF EXISTS "Users can view own resumes" ON resume_analyses;
    DROP POLICY IF EXISTS "Users can insert own resumes" ON resume_analyses;
    DROP POLICY IF EXISTS "Users can view own quiz results" ON quiz_results;
    DROP POLICY IF EXISTS "Users can insert own quiz results" ON quiz_results;
    DROP POLICY IF EXISTS "Users can view own interviews" ON interview_sessions;
    DROP POLICY IF EXISTS "Users can insert own interviews" ON interview_sessions;
    DROP POLICY IF EXISTS "Users can manage own learning" ON learning_progress;
    DROP POLICY IF EXISTS "Users can manage own activity" ON activity_log;
END
$$;

-- Create Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own resumes" ON resume_analyses FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own resumes" ON resume_analyses FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own quiz results" ON quiz_results FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own quiz results" ON quiz_results FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own interviews" ON interview_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own interviews" ON interview_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can manage own learning" ON learning_progress FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own activity" ON activity_log FOR ALL USING (auth.uid() = user_id);

-- ============================================
-- Auto-create profile on signup trigger
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, domain)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'), 
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'domain', 'software')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop trigger if exists (it will be replaced by CREATE OR REPLACE TRIGGER if supported, but older Supabase uses just CREATE TRIGGER)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
