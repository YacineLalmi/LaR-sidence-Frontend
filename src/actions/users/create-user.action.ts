"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { UserForm } from "@/schemas/users/user-form.schema";
import { UserService } from "@/services/user.service";

export async function createUserAction(data: UserForm): Promise<FormState> {
  try {
    await UserService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
