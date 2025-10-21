import z from "zod";
import { UserRoleSchema } from "../roles/user-role.schema";

export const ProfileSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string(),
  role: UserRoleSchema,
  permissions: z.array(z.string()),
});

export type Profile = z.infer<typeof ProfileSchema>;
