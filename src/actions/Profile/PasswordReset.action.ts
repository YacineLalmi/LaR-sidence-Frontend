"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { PasswordResetForm } from "@/schemas/profile/PasswordReset.schema";
import { ProfileService } from "@/services/profile.service";

export async function passwordResetAction(data: PasswordResetForm): Promise<FormState> {
  try {
    await ProfileService.passwordReset(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
