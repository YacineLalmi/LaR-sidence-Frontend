import z from "zod";
import { TranslationFormSchema } from "../global/translation-form.schema";
import { PostCodeSchema } from "../global/post-code.schema";

export const CommuneFormSchema = z.object({
  name: TranslationFormSchema,
  post_code: PostCodeSchema,
  wilaya_id: z.string(),
});

export type CommuneForm = z.infer<typeof CommuneFormSchema>;
