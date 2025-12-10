"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { CommuneForm } from "@/schemas/communes/commune-form.schema";
import { CommunesService } from "@/services/communes.service";

export async function updateCommuneAction(data: CommuneForm,id: number ): Promise<FormState> {
  try {
    await CommunesService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
