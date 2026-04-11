import z from "zod";

export const ProfileFormSchema = z.object({
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  username: z.string().min(1),
  phonenumber: z.string().min(1),
  email: z.string().email(),
});

export type ProfileForm = z.infer<typeof ProfileFormSchema>;
