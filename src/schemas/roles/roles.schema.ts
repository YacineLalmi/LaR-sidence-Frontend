import z from "zod";
import { PermissionSchema } from "../permissions/permission.schema";

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  created_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .optional(),
});

export type Role = z.infer<typeof RoleSchema>;
