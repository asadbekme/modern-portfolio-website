import { z } from "zod";

export const skillSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  icon_key: z.string().min(1, "Icon is required"),
  color_from: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  color_to: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Must be a valid hex color"),
  order_index: z.number().int().min(0).default(0),
  is_published: z.boolean().default(true),
});

export type SkillFormData = z.infer<typeof skillSchema>;
