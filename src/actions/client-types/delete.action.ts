"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientTypeService } from "@/services/client-types.service";

export async function deleteClientTypeAction(id: number): Promise<FormState> {
  try {
    await ClientTypeService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
