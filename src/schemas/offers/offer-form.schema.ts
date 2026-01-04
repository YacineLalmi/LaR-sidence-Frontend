import z from "zod";

export const OfferFormSchema = z.object({
  bien_id: z.string(),
  client_id: z.string(),
  type_id: z.string(),
  status_id: z.string(),
  proposed_price: z.string(),
  conditions: z.string().nullable(),
  comment: z.string().nullable(),
});

export type OfferForm = z.infer<typeof OfferFormSchema>;
