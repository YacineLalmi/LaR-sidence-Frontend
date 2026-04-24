"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillService } from "@/services/bill.service";

export async function deleteBillAction(id: string): Promise<FormState> {
  try {
    await BillService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
