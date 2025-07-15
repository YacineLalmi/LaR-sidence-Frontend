import { ErrorCodes } from "@/lib/constants";
import { z } from "zod";

export const LoginRequestDataSchema = z.object({
  nom_utilisateur: z.string({
    message: ErrorCodes.REQUIRED_FIELD,
  }),
  mot_de_passe: z.string().min(8, { message: ErrorCodes.TOO_SHORT }),
});

export type LoginRequestData = z.infer<typeof LoginRequestDataSchema>;

export const LoginResponseDataSchema = z.object({
  access_token: z.string(),
  access_token_expires_at: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)))
    .transform((val) => new Date(val)),
});

export type LoginResponseData = z.infer<typeof LoginResponseDataSchema>;
