import z from "zod";

export const BienStatusSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  color: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type BienStatus = z.infer<typeof BienStatusSchema>;
