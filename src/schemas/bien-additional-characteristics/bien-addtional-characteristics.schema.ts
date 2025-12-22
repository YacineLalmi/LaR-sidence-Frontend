import z from "zod";

export const BienAdditionalcharacteristicsSchema = z.object({
  id: z.number(),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.iso.datetime().optional(),
  updated_at: z.iso.datetime().nullable().optional(),
  deleted_at: z.iso.datetime().nullable().optional(),
});

export type BienAdditionalcharacteristics = z.infer<typeof BienAdditionalcharacteristicsSchema>;
