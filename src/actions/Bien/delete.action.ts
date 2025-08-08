"use server";
import { ApiResponseError } from "@/lib/utils";
import { ErrorCodes } from "@/lib/constants";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/Bien.service";
import { CreateBien } from "@/schemas/Bien.schema";

export type DeleteBienState = FormState & Partial<CreateBien> & { id?: string };

export async function deleteBienAction(initialState: DeleteBienState, formData: FormData): Promise<DeleteBienState> {
  const id = formData.get("id") as string;

  if (!id) {
    return {
      ...initialState,
      isOk: "NOK",
      errorMessage: "ID is required",
      errorCode: ErrorCodes.VALIDATION_ERROR,
    };
  }

  try {
    await BienService.delete(id);
    return { ...initialState, isOk: "OK" };
  } catch (error) {
    if (error instanceof ApiResponseError) {
      return {
        ...initialState,
        isOk: "NOK",
        errorMessage: error.error,
        errorCode: ErrorCodes.UKNOWN_ERROR,
      };
    }
    return {
      ...initialState,
      isOk: "NOK",
      errorCode: ErrorCodes.UKNOWN_ERROR,
      errorMessage: "Something went wrong",
    };
  }
}
