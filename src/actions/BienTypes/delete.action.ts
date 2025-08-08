"use server";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienTypeService } from "@/services/BienType.service";

export type DeleteBienTypeState = FormState;

export async function deleteBienTypeAction(
  initialState: DeleteBienTypeState,
  formData: FormData
): Promise<DeleteBienTypeState> {
  const id = parseInt(formData.get("id") as string);

  if (!id) {
    return {
      isOk: "NOK",
      errorMessage: "ID is required",
      errorCode: ErrorCodes.VALIDATION_ERROR,
    };
  }

  try {
    await BienTypeService.delete(id);
    return { isOk: "OK" };
  } catch (error) {
    return {
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong",
    };
  }
}
