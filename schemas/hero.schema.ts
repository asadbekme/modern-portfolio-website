import { z } from "zod";

export const heroSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  profession_en: z.string().min(1, "English profession is required").max(200),
  profession_ru: z.string().min(1, "Russian profession is required").max(200),
  profession_uz: z.string().min(1, "Uzbek profession is required").max(200),
  description_en: z.string().min(1, "English description is required").max(500),
  description_ru: z.string().min(1, "Russian description is required").max(500),
  description_uz: z.string().min(1, "Uzbek description is required").max(500),
  view_projects_text_en: z
    .string()
    .min(1, "English button text is required")
    .max(50),
  view_projects_text_ru: z
    .string()
    .min(1, "Russian button text is required")
    .max(50),
  view_projects_text_uz: z
    .string()
    .min(1, "Uzbek button text is required")
    .max(50),
  resume_text_en: z.string().min(1, "English resume text is required").max(50),
  resume_text_ru: z.string().min(1, "Russian resume text is required").max(50),
  resume_text_uz: z.string().min(1, "Uzbek resume text is required").max(50),
  resume_url: z.string().min(1, "Resume URL is required").max(200),
  is_published: z.boolean().default(true),
});

export type HeroFormData = z.infer<typeof heroSchema>;
