"use server";

import { FormState } from "@/lib/definitions";
import { handleServerActionError } from "@/lib/server.helper";
import { BienStatusForm } from "@/schemas/bien-status/bien-status-form.schema";
import { BienStatusService } from "@/services/bien-status.service";

export async function updateBienStatusAction(data: BienStatusForm, id: number): Promise<FormState> {
  try {
    await BienStatusService.update(data, id);
    return { isOk: true };
  } catch (error) {
    const result = await handleServerActionError(error);
    return {
      isOk: false,
      ...result,
    };
  }
}
