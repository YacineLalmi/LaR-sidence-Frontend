import z from "zod";

export const BienStatusSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  color: z.string().optional(),
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

export type BienStatus = z.infer<typeof BienStatusSchema>;

export const BienStatusFormSchema = z.object({
  code: z.string(),
  name: z.string(),
  color: z.string(),
  description: z.string(),
  is_active: z.boolean(),
});

export type BienStatusForm = z.infer<typeof BienStatusFormSchema>;
