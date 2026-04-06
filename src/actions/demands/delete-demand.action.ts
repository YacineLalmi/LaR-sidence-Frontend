"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { DemandService } from "@/services/demand.service";

export async function deleteDemandAction(id: string): Promise<FormState> {
  try {
    await DemandService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
