import z from "zod";
import { MultiLangSchema } from "./global.schema";
import { PermissionSchema } from "./permission.schema";

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

export const CreateOrUpdateRoleSchema = z.object({
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  permissions: z.array(z.number()),
});

export type CreateOrUpdateRole = z.infer<typeof CreateOrUpdateRoleSchema>;

export type Role = z.infer<typeof RoleSchema>;
