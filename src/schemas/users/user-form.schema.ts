import z from "zod";
import { PhoneNumberSchema } from "../global/phonenumber.schema";

export const UserFormSchema = z.object({
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
  phonenumber: PhoneNumberSchema,
  email: z.string(),
  role_id: z.string(),
  is_active: z.boolean(),
});

export type UserForm = z.infer<typeof UserFormSchema>;
