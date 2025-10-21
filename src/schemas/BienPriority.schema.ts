import z from "zod";

export const BienPrioritySchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: z.string(),
  description: z.string().optional(),
  is_active: z.boolean(),
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

export type BienPriority = z.infer<typeof BienPrioritySchema>;

export const BienPriorityFormSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string(),
  is_active: z.boolean(),
});

export type BienPriorityForm = z.infer<typeof BienPriorityFormSchema>;
