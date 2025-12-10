"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienTypeForm } from "@/schemas/bien-type/bien-type-form.schema";
import { BienTypeService } from "@/services/BienType.service";

export async function createBienTypeAction(data: BienTypeForm): Promise<FormState> {
  try {
    await BienTypeService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
