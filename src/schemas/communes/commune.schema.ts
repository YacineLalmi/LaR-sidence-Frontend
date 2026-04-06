import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";
import { TranslationSchema } from "../global/translation.schema";
import { PostCodeSchema } from "../global/post-code.schema";

export const CommuneSchema = z.object({
  id: z.string(),
  name: TranslationSchema,
  post_code: PostCodeSchema,
  wilaya: WilayaSchema.optional(),
  wilaya_id: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Commune = z.infer<typeof CommuneSchema>;
