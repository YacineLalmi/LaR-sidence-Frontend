"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillForm } from "@/schemas/bills/bill-form.schema";
import { BillService } from "@/services/bill.service";

export async function createBillAction(data: BillForm): Promise<FormState> {
  try {
    await BillService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
