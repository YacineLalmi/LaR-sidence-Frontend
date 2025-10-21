import z from "zod";

export const WilayaSchema = z.object({
  id: z.string(),
  name: z.string(),
  code: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().optional(),
  deleted_at: z.iso.datetime().optional(),
});

export type Wilaya = z.infer<typeof WilayaSchema>;
