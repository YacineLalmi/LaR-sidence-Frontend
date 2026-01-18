"use server";

import { handleServerActionError } from "@/lib/utils";
import { FormState } from "@/lib/definitions";
import { AuthService } from "@/services/auth.service";
import { ResetPasswordDataForm } from "@/schemas/auth/reset-password-form.schema";

export async function ResetPasswordAction(data: ResetPasswordDataForm): Promise<FormState> {
  try {
    await AuthService.resetPassword(data);

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
