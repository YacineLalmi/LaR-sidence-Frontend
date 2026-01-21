"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { DemandForm } from "@/schemas/demands/demand-form.schema";
import { DemandService } from "@/services/demand.service";

export async function createDemandAction(data: DemandForm): Promise<FormState> {
  try {
    await DemandService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
