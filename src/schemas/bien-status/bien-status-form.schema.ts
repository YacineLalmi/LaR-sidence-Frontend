import z from "zod";

export const BienStatusFormSchema = z.object({
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  color_id: z.string(),
  is_active: z.boolean(),
});

export type BienStatusForm = z.infer<typeof BienStatusFormSchema>;
