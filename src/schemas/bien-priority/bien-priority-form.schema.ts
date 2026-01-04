import z from "zod";

export const BienPriorityFormSchema = z.object({
  code: z.string().max(50),
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  color_id: z.string(),
  is_active: z.boolean(),
});

export type BienPriorityForm = z.infer<typeof BienPriorityFormSchema>;
