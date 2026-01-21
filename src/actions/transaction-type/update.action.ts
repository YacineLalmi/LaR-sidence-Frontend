"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { TransactionTypeForm } from "@/schemas/transaction-type/transaction-type-form.schema";
import { TransactionTypeService } from "@/services/transaction-type.service";

export async function updateTransactionTypeAction(data: TransactionTypeForm, id: number): Promise<FormState> {
  try {
    await TransactionTypeService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
