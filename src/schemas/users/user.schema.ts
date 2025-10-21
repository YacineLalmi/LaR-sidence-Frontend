import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string(),
  created_at: z.string(),
});

export type User = z.infer<typeof UserSchema>;
