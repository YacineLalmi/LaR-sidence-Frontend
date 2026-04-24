"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillingModelForm } from "@/schemas/bills/models/billing-model-form.schema";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import { BillingModelService } from "@/services/billing-model.service";

export async function createBillingModelAction(data: BillingModelForm): Promise<FormState<BillingModel>> {
  try {
    const billingModel = await BillingModelService.create(data);
    return { isOk: true, data: billingModel };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
