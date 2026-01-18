-- ============================================
-- SUPABASE DATABASE SCHEMA FOR PORTFOLIO PROJECTS
-- ============================================
-- 
-- SCHEMA DESIGN RATIONALE:
-- 1. Uses a relational translations table instead of title_en, title_ru, title_uz columns
--    - Better scalability: Easy to add new languages without schema changes
--    - Normalized data: Reduces redundancy and maintains consistency
--    - Easier maintenance: Single source of truth for each translation
--    - Better query flexibility: Can fetch all languages or specific ones easily
--
-- 2. Separates content (projects) from translations (project_translations)
--    - Allows non-translatable fields (image, liveUrl, githubUrl, tech) in main table
--    - Makes it clear which fields are translatable vs static
--    - Enables proper indexing on both tables
--
-- 3. Uses UUID for primary keys
--    - Better for distributed systems
--    - Avoids enumeration attacks
--    - Easier to merge data from different sources
--
-- 4. Includes created_at and updated_at timestamps
--    - Essential for content management
--    - Helps with auditing and debugging
--    - Useful for sorting by recency

-- ============================================
-- PROJECTS TABLE
-- ============================================
-- Stores non-translatable project data
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  image TEXT NOT NULL,
  live_url TEXT,
  github_url TEXT,
  tech TEXT[] DEFAULT '{}', -- Array of technology names
  is_published BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0, -- For custom ordering
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PROJECT_TRANSLATIONS TABLE
-- ============================================
-- Stores translatable content for each project and language
CREATE TABLE IF NOT EXISTS project_translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  locale VARCHAR(5) NOT NULL CHECK (locale IN ('en', 'ru', 'uz')),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  -- Ensure one translation per project per locale
  UNIQUE(project_id, locale)
);

-- ============================================
-- INDEXES
-- ============================================
-- Index for faster lookups by project_id in translations
CREATE INDEX IF NOT EXISTS idx_project_translations_project_id 
  ON project_translations(project_id);

-- Index for faster locale lookups
CREATE INDEX IF NOT EXISTS idx_project_translations_locale 
  ON project_translations(locale);

-- Index for sorting projects by display order
CREATE INDEX IF NOT EXISTS idx_projects_display_order 
  ON projects(display_order);

-- Index for filtering published projects
CREATE INDEX IF NOT EXISTS idx_projects_is_published 
  ON projects(is_published) WHERE is_published = true;

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================
-- Enable RLS on both tables
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_translations ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read published projects (for public site)
CREATE POLICY "Public projects are viewable by everyone"
  ON projects FOR SELECT
  USING (is_published = true);

-- Policy: Anyone can read translations for published projects
CREATE POLICY "Public project translations are viewable by everyone"
  ON project_translations FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_translations.project_id 
      AND projects.is_published = true
    )
  );

-- Policy: Authenticated users can do everything on projects (admin access)
-- Note: You'll need to adjust this based on your auth setup
-- This assumes you have a function to check if user is admin
CREATE POLICY "Admins can manage all projects"
  ON projects FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can manage all project translations"
  ON project_translations FOR ALL
  USING (auth.role() = 'authenticated');

-- ============================================
-- TRIGGERS
-- ============================================
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_project_translations_updated_at
  BEFORE UPDATE ON project_translations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- USEFUL VIEWS (OPTIONAL)
-- ============================================
-- View to get projects with translations for a specific locale
CREATE OR REPLACE VIEW projects_with_translations AS
SELECT 
  p.id,
  p.image,
  p.live_url,
  p.github_url,
  p.tech,
  p.is_published,
  p.display_order,
  p.created_at,
  p.updated_at,
  pt.locale,
  pt.title,
  pt.description
FROM projects p
LEFT JOIN project_translations pt ON p.id = pt.project_id;
