import z from "zod";
import { MultiLangSchema } from "./Global.schema";

export const BienTypeSchema = z.object({
  id: z.number().optional(),
  code: z.string().optional(),
  name: MultiLangSchema,
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

export type BienType = z.infer<typeof BienTypeSchema>;

export const BienTypeFormSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string(),
  is_active: z.boolean(),
});

export type BienTypeForm = z.infer<typeof BienTypeFormSchema>;
