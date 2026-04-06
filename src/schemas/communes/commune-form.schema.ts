import z from "zod";
import { TranslationFormSchema } from "../global/translation-form.schema";

export const CommuneFormSchema = z.object({
  name: TranslationFormSchema,
  post_code: z.string().regex(/^\d{5}$/, "Must be exactly 5 digits"),
  wilaya_id: z.string(),
});

export type CommuneForm = z.infer<typeof CommuneFormSchema>;
