"use server";
import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { BienService } from "@/services/bien.service";

export async function createBienAction(data: BienForm): Promise<FormState> {
  try {
    await BienService.create(data);
    return {
      isOk: true,
    };
  } catch (error) {
    console.error("Create bien error:", error);
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      errorMessage: result.errorMessage,
      errorCode: result.errorCode,
    };
  }
}
