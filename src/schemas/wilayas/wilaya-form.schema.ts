import z from "zod";
import { TranslationFormSchema } from "../global/translation-form.schema";

export const WilayaFormSchema = z.object({
  name: TranslationFormSchema,
  code: z.string().regex(/^\d{1,3}$/, "code must be an integer with up to 3 digits"),
});

export type WilayaForm = z.infer<typeof WilayaFormSchema>;
