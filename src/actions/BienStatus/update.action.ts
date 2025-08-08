"use server";
import { ValidationError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienStatusService } from "@/services/BienStatus.service";
import { BienStatusForm, BienStatusFormSchema } from "@/schemas/BienStatus.schema";

// export type UpdateBienStatusState = FormState & BienStatus;

export interface UpdateBienStatusState {
  data: Partial<BienStatusForm>;
  form: FormState;
}

export async function updateBienStatusAction(
  initialState: UpdateBienStatusState,
  formData: FormData
): Promise<UpdateBienStatusState> {
  const id = parseInt(formData.get("id") as string);
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
    await BienStatusService.update(data, id);
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
