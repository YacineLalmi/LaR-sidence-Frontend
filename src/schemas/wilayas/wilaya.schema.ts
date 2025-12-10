import z from "zod";

export const WilayaSchema = z.object({
  id: z.number(),
  name: z.string(),
  code: z.string(),
  longitude: z.number().nullable().optional(),
  latitude: z.number().nullable().optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type Wilaya = z.infer<typeof WilayaSchema>;
