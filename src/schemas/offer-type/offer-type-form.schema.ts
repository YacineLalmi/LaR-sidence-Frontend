import z from "zod";

export const OfferTypeFormSchema = z.object({
  code: z.string().max(50),
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  is_active: z.boolean(),
});

export type OfferTypeForm = z.infer<typeof OfferTypeFormSchema>;
