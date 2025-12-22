import z from "zod";

export const BienAdditionalcharacteristicsFormSchema = z.object({
  code: z.string().max(50),
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  is_active: z.boolean(),
});

export type BienAdditionalcharacteristicsForm = z.infer<typeof BienAdditionalcharacteristicsFormSchema>;
