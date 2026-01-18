import { email, z } from "zod";

export const ResetPasswordDataFormSchema = z
  .object({
    email: z.email({ message: "L'adresse email est invalide" }),
    token: z.string().min(1, { message: "Le token est requis" }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
    password_confirmation: z.string().min(1, { message: "La confirmation du mot de passe est requise" }),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Les mots de passe ne correspondent pas",
  });

export type ResetPasswordDataForm = z.infer<typeof ResetPasswordDataFormSchema>;
