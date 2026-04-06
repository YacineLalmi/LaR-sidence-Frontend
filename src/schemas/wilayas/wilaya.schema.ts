import z from "zod";
import { TranslationSchema } from "../global/translation.schema";

export const WilayaSchema = z.object({
  id: z.string(),
  name: TranslationSchema,
  code: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Wilaya = z.infer<typeof WilayaSchema>;
