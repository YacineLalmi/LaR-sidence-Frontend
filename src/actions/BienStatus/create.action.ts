"use server";

import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienStatusService } from "@/services/BienStatus.service";
import { BienStatusForm, BienStatusFormSchema } from "@/schemas/BienStatus.schema";
import { FormValidationError } from "@/lib/errors";

// export type CreateBienStatusSta:te = FormState & CreateBienStatus;

export interface CreateBienStatusState {
  data: Partial<BienStatusForm>;
  form: FormState;
}

export async function createBienStatusAction(
  initialState: CreateBienStatusState,
  formData: FormData
): Promise<CreateBienStatusState> {
  const data: BienStatusForm = {
    color: formData.get("color") as string,
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
  };

  let form = { ...initialState.form };

  const validatedFields = BienStatusFormSchema.safeParse(data);

  if (!validatedFields.success) {
    form = {
      isOk: false,
      errorMessage: "Validation Error",
      errorCode: ErrorCodes.FORM_VALIDATION_ERROR,
      errorDetails: validatedFields.error?.flatten().fieldErrors,
    };
    return {
      data,
      form,
    };
  }

  try {
    await BienStatusService.create(data);
    form.isOk = true
    return {
      data,
      form,
    };
  } catch (error) {
    form.isOk = false;
    if (error instanceof FormValidationError) {
      form.errorMessage = error.message;
      form.errorCode = ErrorCodes.FORM_VALIDATION_ERROR;
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
