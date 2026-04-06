"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ColorService } from "@/services/colors.service";

export async function deleteColorsAction(ids: string[]): Promise<FormState> {
  try {
    await ColorService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
