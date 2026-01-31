export interface Hero {
  id: string;
  name: string;
  profession_en: string;
  profession_ru: string;
  profession_uz: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  view_projects_text_en: string;
  view_projects_text_ru: string;
  view_projects_text_uz: string;
  resume_text_en: string;
  resume_text_ru: string;
  resume_text_uz: string;
  resume_url: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface UpdateHeroDTO {
  id: string;
  name?: string;
  profession_en?: string;
  profession_ru?: string;
  profession_uz?: string;
  description_en?: string;
  description_ru?: string;
  description_uz?: string;
  view_projects_text_en?: string;
  view_projects_text_ru?: string;
  view_projects_text_uz?: string;
  resume_text_en?: string;
  resume_text_ru?: string;
  resume_text_uz?: string;
  resume_url?: string;
  is_published?: boolean;
}
