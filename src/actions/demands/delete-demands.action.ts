"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { DemandService } from "@/services/demand.service";

export async function deleteDemandsAction(ids: string[]): Promise<FormState> {
  try {
    const res = await DemandService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    console.error("response error", error);
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
