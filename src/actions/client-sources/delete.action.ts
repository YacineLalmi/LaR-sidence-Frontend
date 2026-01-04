"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientSourceService } from "@/services/client-source.service";

export async function deleteClientSourceAction(id: number): Promise<FormState> {
  try {
    await ClientSourceService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
