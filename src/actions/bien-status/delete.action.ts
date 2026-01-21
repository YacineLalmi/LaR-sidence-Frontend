"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienStatusService } from "@/services/bien-status.service";

export async function deleteBienStatusAction(id: number): Promise<FormState> {
  try {
    await BienStatusService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
