import { z } from "zod";

export const aboutSchema = z.object({
  title_en: z.string().min(1, "English title is required").max(100),
  title_ru: z.string().min(1, "Russian title is required").max(100),
  title_uz: z.string().min(1, "Uzbek title is required").max(100),
  description_en: z
    .string()
    .min(1, "English description is required")
    .max(1000),
  description_ru: z
    .string()
    .min(1, "Russian description is required")
    .max(1000),
  description_uz: z.string().min(1, "Uzbek description is required").max(1000),
  location_en: z.string().min(1, "English location is required").max(100),
  location_ru: z.string().min(1, "Russian location is required").max(100),
  location_uz: z.string().min(1, "Uzbek location is required").max(100),
  availability_en: z
    .string()
    .min(1, "English availability is required")
    .max(100),
  availability_ru: z
    .string()
    .min(1, "Russian availability is required")
    .max(100),
  availability_uz: z.string().min(1, "Uzbek availability is required").max(100),
  education_en: z.string().min(1, "English education is required").max(200),
  education_ru: z.string().min(1, "Russian education is required").max(200),
  education_uz: z.string().min(1, "Uzbek education is required").max(200),
  what_i_do_en: z.string().min(1, "English 'What I Do' is required").max(100),
  what_i_do_ru: z.string().min(1, "Russian 'What I Do' is required").max(100),
  what_i_do_uz: z.string().min(1, "Uzbek 'What I Do' is required").max(100),
  service_1_en: z.string().min(1, "English service 1 is required").max(100),
  service_1_ru: z.string().min(1, "Russian service 1 is required").max(100),
  service_1_uz: z.string().min(1, "Uzbek service 1 is required").max(100),
  service_2_en: z.string().min(1, "English service 2 is required").max(100),
  service_2_ru: z.string().min(1, "Russian service 2 is required").max(100),
  service_2_uz: z.string().min(1, "Uzbek service 2 is required").max(100),
  service_3_en: z.string().min(1, "English service 3 is required").max(100),
  service_3_ru: z.string().min(1, "Russian service 3 is required").max(100),
  service_3_uz: z.string().min(1, "Uzbek service 3 is required").max(100),
  service_4_en: z.string().min(1, "English service 4 is required").max(100),
  service_4_ru: z.string().min(1, "Russian service 4 is required").max(100),
  service_4_uz: z.string().min(1, "Uzbek service 4 is required").max(100),
  image_url: z.string().nullable().optional(),
  is_published: z.boolean().default(true),
});

export type AboutFormData = z.infer<typeof aboutSchema>;
