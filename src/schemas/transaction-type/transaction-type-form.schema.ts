import z from "zod";

export const TransactionTypeFormSchema = z.object({
  code: z.string().max(50),
  name: z.string().max(100),
  description: z.string().max(255).nullable(),
  is_active: z.boolean(),
});

export type TransactionTypeForm = z.infer<typeof TransactionTypeFormSchema>;
