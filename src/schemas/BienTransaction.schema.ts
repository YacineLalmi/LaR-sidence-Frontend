import z from "zod";

export const BienTransactionSchema = z.object({
  id: z.string().optional(),
  code: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  is_active: z.string(),
  created_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  updated_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
  deleted_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
});

export type BienTransaction = z.infer<typeof BienTransactionSchema>;

export const BienTransactionFormSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string(),
  is_active: z.boolean(),
});

export type BienTransactionForm = z.infer<typeof BienTransactionFormSchema>;
