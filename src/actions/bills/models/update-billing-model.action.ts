"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillingModelForm } from "@/schemas/bills/models/billing-model-form.schema";
import { BillingModelService } from "@/services/billing-model.service";

export async function updateBillingModelAction(data: BillingModelForm, id: string): Promise<FormState> {
  try {
    await BillingModelService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
