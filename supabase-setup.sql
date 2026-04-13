-- CGLacross Stats — Supabase table setup
-- Run this once in your Supabase project's SQL Editor

-- 1. Create the table
CREATE TABLE IF NOT EXISTS lacrosse_data (
  id         TEXT        PRIMARY KEY,
  payload    JSONB       NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Enable Row Level Security
ALTER TABLE lacrosse_data ENABLE ROW LEVEL SECURITY;

-- 3. Allow the anon key to read and write (app is protected by passcode at UI level)
CREATE POLICY "anon read"  ON lacrosse_data FOR SELECT USING (true);
CREATE POLICY "anon upsert" ON lacrosse_data FOR INSERT WITH CHECK (true);
CREATE POLICY "anon update" ON lacrosse_data FOR UPDATE USING (true);

-- That's it! The app will automatically upsert a single row with id='main'.
