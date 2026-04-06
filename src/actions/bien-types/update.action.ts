"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienTypeForm } from "@/schemas/bien-type/bien-type-form.schema";
import { BienTypeService } from "@/services/bien-type.service copy";

export async function updateBienTypeAction(data: BienTypeForm, id: number): Promise<FormState> {
  try {
    await BienTypeService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
