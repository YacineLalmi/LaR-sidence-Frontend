import { z } from "zod";

export const LoginFormDataSchema = z.object({
  username: z.string().min(1, { message: "Le nom d'utilisateur est requis" }),
  password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères" }),
});

export type LoginFormData = z.infer<typeof LoginFormDataSchema>;

export const LoginResponseSchema = z.object({
  access_token: z.string(),
  access_token_expires_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
  refresh_token: z.string(),
  refresh_token_expires_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
});

export type LoginResponse = z.infer<typeof LoginResponseSchema>;
