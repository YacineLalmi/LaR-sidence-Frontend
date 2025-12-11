import z from "zod";

export const OfferStatusSchema = z.object({
  id: z.union([z.number(), z.string()]),
  code: z.string(),
  name: z.string(),
  description: z.string().nullable().optional(),
  is_active: z.boolean(),
  color: z.string(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable().optional(),
});

export type OfferStatus = z.infer<typeof OfferStatusSchema>;

