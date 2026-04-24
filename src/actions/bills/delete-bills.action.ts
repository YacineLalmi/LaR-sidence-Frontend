"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BillService } from "@/services/bill.service";

export async function deleteBillsAction(ids: string[]): Promise<FormState> {
  try {
    await BillService.deleteMany(ids);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
