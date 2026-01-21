"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienTypeForm } from "@/schemas/bien-type/bien-type-form.schema";
import { BienTypeService } from "@/services/bien-type.service";

export async function createBienTypeAction(data: BienTypeForm): Promise<FormState> {
  try {
    await BienTypeService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
