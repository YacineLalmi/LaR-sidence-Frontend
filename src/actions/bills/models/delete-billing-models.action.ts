"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillingModelService } from "@/services/billing-model.service"

export async function deleteBillingModelsAction(ids: string[]): Promise<FormState> {
  try {
    await BillingModelService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
