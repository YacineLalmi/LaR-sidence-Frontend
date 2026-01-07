"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { CommuneService } from "@/services/commune.service";

export async function deleteCommuneAction(id: number): Promise<FormState> {
  try {
    await CommuneService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
