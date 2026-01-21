"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { ClientStatusForm } from "@/schemas/client-status/client-status-form.schema";
import { ClientStatusService } from "@/services/client-status.service";

export async function createClientStatusAction(data: ClientStatusForm): Promise<FormState> {
  try {
    await ClientStatusService.create(data);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
