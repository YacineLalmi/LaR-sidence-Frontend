"use server";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/bien.service";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { handleServerActionError } from "@/lib/server.helper";

export async function updateBienAction(data: BienForm, id:number): Promise<FormState> {
  try {
    await BienService.update(data, id);
    return {
      isOk: true,
    };
  } catch (error) {

    const result = await handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}
