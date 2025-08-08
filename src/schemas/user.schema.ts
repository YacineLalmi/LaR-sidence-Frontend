import z from "zod";

export const UserSchema = z.object({
  id: z.string(),
  last_name: z.string(),
  first_name: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string().email(),
  created_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  updated_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  deleted_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val))
    .nullable()
    .optional(),
});

export type User = z.infer<typeof UserSchema>;

export const UserFormSchema = z.object({
  last_name: z.string(),
  first_name: z.string(),
  is_active: z.boolean(),
  username: z.string(),
  email: z.string(),
});

export type UserForm = z.infer<typeof UserFormSchema>;
