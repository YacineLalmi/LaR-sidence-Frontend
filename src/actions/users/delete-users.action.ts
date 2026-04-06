"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { UserService } from "@/services/user.service";

export async function deleteUsersAction(ids: string[]): Promise<FormState> {
  try {
    await UserService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
