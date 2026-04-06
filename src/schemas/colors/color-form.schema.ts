import z from "zod";
import { TranslationFormSchema } from "../global/translation-form.schema";

export const ColorFormSchema = z.object({
  background_color: z.string().regex(/^#?([A-Fa-f0-9]{6})$/),
  text_color: z.string().regex(/^#?([A-Fa-f0-9]{6})$/),
  name: TranslationFormSchema,
  description: TranslationFormSchema.optional(),
});

export type ColorForm = z.infer<typeof ColorFormSchema>;
