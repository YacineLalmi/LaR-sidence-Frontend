"use server";

import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienStatusService } from "@/services/BienStatus.service";

export type DeleteBienStatusState = FormState;

export async function deleteBienStatusAction(
  initialState: DeleteBienStatusState,
  formData: FormData
): Promise<DeleteBienStatusState> {
  const id = parseInt(formData.get("id") as string);

  if (!id) {
    return {
      isOk: "NOK",
      errorMessage: "ID is required",
      errorCode: ErrorCodes.VALIDATION_ERROR,
    };
  }

  try {
    await BienStatusService.delete(id);
    return { isOk: "OK" };
  } catch (error) {
    return {
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong",
    };
  }
}
