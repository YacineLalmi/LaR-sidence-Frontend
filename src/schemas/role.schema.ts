import z from "zod";
import { MultiLangSchema } from "./Global.schema";

export const RoleSchema = z.object({
  id: z.number(),
  name: z.string(),
  display_name: MultiLangSchema,
  description: MultiLangSchema,
  permissions: z.array(z.number()).optional(),
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

export const RoleFormSchema = z.object({
  id: z.number().optional(),
  name: z.string(),
  display_name: MultiLangSchema,
  description: MultiLangSchema,
  permissions: z.array(z.number()).optional(),
});

export type RoleForm = z.infer<typeof RoleFormSchema>;

export type Role = z.infer<typeof RoleSchema>;
