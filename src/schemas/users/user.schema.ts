import z from "zod";
import { RoleSchema } from "../roles/role.schema";

export const UserSchema = z.object({
  id: z.number(),
  last_name: z.string(),
  first_name: z.string(),
  phonenumber: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string(),
  role: RoleSchema,
  created_at: z.string(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type User = z.infer<typeof UserSchema>;
