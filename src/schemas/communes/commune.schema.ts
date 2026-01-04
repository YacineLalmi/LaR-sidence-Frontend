import z from "zod";
import { WilayaSchema } from "../wilayas/wilaya.schema";

export const CommuneSchema = z.object({
  id: z.number(),
  name: z.string(),
  post_code: z.number(),
  wilaya: WilayaSchema,
  created_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  updated_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
  deleted_at: z.union([z.string(), z.iso.datetime()]).nullable().optional(),
});

export type Commune = z.infer<typeof CommuneSchema>;
