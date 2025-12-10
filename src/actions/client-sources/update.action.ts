"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientSourceForm } from "@/schemas/client-sources/client-source-form.schema";
import { ClientSourceService } from "@/services/client-source.service";

export async function updateClientSourceAction(data: ClientSourceForm, id: number): Promise<FormState> {
  try {
    await ClientSourceService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
