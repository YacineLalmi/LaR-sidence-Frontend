"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { BienTypeForm } from "@/schemas/bien-type/bien-type-form.schema";
import { BienTypeService } from "@/services/bien-type.service";

export async function updateBienTypeAction(data: BienTypeForm, id: number): Promise<FormState> {
  try {
    await BienTypeService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
