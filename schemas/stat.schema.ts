import { z } from "zod";

export const statSchema = z.object({
  number: z.string().min(1, "Number is required").max(20),
  label_en: z.string().min(1, "English label is required").max(100),
  label_ru: z.string().min(1, "Russian label is required").max(100),
  label_uz: z.string().min(1, "Uzbek label is required").max(100),
  order_index: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export type StatFormData = z.infer<typeof statSchema>;
