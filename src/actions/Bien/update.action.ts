"use server";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/Bien.service";
import { handleServerActionError } from "@/lib/utils";
import { BienForm } from "@/schemas/biens/bien-form.schema";

export async function updateBienAction(data: BienForm, id:number): Promise<FormState> {
  try {
    await BienService.update(data, id);
    return {
      isOk: true,
    };
  } catch (error) {

    const result = handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}
