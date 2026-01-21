"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";;
import { TransactionTypeForm } from "@/schemas/transaction-type/transaction-type-form.schema";
import { TransactionTypeService } from "@/services/transaction-type.service";

export async function createTransactionTypeAction(data: TransactionTypeForm): Promise<FormState> {
  try {
    await TransactionTypeService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
