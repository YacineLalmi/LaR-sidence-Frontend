import z from "zod";

export const BienStatusFormSchema = z.object({
  code: z.string(),
  name: z.string(),
  color: z.string(),
  description: z.string(),
  is_active: z.boolean(),
});

export type BienStatusForm = z.infer<typeof BienStatusFormSchema>;
