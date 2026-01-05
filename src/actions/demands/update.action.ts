"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { DemandsService } from "@/services/demands.service";

export async function updateDemandAction(data: DemandForm, id: string): Promise<FormState> {
  try {
    await DemandsService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

