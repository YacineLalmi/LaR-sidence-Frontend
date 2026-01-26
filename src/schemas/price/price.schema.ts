import z from "zod";

export const PriceSchema = z.object({
  id: z.number(),
  old_price: z.number(),
  new_price: z.number(),
  user: z.string(),
  comment: z.string().nullable(),
  bien_creation_date: z.iso.datetime(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime().nullable(),
});

export type Price = z.infer<typeof PriceSchema>;
