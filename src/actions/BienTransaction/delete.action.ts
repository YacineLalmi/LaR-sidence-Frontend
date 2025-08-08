"use server";

import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienTransactionService } from "@/services/BienTransaction.service";

export type DeleteBienTransactionState = FormState;

export async function deleteBienTransactionAction(
  initialState: DeleteBienTransactionState,
  formData: FormData
): Promise<DeleteBienTransactionState> {
  const id = parseInt(formData.get("id") as string);

  if (!id) {
    return {
      isOk: "NOK",
      errorMessage: "ID is required",
      errorCode: ErrorCodes.VALIDATION_ERROR,
    };
  }

  try {
    await BienTransactionService.delete(id);
    return { isOk: "OK" };
  } catch (error) {
    return {
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong",
    };
  }
}
