"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientTypeForm } from "@/schemas/client-types/client-type-form.schema";
import { ClientTypeService } from "@/services/client-types.service";

export async function createClientTypeAction(data: ClientTypeForm): Promise<FormState> {
  try {
    await ClientTypeService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
