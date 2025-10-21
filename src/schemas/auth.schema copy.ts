import { ErrorCodes } from "@/lib/constants";
import { z } from "zod";

export const LoginFormSchema = z.object({
  username: z.string({
    message: ErrorCodes.REQUIRED_FIELD,
  }),
  password: z.string().min(8, { message: ErrorCodes.TOO_SHORT }),
});

export type LoginForm = z.infer<typeof LoginFormSchema>;

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
