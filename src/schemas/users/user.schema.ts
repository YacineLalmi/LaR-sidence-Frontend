import z from "zod";
import { RoleSchema } from "../roles/role.schema";
import { ColorSchema } from "../colors/color.schema";

export const UserSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  phonenumber: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string(),
  role: RoleSchema.optional(),
  color: ColorSchema.optional(),
  color_id: z.string().optional(),
  role_id: z.string(),
  created_at: z.string(),
  updated_at: z.iso.datetime().nullable(),
  deleted_at: z.iso.datetime().nullable(),
});

export type User = z.infer<typeof UserSchema>;
