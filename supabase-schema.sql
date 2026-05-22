-- By Des — Party Planning Studio
-- Run this in your Supabase SQL editor

CREATE TABLE IF NOT EXISTS plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  theme TEXT NOT NULL,
  kid_name TEXT,
  kid_age INTEGER,
  guests_count INTEGER,
  budget_range TEXT,
  vibe_tags TEXT[],
  venue_type TEXT,
  party_date DATE,
  style_pref TEXT,
  food_notes TEXT,
  free_notes TEXT,
  generated_plan JSONB NOT NULL,
  language TEXT DEFAULT 'he',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anonymous reads and inserts (no auth required for MVP)
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert plans"
  ON plans FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Anyone can read plans"
  ON plans FOR SELECT
  TO anon
  USING (true);
