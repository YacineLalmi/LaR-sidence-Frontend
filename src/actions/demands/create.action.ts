"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { DemandsService } from "@/services/demands.service";

export async function createDemandAction(data: DemandForm): Promise<FormState> {
  try {
    await DemandsService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}

