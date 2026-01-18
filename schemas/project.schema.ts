import { z } from "zod";

export const projectSchema = z.object({
  title_en: z.string().min(1, "English title is required").max(200),
  title_ru: z.string().min(1, "Russian title is required").max(200),
  title_uz: z.string().min(1, "Uzbek title is required").max(200),
  description_en: z
    .string()
    .min(1, "English description is required")
    .max(1000),
  description_ru: z
    .string()
    .min(1, "Russian description is required")
    .max(1000),
  description_uz: z.string().min(1, "Uzbek description is required").max(1000),
  image: z.string().min(1, "Image is required"),
  tech: z.array(z.string()).min(1, "At least one technology is required"),
  live_url: z
    .string()
    .url("Must be a valid URL")
    .min(1, "Live URL is required"),
  github_url: z
    .string()
    .url("Must be a valid URL")
    .min(1, "GitHub URL is required"),
  order_index: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export type ProjectFormData = z.infer<typeof projectSchema>;
