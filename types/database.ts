/**
 * TypeScript types for Supabase database tables
 * 
 * WHY: Type safety ensures we catch errors at compile-time rather than runtime.
 * These types match our database schema exactly.
 */

export type Project = {
  id: string;
  image: string;
  live_url: string | null;
  github_url: string | null;
  tech: string[];
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
};

export type ProjectTranslation = {
  id: string;
  project_id: string;
  locale: "en" | "ru" | "uz";
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
};

export type ProjectWithTranslation = Project & {
  translation: ProjectTranslation;
};

export type ProjectFormData = {
  image: string;
  live_url?: string;
  github_url?: string;
  tech: string[];
  is_published: boolean;
  display_order: number;
  translations: {
    en: { title: string; description: string };
    ru: { title: string; description: string };
    uz: { title: string; description: string };
  };
};
