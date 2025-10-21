import z from "zod";
import { UserRoleSchema } from "../roles/user-role.schema";

export const UserDetailsSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string(),
  role: UserRoleSchema,
  permissions: z.array(z.string()),
  created_at: z.string(),
  updated_at: z.string(),
  deleted_at: z.string().nullable(),
});

export type UserDetails = z.infer<typeof UserDetailsSchema>;
