"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillForm } from "@/schemas/bills/bill-form.schema";
import { BillService } from "@/services/bill.service";

export async function updateBillAction(data: BillForm, id: string): Promise<FormState> {
  try {

    const formData = new FormData()
    formData.append("due_date", data.due_date)
    formData.append("client_id", data.client_id)
    formData.append("bien_id", data.bien_id)
    formData.append("status_id", data.status_id)
    formData.append("services_description", data.services_description || "")
    formData.append("amount_ht", data.amount_ht)
    formData.append("amount_tva", data.amount_tva)
    formData.append("amount_ttc", data.amount_ttc)
    formData.append("billing_model_id", data.billing_model_id)
    data.documents.forEach((file: File, index: number) => {
      formData.append(`documents[${index}]`, file);
    });

    await BillService.update(formData, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
