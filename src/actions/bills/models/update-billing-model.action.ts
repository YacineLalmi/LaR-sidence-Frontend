"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillingModelForm } from "@/schemas/bills/models/billing-model-form.schema";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import { BillingModelService } from "@/services/billing-model.service";

export async function updateBillingModelAction(data: BillingModelForm, id: string): Promise<FormState<BillingModel>> {
  try {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("tax_rate", data.tax_rate);
    formData.append("bank_name", data.bank_name);
    formData.append("iban", data.iban);
    formData.append("swift_bic", data.swift_bic);
    formData.append("footer", data.footer);
    formData.append("legal_mentions", data.legal_mentions);
    formData.append("logo", data.logo);

    const response = await BillingModelService.update(formData, id);
    return { isOk: true, data: response };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
