"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { UserService } from "@/services/user.service";

export async function deleteUserAction(id: number): Promise<FormState> {
  try {
    await UserService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
