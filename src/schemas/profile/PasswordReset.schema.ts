import { ErrorCodes } from "@/constants/error-codes";
import { z } from "zod";

export const PasswordResetFormSchema = z
  .object({
    current_password: z.string({
      message: ErrorCodes.REQUIRED_FIELD,
    }),
    new_password: z
      .string()
      .min(8, { message: ErrorCodes.TOO_SHORT })
      .regex(/(?=.*[a-z])/, { message: "Password must contain a lowercase letter" })
      .regex(/(?=.*[A-Z])/, { message: "Password must contain an uppercase letter" })
      .regex(/(?=.*\d)/, { message: "Password must contain a number" })
      .regex(/(?=.*[!@#$%^&*()_\-+=[\]{};':"\\|,.<>/?])/, { message: "Password must contain a special character" }),
    new_password_confirmation: z.string().min(8, { message: ErrorCodes.TOO_SHORT }),
  })
  .refine((data) => data.new_password === data.new_password_confirmation, {
    path: ["new_password_confirmation"],
    message: "Passwords do not match",
  });

export type PasswordResetForm = z.infer<typeof PasswordResetFormSchema>;
