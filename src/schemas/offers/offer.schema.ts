import z from "zod";

export const OfferSchema = z.object({
  id: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  gender: z.string(),
  email: z.string().optional(),
  status_id: z.string(),
  phone_numbers: z.array(z.string()).optional(),
  type_id: z.string().optional(),
  source_id: z.string().optional(),
  created_at: z.iso.datetime(),
});

export type Offer = z.infer<typeof OfferSchema>;