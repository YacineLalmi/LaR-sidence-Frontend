"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { DemandService } from "@/services/demand.service";

export async function updateDemandAction(data: DemandForm, id: number): Promise<FormState> {
  try {
    await DemandService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
