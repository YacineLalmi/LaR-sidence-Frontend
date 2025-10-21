import z from "zod";
import { PermissionSchema } from "./permission.schema";

export const PermissionCategorySchema = z.object({
  name: z.string(),
  permissions: z.array(PermissionSchema),
});

export type PermissionCategory = z.infer<typeof PermissionCategorySchema>;
