"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientStatusService } from "@/services/client-status.service";

export async function deleteClientStatusAction(id: number): Promise<FormState> {
  try {
    await ClientStatusService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
