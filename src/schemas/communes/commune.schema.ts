import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";

export const CommuneSchema = z.object({
  id: z.number(),
  name: z.string(),
  post_code: z.number(),
  wilaya: WilayaSchema,
  longitude: z.number().nullable().optional(),
  latitude: z.number().nullable().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Commune = z.infer<typeof CommuneSchema>;
