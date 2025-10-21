"use server";
import { FormState } from "@/lib/definitions";
import { BienService } from "@/services/Bien.service";
import { handleServerActionError } from "@/lib/utils";
import { BienForm } from "@/schemas/biens/bien-form.schema";

export async function createBienAction(data: BienForm): Promise<FormState> {
  try {
    await BienService.create(data);
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
