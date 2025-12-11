import z from "zod";

export const OfferTypeSchema = z.object({
  id: z.union([z.number(), z.string()]).transform((val) => typeof val === 'string' ? parseInt(val) : val),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
});

export type OfferType = z.infer<typeof OfferTypeSchema>;

