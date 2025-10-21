"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { UserForm } from "@/schemas/users/user-form.schema";
import { UserService } from "@/services/users.service";

export async function createUserAction(data: UserForm): Promise<FormState> {
  try {
    await UserService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
