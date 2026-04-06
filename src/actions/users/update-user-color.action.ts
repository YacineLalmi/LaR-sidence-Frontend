"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { UserService } from "@/services/user.service";

export async function updateUserColor(data: { color_id: string }, id: string): Promise<FormState> {
  try {
    await UserService.updateColor(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
