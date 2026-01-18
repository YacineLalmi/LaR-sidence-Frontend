"use server";

import { handleServerActionError } from "@/lib/utils";
import { FormState } from "@/lib/definitions";
import { AuthService } from "@/services/auth.service";
import { ForgotPasswordDataForm } from "@/schemas/auth/forget-password-form.schema";

export async function forgotPasswordAction(data: ForgotPasswordDataForm): Promise<FormState> {
  try {
    await AuthService.forgotPassword(data);

    return {
      isOk: true,
    };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
