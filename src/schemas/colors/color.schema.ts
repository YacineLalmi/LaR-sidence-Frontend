import z from "zod";
import { TranslationSchema } from "../global/translation.schema";

export const ColorSchema = z.object({
  id: z.string(),
  background_color: z.string().max(7),
  text_color: z.string().max(7),
  name: TranslationSchema,
  description: TranslationSchema.optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Color = z.infer<typeof ColorSchema>;
