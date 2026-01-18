import { z } from "zod";

export const ForgotPasswordDataFormSchema = z.object({
  email: z.email().min(1, { message: "L'address mail est requis" }),
});

export type ForgotPasswordDataForm = z.infer<typeof ForgotPasswordDataFormSchema>;
