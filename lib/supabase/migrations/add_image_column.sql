-- ============================================
-- MIGRATION: Add image column to projects table
-- ============================================
-- Run this in your Supabase SQL Editor to add the missing image column

ALTER TABLE projects 
ADD COLUMN IF NOT EXISTS image TEXT NOT NULL DEFAULT '';

-- Verify the column was added (optional check)
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'projects' AND column_name = 'image';
