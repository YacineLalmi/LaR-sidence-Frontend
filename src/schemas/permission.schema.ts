import z from "zod";
import { MultiLangSchema } from "./Global.schema";

export const PermissionSchema = z.object({
  id: z.number(),
  name: z.string().optional(),
  display_name: MultiLangSchema,
  description: MultiLangSchema.optional(),
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

export const GroupedPermissionsSchema = z.record(z.string(), z.array(PermissionSchema));
export type GroupedPermissions = z.infer<typeof GroupedPermissionsSchema>;

export type Permission = z.infer<typeof PermissionSchema>;
