"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { PasswordResetForm } from "@/schemas/profile/PasswordReset.schema";
import { AuthService } from "@/services/auth.service";

export async function changeProfilePasswordAction(data: PasswordResetForm): Promise<FormState> {
  try {
    await AuthService.profileChangePassword(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
