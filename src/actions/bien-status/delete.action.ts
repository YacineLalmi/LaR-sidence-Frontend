"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienStatusService } from "@/services/BienStatus.service";

export async function deleteBienStatusAction(id: number): Promise<FormState> {
  try {
    await BienStatusService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
