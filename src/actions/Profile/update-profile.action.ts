"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ProfileForm } from "@/schemas/users/profile-form.schema";
import { UserService } from "@/services/user.service";

export async function updateProfileAction(data: ProfileForm): Promise<FormState> {
  try {
    await UserService.updateProfile(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
