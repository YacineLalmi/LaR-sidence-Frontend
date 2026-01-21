"use server";

import { FormState } from "@/lib/definitions";
import { AuthService } from "@/services/auth.service";
import { ResetPasswordDataForm } from "@/schemas/auth/reset-password-form.schema";
import { handleServerActionError } from "@/lib/server.helper";

export async function ResetPasswordAction(data: ResetPasswordDataForm): Promise<FormState> {
  try {
    await AuthService.resetPassword(data);

    return {
      isOk: true,
    };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
