"use server";

import { FormState } from "@/lib/definitions";
import { AuthService } from "@/services/auth.service";
import { ForgotPasswordDataForm } from "@/schemas/auth/forget-password-form.schema";
import { handleServerActionError } from "@/lib/server.helper";

export async function forgotPasswordAction(data: ForgotPasswordDataForm): Promise<FormState> {
  try {
    await AuthService.forgotPassword(data);

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
