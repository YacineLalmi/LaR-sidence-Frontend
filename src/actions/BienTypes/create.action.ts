"use server";
import { ValidationError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienTypeService } from "@/services/BienType.service";
import { BienTypeForm, BienTypeFormSchema } from "@/schemas/BienType.schema";

export interface CreateBienTypeState {
  data: Partial<BienTypeForm>;
  form: FormState;
}

export async function createBienTypeAction(
  initialState: CreateBienTypeState,
  formData: FormData
): Promise<CreateBienTypeState> {
  const data: BienTypeForm = {
    code: formData.get("code") as string,
    name: formData.get("name") as string,
    description: formData.get("description") as string,
    is_active: formData.get("is_active") === "on" || formData.get("is_active") === "true",
  };

  let form = { ...initialState.form };

  const validatedFields = BienTypeFormSchema.safeParse(data);

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
    await BienTypeService.create(data);
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
