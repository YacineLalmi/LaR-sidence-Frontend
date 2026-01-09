"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { UserForm } from "@/schemas/users/user-form.schema";
import { UserService } from "@/services/user.service";

export async function updateUserAction(data: UserForm, id: number): Promise<FormState> {
  try {
    await UserService.update(data, id );
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
