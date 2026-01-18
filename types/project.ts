export interface Project {
  id: string;
  title_en: string;
  title_ru: string;
  title_uz: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  image: string;
  tech: string[];
  live_url: string;
  github_url: string;
  order_index: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CreateProjectDTO {
  title_en: string;
  title_ru: string;
  title_uz: string;
  description_en: string;
  description_ru: string;
  description_uz: string;
  image: string;
  tech: string[];
  live_url: string;
  github_url: string;
  order_index?: number;
  is_published?: boolean;
}

export interface UpdateProjectDTO extends Partial<CreateProjectDTO> {
  id: string;
}
