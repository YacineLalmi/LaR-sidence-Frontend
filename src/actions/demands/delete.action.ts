"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { DemandsService } from "@/services/demands.service";

export async function deleteDemandAction(id: number): Promise<FormState> {
  try {
    await DemandsService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

