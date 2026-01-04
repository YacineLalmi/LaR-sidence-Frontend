"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { TransactionTypeService } from "@/services/transaction-type.service";

export async function deleteTransactionTypeAction(id: number): Promise<FormState> {
  try {
    await TransactionTypeService.delete(id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
