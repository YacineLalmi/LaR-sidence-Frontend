"use server";
import { ValidationError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienTransactionService } from "@/services/BienTransaction.service";
import {
  BienTransaction,
  BienTransactionForm,
  BienTransactionFormSchema,
  BienTransactionSchema,
} from "@/schemas/BienTransaction.schema";

export interface UpdateBienTransactionState {
  data: Partial<BienTransaction>;
  form: FormState;
}

export async function updateBienTransactionAction(
  initialState: UpdateBienTransactionState,
  formData: FormData
): Promise<UpdateBienTransactionState> {
  const id = parseInt(formData.get("id") as string);
  const data: BienTransaction = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
  };

  let form = { ...initialState.form };

  const validatedFields = BienTransactionSchema.safeParse(data);

  if (!validatedFields.success) {
    form = {
      isOk: "NOK",
      errorMessage: "Validation Error",
      errorCode: ErrorCodes.VALIDATION_ERROR,
      errorDetails: validatedFields.error?.flatten().fieldErrors,
    };
    return {
      data,
      form,
    };
  }

  try {
    await BienTransactionService.update(data, id);
    form.isOk = "OK";
    return {
      data,
      form,
    };
  } catch (error) {
    form.isOk = "NOK";
    if (error instanceof ValidationError) {
      form.errorMessage = error.message;
      form.errorCode = ErrorCodes.VALIDATION_ERROR;
      return {
        data,
        form,
      };
    } else {
      form.errorMessage = "Something went wrong";
      form.errorCode = ErrorCodes.UKNOWN_ERROR;
      return {
        data,
        form,
      };
    }
  }
}
