"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/utils";
import { ClientStatusForm } from "@/schemas/client-status/client-status-form.schema";
import { ClientStatusService } from "@/services/client-status.service";

export async function updateClientStatusAction(data: ClientStatusForm, id: number): Promise<FormState> {
  try {
    await ClientStatusService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
