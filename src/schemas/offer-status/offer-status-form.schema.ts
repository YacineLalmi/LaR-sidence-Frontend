import z from "zod";

export const OfferStatusFormSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  color_id: z.string(),
  is_active: z.boolean(),
});

export type OfferStatusForm = z.infer<typeof OfferStatusFormSchema>;
