import z from "zod";

export const OfferFilterFormSchema = z.object({
  bien_id: z.string().optional(),
  status_id: z.string().optional(),
  type_id: z.string().optional(),
  client_id: z.string().optional(),
});

export type OfferFilterForm = z.infer<typeof OfferFilterFormSchema>;
