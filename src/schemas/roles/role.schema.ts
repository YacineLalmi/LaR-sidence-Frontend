import z from "zod";
import { PermissionSchema } from "../permissions/permission.schema";

export const RoleSchema = z.object({
  id: z.string(),
  name: z.string(),
  display_name: z.string(),
  description: z.string(),
  permissions: z.array(PermissionSchema).optional(),
  created_at: z.iso.datetime(),
  updated_at: z.iso.datetime(),
  deleted_at: z.iso.datetime().nullable(),
});

export type Role = z.infer<typeof RoleSchema>;
