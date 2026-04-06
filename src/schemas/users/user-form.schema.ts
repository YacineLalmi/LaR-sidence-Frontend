import z from "zod";

export const UserFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  phonenumber: z.string(),
  email: z.string(),
  role_id: z.string(),
  is_active: z.boolean(),
});

export type UserForm = z.infer<typeof UserFormSchema>;
